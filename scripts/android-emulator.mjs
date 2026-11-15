#!/usr/bin/env node
import fs from "node:fs";
import fsp from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { spawn, spawnSync } from "node:child_process";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const home = path.resolve(
  process.env.ECO_ANDROID_HOME || path.join(root, "work", "android-tools"),
);
const windows = process.platform === "win32";
const host = windows
  ? "windows"
  : process.platform === "darwin"
    ? "macosx"
    : "linux";
const arch = process.arch === "arm64" ? "arm64-v8a" : "x86_64";
const name = "EcoCollect_Lite";
const image = `system-images;android-34;google_apis;${arch}`;
const sdk = path.join(home, "sdk");
const avds = path.join(home, "avd");
const javaDir = path.join(home, "java");
const suffix = windows ? ".exe" : "";
const adb = path.join(sdk, "platform-tools", "adb" + suffix);
const emulator = path.join(sdk, "emulator", "emulator" + suffix);
const cmdline = path.join(sdk, "cmdline-tools", "latest", "bin");
const sdkmanager = path.join(cmdline, "sdkmanager" + (windows ? ".bat" : ""));
const avdmanager = path.join(cmdline, "avdmanager" + (windows ? ".bat" : ""));
const env = {
  ...process.env,
  ANDROID_HOME: sdk,
  ANDROID_SDK_ROOT: sdk,
  ANDROID_AVD_HOME: avds,
  ANDROID_USER_HOME: path.join(home, "user"),
};
const exists = (p) => fs.existsSync(p);
function fail(message) {
  throw new Error(message);
}
function commandSpec(command, args) {
  if (windows && command.endsWith(".bat")) {
    const quote = (v) => "'" + v.replaceAll("'", "''") + "'";
    return [
      "powershell.exe",
      [
        "-NoProfile",
        "-Command",
        `& ${quote(command)} ${args.map(quote).join(" ")}; exit $LASTEXITCODE`,
      ],
    ];
  }
  return [command, args];
}
function run(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    const [exe, params] = commandSpec(command, args);
    const p = spawn(exe, params, {
      cwd: root,
      env,
      stdio: "inherit",
      ...options,
    });
    p.on("error", reject);
    p.on("exit", (code) =>
      code === 0
        ? resolve()
        : reject(Error(`${path.basename(command)} exited with code ${code}.`)),
    );
  });
}
function space() {
  let dir = home;
  while (!exists(dir)) dir = path.dirname(dir);
  const s = fs.statfsSync(dir);
  return (Number(s.bavail) * Number(s.bsize)) / 1024 ** 3;
}
function validJava(binary) {
  const p = spawnSync(binary, ["-version"], { encoding: "utf8" });
  const major = Number(
    (p.stderr || p.stdout || "").match(/version "(?:1\.)?(\d+)/)?.[1] || 0,
  );
  return p.status === 0 && major >= 21;
}
function selectJava() {
  const bundled = path.join(javaDir, "bin", "java" + suffix);
  const configured =
    env.JAVA_HOME && path.join(env.JAVA_HOME, "bin", "java" + suffix);
  for (const p of [bundled, configured].filter(Boolean))
    if (exists(p) && validJava(p)) {
      env.JAVA_HOME = path.dirname(path.dirname(p));
      return true;
    }
  const probe = spawnSync(windows ? "where" : "which", ["java"], {
    encoding: "utf8",
  });
  const p = probe.stdout?.trim().split(/\r?\n/)[0];
  if (p && validJava(p)) {
    env.JAVA_HOME = path.dirname(path.dirname(fs.realpathSync(p)));
    return true;
  }
  return false;
}
async function download(url, target, checksum, algorithm = "sha256") {
  const response = await fetch(url);
  if (!response.ok || !response.body)
    fail(`Download failed: ${response.status} ${url}`);
  await pipeline(Readable.fromWeb(response.body), fs.createWriteStream(target));
  if (checksum) {
    const hash = crypto.createHash(algorithm);
    for await (const chunk of fs.createReadStream(target)) hash.update(chunk);
    if (hash.digest("hex").toLowerCase() !== checksum.toLowerCase()) {
      await fsp.unlink(target);
      fail("Download checksum mismatch.");
    }
  }
}
async function sdkArchive() {
  const xml = await (
    await fetch("https://dl.google.com/android/repository/repository2-1.xml")
  ).text();
  const packages = [
    ...xml.matchAll(
      /<remotePackage\b[^>]*path="cmdline-tools;([^"]+)"[\s\S]*?<\/remotePackage>/g,
    ),
  ]
    .filter((m) => m[0].includes('ref="channel-0"'))
    .sort((a, b) => parseFloat(b[1]) - parseFloat(a[1]));
  for (const p of packages) {
    const archive = p[0]
      .match(/<archive>[\s\S]*?<\/archive>/g)
      ?.find((a) => a.includes(`<host-os>${host}</host-os>`));
    if (!archive) continue;
    const url = archive.match(/<url>(.*?)<\/url>/)?.[1];
    const checksum = archive.match(/<checksum\b[^>]*>(.*?)<\/checksum>/)?.[1];
    if (url)
      return {
        url: "https://dl.google.com/android/repository/" + url,
        checksum,
      };
  }
  fail("No official SDK command-line tools package found for this OS.");
}
async function unzip(archive, dest) {
  await fsp.mkdir(dest, { recursive: true });
  if (windows) {
    await run("powershell.exe", [
      "-NoProfile",
      "-Command",
      `Expand-Archive -LiteralPath '${archive.replaceAll("'", "''")}' -DestinationPath '${dest.replaceAll("'", "''")}' -Force`,
    ]);
  } else await run("unzip", ["-q", archive, "-d", dest]);
}
async function setup() {
  console.log(
    `EcoCollect lightweight emulator setup: ${process.platform}/${process.arch}`,
  );
  const free = space();
  console.log(`Available disk space: ${free.toFixed(1)} GiB`);
  if (free < 20)
    fail(
      "At least 20 GiB free space is required before installation (emulator files plus working space). Free space or set ECO_ANDROID_HOME to a drive with enough space. No downloads were started.",
    );
  if (windows && process.arch !== "x64")
    fail(
      "This setup supports Intel/AMD x64 Windows. Windows ARM requires a separately verified emulator setup.",
    );
  await fsp.mkdir(home, { recursive: true });
  await fsp.mkdir(avds, { recursive: true });
  if (!selectJava()) {
    console.log(
      "Downloading a private Eclipse Temurin JDK 21 (no system Java changes).",
    );
    const javaOS = windows
      ? "windows"
      : process.platform === "darwin"
        ? "mac"
        : "linux";
    const javaArch = process.arch === "arm64" ? "aarch64" : "x64";
    const assets = await (
      await fetch(
        `https://api.adoptium.net/v3/assets/latest/21/hotspot?architecture=${javaArch}&image_type=jdk&os=${javaOS}&vendor=eclipse`,
      )
    ).json();
    const pkg = assets[0]?.binary?.package;
    if (!pkg) fail("JDK download metadata unavailable.");
    const archive = path.join(home, windows ? "java.zip" : "java.tar.gz");
    await download(pkg.link, archive, pkg.checksum);
    const temp = path.join(home, "java-unpack");
    await fsp.mkdir(temp, { recursive: true });
    if (windows) await unzip(archive, temp);
    else await run("tar", ["-xzf", archive, "-C", temp]);
    const entry = (await fsp.readdir(temp))[0];
    const extracted = path.join(
      temp,
      entry,
      process.platform === "darwin" ? "Contents/Home" : "",
    );
    await fsp.rename(extracted, javaDir);
    await fsp.rm(temp, { recursive: true, force: true });
    await fsp.unlink(archive);
    selectJava();
  }
  if (!exists(sdkmanager)) {
    console.log("Downloading official Android command-line tools.");
    const meta = await sdkArchive();
    const zip = path.join(home, "commandline.zip");
    await download(meta.url, zip, meta.checksum, "sha1");
    const temp = path.join(home, "sdk-unpack");
    await unzip(zip, temp);
    await fsp.mkdir(path.dirname(path.dirname(cmdline)), { recursive: true });
    await fsp.rename(path.join(temp, "cmdline-tools"), path.dirname(cmdline));
    await fsp.rm(temp, { recursive: true, force: true });
    await fsp.unlink(zip);
  }
  console.log(
    "Review Android SDK licences in this terminal. Accept only if you agree.",
  );
  await run(sdkmanager, [`--sdk_root=${sdk}`, "--licenses"]);
  await run(sdkmanager, [
    `--sdk_root=${sdk}`,
    "platform-tools",
    "emulator",
    image,
  ]);
  if (!exists(path.join(avds, name + ".ini"))) {
    await new Promise((resolve, reject) => {
      const [exe, args] = commandSpec(avdmanager, [
        "create",
        "avd",
        "--name",
        name,
        "--package",
        image,
        "--device",
        "pixel",
      ]);
      const p = spawn(exe, args, {
        cwd: root,
        env,
        stdio: ["pipe", "inherit", "inherit"],
      });
      p.stdin.end("no\n");
      p.on("error", reject);
      p.on("exit", (code) =>
        code === 0 ? resolve() : reject(Error("AVD creation failed.")),
      );
    });
  }
  const config = path.join(avds, name + ".avd", "config.ini");
  let text = await fsp.readFile(config, "utf8");
  const settings = {
    "hw.ramSize": "1536",
    "hw.cpu.ncore": "2",
    "vm.heapSize": "192",
    "hw.lcd.width": "720",
    "hw.lcd.height": "1280",
    "hw.lcd.density": "320",
    "disk.dataPartition.size": "2G",
    "hw.gpu.enabled": "yes",
    "hw.gpu.mode": "auto",
    "hw.keyboard": "yes",
    "hw.camera.back": "emulated",
    "hw.camera.front": "none",
    showDeviceFrame: "no",
    "fastboot.forceColdBoot": "yes",
  };
  for (const [key, value] of Object.entries(settings)) {
    const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`^${escaped}=.*$`, "m");
    text = re.test(text)
      ? text.replace(re, `${key}=${value}`)
      : text + `\n${key}=${value}`;
  }
  await fsp.writeFile(config, text + "\n");
  console.log("Setup ready. Run: npm run emulator:start");
}
async function start() {
  if (!exists(emulator) || !exists(adb))
    fail("Run npm run emulator:setup first.");
  selectJava();
  if (
    spawnSync(emulator, ["-accel-check"], { env, stdio: "inherit" }).status !==
    0
  )
    fail(
      "Hardware acceleration is unavailable. On Windows enable BIOS virtualization and Windows Hypervisor Platform, then restart Windows.",
    );
  const devices =
    spawnSync(adb, ["devices"], { env, encoding: "utf8" }).stdout || "";
  let device = devices.match(/^(emulator-\d+)\s+device/m)?.[1];
  let child;
  if (!device) {
    const log = fs.openSync(path.join(home, "emulator.log"), "a");
    child = spawn(
      emulator,
      [
        "-avd",
        name,
        "-port",
        "5554",
        "-memory",
        "1536",
        "-cores",
        "2",
        "-gpu",
        "auto",
        "-no-snapshot",
        "-no-boot-anim",
        "-no-audio",
      ],
      { env, stdio: ["ignore", log, log] },
    );
    child.on("error", (e) => console.error(e.message));
    device = "emulator-5554";
    console.log(
      "Booting EcoCollect_Lite. First boot can take several minutes.",
    );
  }
  const until = Date.now() + 240000;
  let booted = false;
  while (Date.now() < until) {
    if (child && child.exitCode !== null)
      fail("Emulator stopped. Check work/android-tools/emulator.log.");
    const state = spawnSync(
      adb,
      ["-s", device, "shell", "getprop", "sys.boot_completed"],
      { env, encoding: "utf8", timeout: 5000 },
    );
    if (state.stdout?.trim() === "1") {
      booted = true;
      break;
    }
    await new Promise((r) => setTimeout(r, 2000));
  }
  if (!booted) fail("Emulator boot timed out. See emulator.log.");
  await run(adb, ["-s", device, "reverse", "tcp:4000", "tcp:4000"]);
  await run(adb, ["-s", device, "reverse", "tcp:8081", "tcp:8081"]);
  for (const scale of [
    "window_animation_scale",
    "transition_animation_scale",
    "animator_duration_scale",
  ])
    await run(adb, [
      "-s",
      device,
      "shell",
      "settings",
      "put",
      "global",
      scale,
      "0",
    ]);
  console.log(
    "Android ready. Keep this terminal open. Expo installs the SDK-compatible Expo Go app on first run.",
  );
  console.log(
    "Start the backend separately, then sign in using the same demo accounts.",
  );
  env.ANDROID_SERIAL = device;
  env.EXPO_PUBLIC_API_URL = "http://127.0.0.1:4000/api/v1";
  const expo = path.join(
    root,
    "mobile-app",
    "node_modules",
    "expo",
    "bin",
    "cli",
  );
  try {
    await run(
      process.execPath,
      [expo, "start", "--go", "--android", "--localhost", "--port", "8081"],
      { cwd: path.join(root, "mobile-app") },
    );
  } finally {
    if (child && child.exitCode === null) child.kill();
  }
}
async function doctor() {
  console.log(
    JSON.stringify(
      {
        os: process.platform,
        architecture: process.arch,
        ramGiB: os.totalmem() / 1024 ** 3,
        freeGiB: Number(space().toFixed(1)),
        installDirectory: home,
        sdkInstalled: exists(sdkmanager),
        emulatorInstalled: exists(emulator),
        javaAvailable: selectJava(),
        requiredFreeGiB: 20,
      },
      null,
      2,
    ),
  );
}
try {
  const action = process.argv[2] || "doctor";
  if (action === "doctor") await doctor();
  else if (action === "setup") await setup();
  else if (action === "start") await start();
  else fail("Use doctor, setup or start.");
} catch (e) {
  console.error("\n" + e.message);
  process.exitCode = 1;
}

# EcoCollect lightweight Android emulator setup

Use the existing Expo React Native app as a real Android app inside Google's Android Emulator. The web preview is optional. The scripts install the official SDK command-line tools instead of the full Android Studio editor. This reduces editor overhead; an Android virtual device still consumes significant RAM and storage.

## What the scripts configure

- One Android 14 / API 34 Google APIs device, matching the host CPU: ARM64 on Apple Silicon, x86_64 on Intel/AMD.
- 1536 MB guest RAM, two CPU cores, 720 × 1280 display, hardware GPU acceleration.
- Snapshots disabled to save disk, animations disabled after boot, emulated rear camera.
- A private Temurin JDK 21 only when a working Java installation is unavailable.
- SDK, AVD and logs under ignored `work/android-tools`. No global Java replacement or shell profile edits.
- `adb reverse` connects the emulator to host API port 4000 and Metro port 8081.
- Expo Go runs the SDK-compatible app. A first launch downloads the appropriate Expo Go APK through Expo CLI.

Google lists 16 GB RAM and 16 GB disk for the best emulator experience. An 8 GB Mac may run this smaller configuration, but smooth performance is not guaranteed. This installer requires 20 GiB free to leave working space. Close unused apps and run one emulator. A browser window can replace a running web development server during mobile work if memory is tight.

## Mac

Use Node 22 LTS. From the repository root:

```
npm run emulator:doctor
npm run emulator:setup
```

Setup checks free space before any downloads. Review and accept the Android SDK licences in the terminal only if you agree. The first setup downloads Java if necessary, official SDK tools, the emulator and one system image.

After setup, keep the API running in another terminal:

```
npm --prefix backend run build
npm --prefix backend start
```

Stop any existing Expo/Metro server using port 8081, then run:

```
npm run emulator:start
```

Alternatively double-click `scripts/setup-emulator.command` and then `scripts/start-emulator.command`. Terminal must be able to find Node in PATH. Keep the emulator terminal open while developing. The app uses Fast Refresh when source files are saved.

If installing on a different drive with enough space, use the same environment variable for both setup and start:

```
ECO_ANDROID_HOME="/Volumes/YourDrive/EcoAndroid" npm run emulator:setup
ECO_ANDROID_HOME="/Volumes/YourDrive/EcoAndroid" npm run emulator:start
```

## Windows 10 or 11 on Intel/AMD x64

Use a local path such as `C:\dev\ecocollect` for the repository.

1. Install Node 22 LTS, Git and PostgreSQL 16. A remote PostgreSQL URL can also be used. Set `backend/.env` using `.env.example` with your own database, JWT secret and demo password.
2. Enable CPU virtualization (Intel VT-x or AMD SVM) in BIOS/UEFI. In **Turn Windows features on or off**, enable **Windows Hypervisor Platform**, then restart. The setup script does not change Windows features or restart your PC.
3. In a terminal at the repository root, install dependencies and seed the configured database:

```
npm ci
npm --prefix backend ci
npm --prefix admin-web ci
npm --prefix mobile-app ci
npm --prefix backend run seed
npm run emulator:setup
```

4. Double-click `scripts/start-system-windows.cmd` to start the API, web and emulator. Or start API/web in separate terminals and run `npm run emulator:start`.

For the initial emulator installation, double-click `scripts/setup-emulator.cmd`. Use `scripts/start-emulator.cmd` for later mobile-only runs. SDK licences are interactive. Windows ARM is not covered by this script; it fails with a clear message instead of installing an incompatible image.

To use another drive in PowerShell:

```
$env:ECO_ANDROID_HOME='D:\EcoAndroid'
npm run emulator:setup
npm run emulator:start
```

## Testing inside Android

- Sign in with the same customer or picker account used by the web system.
- Customer: create pickup → check status → wallet/history/profile.
- Admin web: assign pickup to picker.
- Picker: start job → record weights → take/upload photo → complete with location verification.
- To simulate Colombo GPS, open the emulator's extended controls (three dots), select Location and send latitude `6.9271`, longitude `79.8612`. That matches the seeded customer address. A distant location should send the collection to admin review.
- The emulated camera produces synthetic evidence. Use a real Android phone before claiming production camera or location accuracy.
- FCM background push still needs the Firebase configuration documented in README. Expo Go does not verify that feature.

## Installable APK

The current source is an Expo mobile app. Expo Go is the lightweight development runtime; it is not the app's own signed APK. For an installable EcoCollect APK, use the included EAS preview profile with an authenticated Expo account:

```
cd mobile-app
npx eas-cli build --platform android --profile preview
```

Cloud builds avoid running the heavier Gradle compilation locally. Local APK builds require additional Android build tools and more free disk/RAM. No signed APK is claimed to exist until a build actually succeeds.

## Validation status

The setup script syntax and doctor/low-disk failure path were tested on this Apple Silicon Mac. Installation stopped before downloads because only 11.5 GiB was available. An emulator was not installed or booted. Windows commands are supplied but have not been executed on Windows hardware. Existing app Android bundle export, TypeScript and PostgreSQL integration tests passed separately; they do not replace an emulator runtime test.

## Official references

- https://developer.android.com/studio/run/emulator
- https://developer.android.com/tools/sdkmanager
- https://developer.android.com/tools/avdmanager
- https://developer.android.com/studio/run/emulator-acceleration
- https://developer.android.com/studio/run/emulator-networking
- https://docs.expo.dev/workflow/android-studio-emulator/

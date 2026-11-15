#!/bin/sh
cd -- "$(dirname -- "$0")/.." || exit 1
node scripts/android-emulator.mjs start
printf '\nPress Enter to close.'
read -r answer

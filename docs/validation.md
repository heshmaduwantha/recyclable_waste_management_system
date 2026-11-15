# Validation record

Verified locally against PostgreSQL 16 and Chrome. The Browser plugin was unavailable, so Playwright with installed Chrome was used.

- Backend TypeScript production build: passed.
- Web TypeScript/Vite production build: passed.
- Mobile TypeScript: passed.
- Expo web export: passed.
- Expo Android Hermes bundle export: passed. This is a bundle, not a signed installable APK.
- Integration tests: passed. JWT/role isolation, wrong password, other customer access rejection, photo requirement, concurrent completion with exactly one credit, badges, outside-radius review and single administrative approval were exercised.
- Desktop web at 1440×960: login, request table, overview chart, rates and customer request submission passed.
- Responsive web at 390×844: rendered and visually inspected.
- Expo web at 390×844: picker login, job details, start, image upload and completion with browser GPS permission passed. A 1.5 kg plastic collection earned 75 points, persisted in the customer's PostgreSQL wallet.
- No JavaScript page errors were observed in the tested browser paths.

The visual review compared the generated concept with actual sidebar, typography, filters, KPI layout, request table and mobile navigation. Real database content replaces the concept's illustrative rows. Mobile picker jobs use three text tabs; customer uses four tabs. No real telecom or Gemini calls exist.

Not physically verified: Android camera/GPS permission prompts, Google Maps handoff on a phone, FCM delivery, iOS native behavior, launch-time/service uptime targets and load testing. Firebase credentials were not provided. In-app notifications and active-screen polling work. Signed APK creation requires an Android build environment or an authenticated EAS account.

Dependency audit fixes were applied without forcing incompatible framework upgrades. Some transitive SDK/dev-tool advisories remain and require coordinated dependency upgrades before public production deployment.

# IRhythm

IRhythm is a music streaming mobile app: browse albums and artists, search for
songs, build playlists, like tracks, and play music with a full-screen "Now
Playing" player and a persistent mini-player. It's built with
[Expo](https://expo.dev) (managed workflow) + React Native, React Navigation,
`expo-av` for audio playback, Zustand for state, and Amazon Cognito
(`amazon-cognito-identity-js`) for email/password authentication.

This app is built against the IRhythm REST API contract. The backend is being
developed in parallel and may not be deployed yet — the app is designed to
boot and render correctly (with loading/empty states) even before a live API
is reachable.

## Try it now (recommended — no build required)

The fastest way to run IRhythm on a real phone is with **Expo Go**:

1. Install dependencies:

   ```bash
   npm install
   ```

2. (Optional) Copy `.env.example` to `.env` and fill in your API/Cognito
   values. If you skip this, the app boots with placeholder config — screens
   still render, but sign-in and network calls won't succeed until real
   values are set.

   ```bash
   cp .env.example .env
   ```

3. Start the dev server:

   ```bash
   npx expo start
   ```

4. Install the **Expo Go** app on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)), then scan the QR code printed in your terminal (or shown at `http://localhost:8081`) with your phone's camera (iOS) or the Expo Go app (Android).

That's it — the app runs on your device, hot-reloading as you edit code. No
Xcode, Android Studio, or paid developer account needed for this path.

## Producing a real installable file (APK / IPA) later

When you're ready to distribute a standalone build (outside of Expo Go), use
[EAS Build](https://docs.expo.dev/build/introduction/). A `preview` build
profile is already configured in `eas.json` for internal distribution.

1. Create a free Expo account at [expo.dev](https://expo.dev) if you don't
   have one, then log in from the CLI:

   ```bash
   npx eas login
   ```

2. **Android APK** — this works with just a free Expo account, no Google
   Play account required to produce and side-load the file:

   ```bash
   npx eas build --platform android --profile preview
   ```

   EAS will build in the cloud and give you a link to download an installable
   `.apk` when it finishes.

3. **iOS IPA** — building for iOS distribution (even ad-hoc/internal)
   requires an active **paid Apple Developer Program account** ($99/year),
   because Apple requires provisioning profiles signed by an enrolled
   developer account. Once you have one:

   ```bash
   npx eas build --platform ios --profile preview
   ```

   EAS will prompt you to log in with your Apple ID and handle certificates
   and provisioning profiles automatically.

This repository intentionally does not include native `ios/`/`android/`
project folders (`expo prebuild` was never run) — all builds go through EAS's
managed build service, and `expo run:ios` / `expo run:android` are not
supported without generating those folders first.

## Environment variables

See `.env.example` for the full list. These are read in `app.config.ts` and
exposed to the app via `Constants.expoConfig.extra`:

| Variable                | Purpose                                          |
| ------------------------ | ------------------------------------------------ |
| `API_BASE_URL`           | Base URL of the IRhythm REST API                  |
| `COGNITO_USER_POOL_ID`   | Cognito User Pool ID used for authentication      |
| `COGNITO_CLIENT_ID`      | Cognito App Client ID (no client secret)          |
| `AWS_REGION`             | AWS region the User Pool lives in                 |

`.env` is git-ignored — never commit real credentials. `.env.example`
documents the shape without real values.

## Project structure

```
src/
  api/          Typed REST client + endpoint wrappers for the API contract
  auth/         Cognito SRP sign in / sign up
  components/   Reusable UI building blocks (buttons, cards, track rows, ...)
  navigation/   React Navigation stacks/tabs (Auth, Main tabs, Root)
  screens/      Screen components, grouped by feature
  store/        Zustand stores (auth, player, library/likes)
  theme/        Centralized colors + typography per the brand spec
  utils/        Small helpers (JWT decoding, etc.)
scripts/
  generate-assets.mjs   Rasterizes the brand SVG logo into app icons/splash
```

## Development scripts

```bash
npx tsc --noEmit          # type-check the whole app
npx expo start            # run the dev server (Expo Go / simulators)
npx expo export --platform web   # production bundle smoke test
```

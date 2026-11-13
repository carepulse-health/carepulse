# CarePulse Android handoff

This guide covers preparing the CarePulse patient preview for an Android wrapper. The app currently uses sample-only records; real clinic sign-in, appointments, and screening must remain unavailable until the clinic's existing system is connected and the screening safety guide is approved.

## Important build check

This repository currently builds as a TanStack Start app targeting a Cloudflare Worker. Capacitor needs a web assets folder containing an `index.html` file. Before adding the Android wrapper, confirm that a Capacitor-specific web build can produce that file and all client assets. Set Capacitor's `webDir` to that verified folder; do not point it at a Worker/server bundle. The current project has not been configured or tested for this static Android handoff.

## Prerequisites

- Node.js and the project's package manager
- Android Studio with an Android SDK and an emulator or USB-debuggable Android device
- A verified web build folder containing `index.html`

## Add Capacitor and Android

From the project root, install the Capacitor runtime and CLI, then initialize the app with the CarePulse display name and an organization-owned reverse-domain app ID. Configure `webDir` to the verified web build folder described above.

```sh
npm install @capacitor/core
npm install --save-dev @capacitor/cli
npx cap init
```

Install the Android platform package at the same Capacitor major version as the core runtime and CLI, then generate the native project:

```sh
npm install @capacitor/android
npx cap add android
```

After each web change, build the web assets and synchronize them to Android:

```sh
npm run build
npx cap sync android
npx cap open android
```

Run on a connected device or emulator with `npx cap run android`, or use Android Studio to run and package the app. Create a signed release bundle in Android Studio only after the clinic owner approves the app identity, privacy disclosures, and release configuration.

## App icon and splash artwork

Prepare the source artwork before generating native assets. Capacitor's asset guide specifies icon images of at least 1024 × 1024 pixels and splash images of at least 2732 × 2732 pixels. Use the documented `assets/` filenames (`icon-only.png`, optional foreground/background icon layers, `splash.png`, and optional `splash-dark.png`), then generate assets with:

```sh
npm install --save-dev @capacitor/assets
npx capacitor-assets generate --android
```

Check the result on Android 12 and later, where the operating system presents the splash screen differently. Do not use patient photos, clinic marks, or brand artwork without authorization.

## Still required before release

- Confirm a static client build and the Capacitor `webDir` for this TanStack Start project.
- Confirm the clinic's existing database is connected; reuse its existing records and tables rather than creating duplicates.
- Complete real authentication and patient-data review only after the existing clinic system is available.
- Obtain and implement the clinic-approved screening safety specification before enabling any symptom screening or AI assistant.
- Supply approved app icon/splash artwork, package ID, privacy disclosures, and Android signing credentials.

References: [Capacitor Android setup](https://capacitorjs.com/docs/android), [Capacitor installation](https://capacitorjs.com/docs/getting-started), [icons and splash screens](https://capacitorjs.com/docs/guides/splash-screens-and-icons).
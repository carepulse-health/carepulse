# CarePulse Patient App

## What to build
- Replace the starter screen with a polished, mobile-first patient app dashboard using CarePulse branding and realistic, clearly labeled sample records.
- Add usable in-app views for doctor discovery, appointment browsing and request preview, appointment history/pass preview, notifications, and the AI assistant entry point.
- Add patient sign-up, sign-in, verification, and password-recovery screens as integration-ready surfaces, without claiming authentication or patient data is live before the clinic's existing system is connected.
- Keep appointments, passes, QR/reference display, profile information, and health screening in sample-only mode; do not create tables or transmit medical information. Do not invent the missing AI screening safety specification.
- Prepare a Capacitor handoff guide covering Android setup, build/sync/package steps, and app icon/splash asset requirements.

## Approach
- Build this as a responsive web app that works especially well on phone screens, with compact desktop adaptation, accessible controls, and the project's existing UI components.
- Use a small, explicit sample dataset and local UI state for navigation and previews. Clearly mark sample-only features and avoid fake sign-in, booking submission, QR verification, notifications, or AI medical advice.
- Preserve the requirement to connect the exact clinic-owned Supabase project. Wait for the owner to connect it through project settings before implementing or validating real authentication, profile records, RLS-secured clinic data, bookings, or notifications. Reuse existing tables only; do not create duplicates.
- Keep the app compatible with a future Capacitor wrapper; document what remains blocked pending database access and the separate AI safety specification.

## Technical details
- Replace the template `/` page and define route-specific CarePulse metadata.
- Establish healthcare-oriented semantic color and typography tokens in `src/styles.css`; use the installed Lucide and shadcn UI components.
- Add a root `AGENTS.md` rule for the chosen UI-module boundary and a lean `roadmap.md` to track this multi-part delivery.
- Run the existing routing test, inspect the preview at mobile and desktop sizes, and check current build diagnostics after implementation.

## Blocked follow-up
- Live authentication, profile storage, doctor/clinic queries, booking, secure digital passes, notifications, and real AI screening require the user to connect the same existing clinic database and provide/configure the required screening safety specification.
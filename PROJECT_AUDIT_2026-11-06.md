# Manisha Properties — Project Audit
Date: 2026-11-06 (IST)
Project: /Users/aaru/Documents/Docs/Manisha/manisha-properties
Audit mode: read-only repository, build, production HTTP, Chrome and PWA validation. No commits or deployments made.

## Governing scope recovered
- Existing Manisha Properties personal portfolio website; preserve the current site, branding and features.
- Prefer a completely free/safest hosting and operating approach.
- PWA should be installable across iPhone, Android, Mac and Windows.
- Website and YouTube Manager are separate projects. Do not merge or let the manager disrupt this website.

## Repository and recovery
- Stack: React 18, Vite 5, TypeScript, React Router 7, Tailwind 3; vite-plugin-pwa 2.
- Branch: feature/pwa-installable-app; HEAD 21ff3c6; origin/feature/pwa-installable-app.
- main/origin/main: 7b59004.
- Feature branch is 2 commits ahead of main; no divergence reported.
- Recovery tag: backup/pre-pwa-2026-11-02 at main baseline.
- Working tree: 8 modified tracked files; no untracked files at audit snapshot.
- Modified: dist/index.html, src/App.tsx, src/components/Navbar.tsx, src/components/ShareContact.tsx, src/components/VideoCard.tsx, src/index.css, src/pages/Videos.tsx, vite.config.ts.
- No reset, checkout, commit, clean, destructive action or deployment performed.
- dist is partially tracked (four files), while generated assets are ignored. This mixed build-artifact state should be corrected in a deliberate Git hygiene change, preserving the recovery tag.

## Application features inspected
- Routes: /, /about, /videos.
- Home: portfolio hero, property service cards, sale/rental featured videos, contact CTAs and enquiry form.
- About: profile/about content.
- Videos: four YouTube categories (Sale, Rental, Purchased, Occupied), responsive category gallery, refresh and load-more handling.
- Contact: phone, WhatsApp, share panel, generated website QR and YouTube QR.
- Branding/assets: dark charcoal and gold styling; logo, profile, visiting card, category images and PWA icons.
- YouTube Manager is not part of this repo scope.

## Automated quality checks
- npm run lint: PASS.
- npm run typecheck: PASS.
- npm run build -- --outDir /tmp/manisha-properties-full-audit-dist: PASS.
- git diff --check: PASS.
- npm audit --omit=dev: 0 known production dependency vulnerabilities at audit time.
- No dedicated unit/e2e test script or test framework found in package scripts.

## Browser and route validation
- Google Chrome tested the production-mode local build served from port 4177.
- Home, About and Videos routes rendered at narrow/mobile and tablet widths without horizontal document overflow in sampled widths 320, 390 and 768.
- Gallery tested at 320, 360, 390, 430, 768, 1024 and 1440 CSS px with real YouTube content where loaded.
- Sale/Rental modal opening and close button placement verified; 48x48 px gold close button; measured foreground/background contrast 13.35:1.
- Grid observed as one column on narrow screens, two columns on tablet and three on wide desktop.
- Escape-key closing is implemented in source but automated interaction confirmation was inconclusive in this run; retest during accessibility work.
- Actual playlist API results in production-mode local build: Sale 3 videos, Rental 2, Purchased 1, Occupied 0. YouTube API request returned HTTP 200. Occupied empty state needs business confirmation.
- A development-mode preview can lack VITE_YOUTUBE_API_KEY because the key is only present in production-mode environment files; use production-mode preview for reliable video verification. Do not copy secrets into reports or commit them.

## Production and deployment observations
- https://manishaproperties.in responds HTTP 200.
- /, /about, /videos, /manifest.webmanifest, /sw.js, /registerSW.js, /robots.txt, /sitemap.xml and PWA icons respond HTTP 200.
- Live asset hashes differ from the current local feature branch build; deployed commit identity has not been verified. Treat production as separate from this uncommitted working tree.
- Previously referenced Vercel preview URL returned 404 DEPLOYMENT_NOT_FOUND during the earlier check; a new preview is required before release.
- No production deployment was triggered.

## PWA
- Chrome parsed the generated manifest with no manifest errors.
- Generated service worker and registration script successfully.
- Offline navigation smoke test passed for /, /about and /videos after caching.
- Dynamic YouTube content requires network connectivity.
- Manifest currently sets display standalone, display_override window-controls-overlay/standalone and orientation portrait.
- Precache is configured with maximumFileSizeToCacheInBytes = 3 MiB. Large visiting-card image should be checked for precache inclusion and offline image behaviour; image optimization is a candidate.
- Actual install flows on iOS Safari, Android Chrome, macOS and Windows have not been manually completed.

## SEO, privacy, security and accessibility findings
- Route-specific title, description, canonical, Open Graph and Twitter metadata are present; robots.txt and sitemap.xml are present.
- Home page includes RealEstateAgent JSON-LD. Verify all business assertions (DLF authorization, years, sales/client counts, address, opening hours, service area and founding date) against owner-approved facts before treating them as validated.
- Google Analytics tag is present. No privacy policy/analytics disclosure was found in inspected project files; assess and add appropriate owner-approved disclosure.
- YouTube Data API key is injected into client-side code by Vite (expected for direct browser API use); verify key is restricted by HTTP referrer to approved domains and to YouTube Data API only. Key values were not printed or copied.
- .env files are ignored and none are tracked by Git.
- Gallery has accessible close label and focus-visible styling, but complete focus trapping/restoration and keyboard-operable ARIA tab behaviour need improvement.
- Mobile navigation toggle lacks explicit accessible name/aria-expanded state and keyboard refinements.
- No privacy, accessibility, Lighthouse, Core Web Vitals, structured-data validator or cross-device install acceptance test has been completed.

## Audit conclusion
The local feature branch is a healthy, buildable release candidate foundation, not a production-approved release. The original gallery responsiveness defect is addressed in the local branch and passed Chrome viewport checks. Main remaining release risks are production commit reconciliation, Git dist hygiene, accessibility completion, API-key restriction verification, business-fact/privacy validation, and real device installation testing.

## Ordered next steps
1. Preserve current changes; implement modal and mobile navigation accessibility (focus, Escape, tab keyboard semantics, aria state).
2. Validate PWA cache coverage, optimize large static image(s) without visible quality loss, and test offline states.
3. Reconcile generated dist tracking and verify current Vercel deployment/branch/commit without touching production.
4. Verify API key restrictions and business/schema facts; add owner-approved privacy disclosure.
5. Run full route, responsive, accessibility, SEO, performance and cross-platform install regression.
6. Create a new private preview and verify it; production release only after explicit user approval.


## Post-audit execution — 2026-11-06
Started the first ordered follow-up: accessibility and keyboard support.
- Gallery dialog now moves focus to its close control on open, traps Tab navigation within the dialog, and restores focus to the previously focused element on close.
- Category tabs now expose tab/panel relationships, roving tabIndex, and ArrowLeft/ArrowRight/Home/End keyboard selection.
- Mobile navigation toggle now has a descriptive accessible name, aria-expanded and aria-controls; Escape closes the menu and route changes close it; current route links expose aria-current.
- Post-change lint: PASS.
- Post-change TypeScript: PASS.
- Post-change production build: PASS (isolated output /tmp/manisha-properties-post-a11y-dist).
- Post-change git diff --check: PASS.
- Chrome test on the post-change production preview: initial dialog focus moves to Close; Tab moves to active Sale tab; ArrowRight selects and focuses Rental; Escape closes the dialog; mobile menu opens with aria-expanded=true and Escape closes it with aria-expanded=false.
- No commit or deployment performed. All source changes remain local and uncommitted.

- Additional PWA asset check: visiting-card PNG is 2,391,784 bytes and is included in the generated service-worker precache; the 3 MiB precache threshold does not exclude it.
- Additional Chrome keyboard checks: Shift+Tab from the first dialog control wraps to the last; Tab from the last wraps to the first; closing restores focus to the actual Sale tile trigger when opened from keyboard focus.
- Post-audit route checks: Home, About and Videos rendered at 320, 390 and 768 CSS px with no horizontal overflow.

## Vercel account reconciliation (read-only, verified after initial audit)
- Vercel team: Hobby plan (free tier).
- Linked project: manisha-properties, GitHub arvireeth/manisha-properties.
- Latest READY production deployment: commit 21ff3c69b2838ad4575daa6c106d8a6b989f8407 on feature/pwa-installable-app; aliases include manishaproperties.in. This resolves the earlier uncertainty about the live asset hashes: production is on the pushed feature-branch commit, while local working-tree edits are newer and uncommitted.
- Latest READY preview for that same pushed commit: https://manisha-properties-9w0l3wgnv-arvireeths-projects.vercel.app (HTTP 200, noindex). This is a valid preview URL; the previously referenced old preview URL is obsolete.
- Production branch configuration / future branch policy was not changed. No Vercel settings, deployment, aliases or production resources were modified.

- Release safety: the latest production deployment is built from feature/pwa-installable-app. Treat pushes to that branch as potentially production-affecting until the project's configured production branch is deliberately confirmed/changed. Do not push or merge follow-up work from this branch without explicit production-release approval.


## Autonomous continuation — 2026-11-06
### Changes implemented locally on isolated work branch
- Created local branch `work/manisha-release-candidate-2026-11-06` from the existing production-linked feature branch. This isolates work from `feature/pwa-installable-app`; no remote push or deployment has occurred.
- Gallery accessibility: focus on close button, Tab/Shift+Tab focus containment, restore focus on close, tablist semantics, ArrowLeft/ArrowRight/Home/End category navigation.
- Mobile navigation: descriptive toggle label, aria-expanded/controls, Escape closes, route change closes menu, aria-current.
- Share panel: initial focus, focus containment, Escape closes, restore focus to floating trigger.
- Added a Privacy Notice route at /privacy based on inspected site behaviour: Google Analytics, voluntary WhatsApp enquiry handoff, external service links and contact details. Added footer link, SEO metadata and sitemap entry. This is a transparency notice, not legal certification; consent configuration and legal review remain outside the verified scope.
- Removed portrait-only manifest orientation to allow both portrait and landscape layouts.
- Optimized the visiting card image: source PNG 2,391,784 bytes (1024x1536); WebP output 187,074 bytes (same dimensions, cwebp quality 86, measured PSNR ~44.1 dB). Original PNG preserved at docs/legacy-assets/Manisha_Properties_visiting_card-original.PNG. Home and About now reference WebP; original PNG is no longer in public build or PWA precache.
- Removed four tracked generated dist files from Git index using `git rm --cached -r dist`; local dist files were verified to remain on disk. Existing .gitignore already excludes dist. No generated build artifacts are staged for release.

### Final QA results on isolated production-mode build
- npm run lint: PASS, no warnings.
- npm run typecheck: PASS.
- npm run build -- --outDir /tmp/manisha-properties-final-qa-dist: PASS.
- git diff --check: PASS.
- Chrome route/responsive checks at 320, 390, 768 and 1440 CSS px: Home, About, Videos and Privacy pages render; no horizontal overflow in tested viewports.
- YouTube live data in Chrome: Sale 3, Rental 2, Purchased 1, Occupied 0. Occupied empty state remains a business-content confirmation, not a rendering failure.
- Gallery close button remains visible at 48x48 CSS px with high-contrast gold background.
- Share panel: initial focus on Close, Shift+Tab wraps to last focusable control, Escape closes and focus returns to opener.
- Chrome PWA manifest parse: no errors; display standalone; orientation is default/unlocked; 192px and 512px icons both return HTTP 200.
- Chrome Page.getInstallabilityErrors: empty array on the local production-mode preview.
- Offline navigation: /, /about, /videos and /privacy all render from the service worker cache. YouTube dynamic feed still needs network.
- Visiting card WebP is included in the precache; original PNG is excluded.
- A Chrome app bundle named Manisha Properties exists under ~/Applications/Chrome Apps.localized; its installed-app provenance/current release version was not independently confirmed.
- Existing Google Cloud Console session was not authenticated (redirected to Google sign-in). YouTube API key referrer/API restrictions therefore remain unverified. No key values were displayed or changed.
- Vercel CLI was not available locally; an npx CLI bootstrap attempt did not complete and was stopped. No preview deployment was created from the uncommitted local changes.
- Vercel account records still show production on commit 21ff3c6 of feature/pwa-installable-app. No production aliases, settings or deployments were modified.


### Additional accessibility pass — 2026-11-06
- Added a visible-on-focus "Skip to main content" link and a programmatically focusable main landmark.
- Mobile navigation menu now remains present in the DOM while hidden, so aria-controls always references an existing target. The expanded state and Escape dismissal were retested in Chrome.
- Latest RC2 build: lint PASS (no warnings), TypeScript PASS, Vite production build PASS, git diff --check PASS.
- Chrome confirmed first Tab reaches the skip link; Enter moves focus to #main-content. On mobile, the navigation target exists and is hidden while closed, opens with aria-expanded=true, and closes on Escape with aria-expanded=false.
- Home, About, Videos and Privacy routes again passed 390px Chrome rendering with no horizontal overflow.


## Preview deployment and release protection — 2026-11-06
- Release-candidate branch is pushed and clean: work/manisha-release-candidate-2026-11-06.
- Commits: c4a000b (main implementation/accessibility/privacy/PWA/image optimization) and 2bc5878 (skip link and stable mobile navigation target).
- Latest Vercel preview deployment for commit 2bc5878: READY, URL https://manisha-properties-nyaaef2be-arvireeths-projects.vercel.app; target is preview (not production).
- Prior preview for c4a000b is also READY: https://manisha-properties-r2xdjk2da-arvireeths-projects.vercel.app.
- Vercel SSO protection is enabled for preview deployments. Chrome navigation to the preview redirects to Vercel login. The Vercel fetch integration returned HTTP 200 for the preview Privacy route, but full live-browser interaction of the protected preview awaits an authenticated Vercel browser session. Protection was not disabled and no bypass secret was generated.
- Production deployment remains unchanged: READY commit 21ff3c69 on feature/pwa-installable-app, aliases include manishaproperties.in.
- Latest local branch has no uncommitted changes; dist remains ignored and untracked by Git.
- Outstanding authenticated checks: Google Cloud Console sign-in required to inspect YouTube API key HTTP-referrer/API restrictions; Vercel sign-in required for Chrome to exercise the protected preview itself.


## YouTube API key restriction review — verified from authenticated Chrome tab
- Google Cloud project "Youtube API Key" (project ID youtube-api-key-500806) shows API key "API key 1", created 28 June 2026.
- API restriction is already limited to YouTube Data API v3.
- Application restriction is currently "None"; Google Cloud explicitly recommends restricting where the key can be used.
- Vercel project environment variables show VITE_YOUTUBE_API_KEY_PREVIEW assigned to Preview, and VITE_YOUTUBE_API_KEY assigned to Production and Preview. Source code chooses VITE_YOUTUBE_API_KEY_PREVIEW first, then VITE_YOUTUBE_API_KEY.
- The June 28 Google key creation date matches the initial Vercel VITE_YOUTUBE_API_KEY setup date, so it is likely the production key; exact key-to-variable fingerprint matching was not performed. Do not apply application restrictions until that mapping is confirmed.
- Safe target allowlist for the production key should be limited to the verified production hosts (manishaproperties.in, manishaproperties.vercel.app and the Vercel production project alias). Preview-specific key needs its own allowlist including the stable work-branch alias only if preview access is required. Avoid a broad *.vercel.app wildcard.
- No API key was revealed, copied, rotated, or modified.

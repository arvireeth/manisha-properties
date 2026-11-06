# Manisha Properties — Experience Enhancements
**Date:** 6 November 2026
**Branch:** `work/manisha-experience-enhancements-2026-11-06`
**Base:** production-linked release checkpoint `2621bb4`
**Status:** Implemented and deployed to a protected Vercel Preview; awaiting user review. Production unchanged.

## Implemented

### 1. Opening brand introduction
- Added a short logo-led charcoal-and-gold entrance animation.
- Runs once per browser session, lasts about 1.75 seconds, and has a visible Skip intro control.
- Skips automatically when `prefers-reduced-motion: reduce` is enabled.
- Does not hold up page rendering or navigation.

### 2. Weather-responsive experience
- Enhanced the visual treatment with layered rain streaks and drifting glass-like droplets, varied snowflake sizes/speeds, soft sunlight glow, moving clouds, fog banks, subtle storm flashes and wind-sweep lines.
- Added explicit handling for windy and hail conditions in addition to rain, snow, thunder, clouds, fog/haze, sun and clear night.
- Weather effects are mounted at the application level, so they continue across Home, About, Videos and Privacy routes.
- When the browser grants geolocation, the background effect follows the visitor's approximate current coordinates.
- If permission is denied, unavailable or times out, office weather is used as the fallback. Browsing never depends on location access.
- Weather conditions map to subtle sunlight, clouds, rain, snow, thunderstorm, fog and night-sky effects.
- Effects are decorative, pointer-transparent, and disabled under reduced-motion preferences.
- Visitor coordinates are used only for the weather lookup; they are not posted to a Manisha Properties site database.

### 3. Animated office temperature
- The Home page shows current office conditions for DLF Capital Greens, Moti Nagar (28.6601, 77.1534).
- Shows temperature in Celsius, conditions, feels-like temperature, humidity and wind speed.
- Temperature numerals animate smoothly when readings change and render the actual current reading immediately on first display (no zero-value flash or background-tab animation dependency).
- Weather responses are cached in browser storage for 30 minutes and refreshed no more frequently than the cache interval while the page remains open.
- Visible attribution links to Visual Crossing Weather.

### 4. Interactive office map and directions
- Added an interactive OpenStreetMap embed centered on the recorded business coordinates.
- Includes a pulsing location marker, map zoom/pan and a larger-map link.
- The address opens Google Maps directions using coordinates; no Google Maps API key or paid Maps service is used.
- OpenStreetMap map attribution remains visible in the embedded map.

### 5. Privacy transparency
- Updated the Privacy Notice to explain the optional browser location permission, weather lookup coordinates, Visual Crossing as provider, ordinary connection metadata such as public IP address, 30-minute browser cache, and how to revoke location permission.
- The privacy notice remains informational and is not a legal-compliance certification.

## Free-service and licensing decisions
- Open-Meteo was not selected: its free API is for non-commercial use, while its published pricing page requires a commercial-use subscription.
- Visual Crossing's official 28 October 2026 documentation states that its no-key Weather API supports commercial applications without subscription, subject to fair-use controls and attribution. It does not publish a fixed allowance for the anonymous no-key service and may adjust thresholds. This implementation limits traffic through 30-minute client-side caching and one visitor-location lookup per browser session.
- No weather API key, paid subscription, new npm dependency, or paid map API was added.
- Visual Crossing's no-key service is not unlimited and provides no guaranteed service level. If website traffic increases materially, monitor for throttling and reassess rather than assuming unlimited free capacity.
- OpenStreetMap's public embed/map infrastructure is subject to its usage policies; it is not a guaranteed unlimited tile-hosting service.

## Follow-up weather enhancement validation
- Rebuilt after visual improvements: lint PASS, typecheck PASS, production build PASS, PWA service worker generation PASS, and `git diff --check` PASS.
- Simulated cached weather responses in Chrome for rain, snow, thunderstorm, cloudy, fog, sunny, clear-night and windy conditions. Each condition selected the expected CSS layer; rain rendered 38 streaks plus 9 glass droplets, storm 48 streaks plus 12 droplets, snow 42 flakes, and all other weather layers rendered their expected visual elements.
- Simulated visitor coordinates were reused from session storage after reload without another geolocation request; location data remains session-only and weather cache is browser-local. A follow-up Chrome test verified the live office reading rendered as 29°C (the provider returned 28.5°C) rather than remaining at the animation starting value.
- Responsive document width remained within viewport during weather simulations (no horizontal overflow).
- Confirmed live Visual Crossing no-key office weather endpoint returned HTTP 200 with current conditions during a direct test.
- User confirmed saving the exact HTTPS wildcard referrer `https://manisha-properties-g8aaefqbq-arvireeths-projects.vercel.app/*` in Google Cloud website restrictions. The API key remains restricted to YouTube Data API v3 per the user's screenshot. The user should refresh the protected Preview after Google's stated propagation period; the Preview SSO blocked independent interactive browser testing in the authenticated remote test session.

## Validation performed
- `npm run lint`: PASS, no warnings.
- `npm run typecheck`: PASS.
- `npm run build`: PASS; Vite production build generated service worker and manifest.
- `git diff --check`: PASS.
- Local production-mode Chrome test:
  - Intro appears on first session load and is dismissed after the short entrance sequence.
  - Simulated geolocation for Chennai successfully switched background status to visitor-area weather while retaining the Delhi office temperature widget.
  - Weather effects remained present after navigating from Home to Videos; the office temperature card correctly remains on Home.
  - Reduced-motion emulation suppresses the opening intro and sets weather animation duration to zero.
  - No JavaScript runtime exceptions observed.
  - No horizontal overflow at 320, 390, 768 or 1440 CSS px (the measured document width was within the viewport; small differences on desktop are scrollbar width).
  - Privacy Notice contains the weather/location disclosure.
  - Visual Crossing weather endpoint and OpenStreetMap embed returned HTTP 200 during checks.
- Current weather lookup returned live conditions for the office coordinates during the test. Weather conditions vary and are not a fixed test fixture.

## Not yet verified
- Real permission prompt and GPS behaviour on physical iPhone, Android, macOS and Windows devices.
- Visual quality under actual rain/snow/storm conditions; the available live test location was clear/cloudy, so each weather animation type was not individually exercised with live provider data.
- Full Lighthouse/Core Web Vitals and accessibility audit.
- Full authenticated Vercel Preview browser testing and public preview link.
- Business-owner confirmation of the exact office pin/entrance.

## Production safeguards
- Work is isolated on the branch named above.
- No changes to production environment variables, API keys, Vercel settings, production aliases or deployments.
- Isolated branch was pushed and deployed to protected Vercel Preview. No production release performed.
- Existing production deployment and all prior site requirements remain untouched.
- Preview deployment for initial implementation commit `cde92d5406689447c0fa689e28020348d1135a72` reached READY at `https://manisha-properties-27cpbhyqg-arvireeths-projects.vercel.app`. Vercel authenticated fetch returned HTTP 200 for Home, About, Videos, Privacy, manifest and service worker. The deployed JS bundle was checked for the weather, map, intro and privacy features.
- Vercel preview SSO protection remains enabled (`all_except_custom_domains`); no protection setting or bypass secret was changed. The local production-mode Chrome test remains the interactive runtime verification because the Vercel fetch action retrieves deployment responses rather than driving a browser.
- Any final code/documentation updates will produce a newer Preview; explicit user approval remains required before Production release.


## Follow-up visibility and first-paint correction
- Root cause for the delayed logo: the intro initially rendered hidden and only became visible in a post-paint `useEffect`. It now determines session/reduced-motion eligibility in the initial state initializer, so the logo overlay is part of the first React render. The logo image is marked high fetch priority.
- Root cause for the weak weather effect: the fixed overlay used `z-index: 0`, allowing it to sit behind page content/stacking contexts. It now uses a non-interactive, screen-blended foreground overlay at `z-index: 40`, with stronger but still translucent condition-specific opacity and clearer rain/snow particles. Navigation/modal interaction remains unaffected because the layer uses `pointer-events: none`.
- Chrome first-render test confirmed the intro is present immediately with z-index 1000. After its 1.85-second display, the intro is removed while the weather layer remains mounted.
- Chrome weather visibility test with simulated rain confirmed z-index 40, screen blend, opacity 0.68, 38 moving rain streaks, 9 glass droplets and a 22°C widget reading.
- Live browser fetch to the office weather endpoint succeeded (HTTP 200) and returned current Delhi conditions: Clear, 28°C, 30.5°C feels-like, 69.2% humidity and 9.3 km/h wind. This explains why the correct live effect for the office location at test time was clear/sunny rather than rain. Visitor weather still requires the visitor to grant browser location permission; if not granted, the office location is used for the background.
- Lint, typecheck, Vite production build, PWA service-worker generation and `git diff --check` all passed after these fixes.

- Added an explicit “Use my local weather” action to the weather widget when visitor weather is not available. If browser permission was denied, the control explains that location must be enabled in browser settings; visitors can continue using office weather without granting location.


## Temperature unit and final QA continuation
- Added an accessible Celsius/Fahrenheit toggle to the office weather widget. Celsius remains the default; both the main temperature and feels-like reading switch together. Conversion is performed locally and introduces no additional API calls or dependencies.
- Chrome production-build verification used a controlled cached weather reading of 20.5°C / 21.2°C feels-like. The widget rendered 21°C, then 21°F with a matching 70°F feels-like reading after the toggle.
- Rechecked the interactive office map iframe and Google Maps directions link in the built app. Both were present.
- Responsive Chrome checks at 320, 390, 768 and 1440 CSS px reported document widths of 320, 390, 762 and 1434 px respectively; no horizontal overflow.
- Updated About and Videos sitemap `lastmod` values to 2026-11-06 to reflect the application-wide experience updates.
- Validation after the unit toggle: lint PASS, TypeScript PASS, Vite build/PWA generation PASS, `git diff --check` PASS.

## Preview release checkpoint — 6 November 2026
- Latest implementation commit: `bb0e1525e647f28589d4c005a8cbbae322b87d88` (`Add temperature unit toggle and complete experience QA`).
- Vercel Preview deployment: `dpl_8gd5kLAQRFBHBx8sbUs2wSpsPfuf`, state READY; stable branch alias `https://manisha-properties-git-work-manisha-948bbc-arvireeths-projects.vercel.app`.
- Vercel fetch verified HTTP 200 for `/`, `/about`, `/videos`, `/privacy`, `/manifest.webmanifest`, `/sw.js`, `/sitemap.xml` and `/robots.txt`. Preview SSO remains enabled.
- Deployed JS/CSS assets were retrieved successfully; bundle contains the C/F toggle and CSS contains the corrected weather overlay stacking.
- Local built-app Chrome simulation passed all eight weather states: clear, partly cloudy, rain, snow, thunderstorm, fog, windy and clear night. Rain rendered 38 streaks and 9 droplets; snow 42 flakes; storm 48 streaks and 12 droplets.
- Temperature toggle verified: 20.5°C -> 21°C; 21.2°C feels-like -> 70°F after switching to Fahrenheit. Office map iframe and directions link verified.
- Production dependency audit: `npm audit --omit=dev` reported zero vulnerabilities.
- Current production aliases, deployment and environment configuration were not changed. Preview SSO was not disabled. No Production deployment was requested or performed.

## Google Search Console and Analytics review — 6 November 2026
- Signed-in Brave session confirmed the Search Console property is `https://manishaproperties.in/` under the site owner's Google account.
- Page indexing report (last updated 23 Oct 2026): 2 indexed pages, 0 not-indexed pages; Google reports no indexing issues in the last 90 days. Sitemap report: `/sitemap.xml` status Success, 3 discovered pages, submitted 29 Jun 2026, last read 15 Jul 2026.
- Search performance report (last update 4 hours before review; displayed chart window 4 Aug–3 Nov 2026): 6 clicks, 502 impressions, 1.2% average CTR, average position 7.2. Query list is heavily ambiguous/brand-collision oriented (e.g. "manisha investment pvt ltd", "manisha real estate", "manisha capital"); local real-estate queries have very low impressions. This is an SEO targeting/brand clarity opportunity, not a technical indexing error.
- Core Web Vitals report (last updated 3 Nov 2026): insufficient real-user Chrome UX Report data for both mobile and desktop. This is lack of field data, not a failing CWV classification. PSI mobile and desktop pages were opened but remained in "Running analysis / data loading" during this session; no scores are claimed.
- Security Issues and Manual Actions reports both display "No issues detected".
- GA4 property Manisha Properties, Realtime currently showed 0 active users. Home report for 30 Oct–5 Nov 2026 showed 8 active users, 215 events, 112 views, 18 sessions (14 Direct, 3 Organic Search, 1 Unassigned), and 0 key events. Page views: 47 home-title views, 30 property-videos title views, 28 alternate home-title views, 7 About views. First-user source: 6 Direct, 2 Google Organic. Countries included 5 US and 3 India active users. This small sample can include owner/developer testing; do not interpret as stable market demand.
- GA4 surfaced recommendation to implement a Lead Gen Key Event; no key events are currently configured. Existing enquiry CTA / WhatsApp handoff is not proven to be tracked as a conversion. This is a high-priority analytics improvement after verifying consent and event semantics.
- Live production `https://manishaproperties.in/sitemap.xml` fetch shows Home and Privacy lastmod 2026-11-06, but About and Videos remain 2026-06-29. The later local branch edit to About/Videos has not been promoted to production; therefore Google currently still sees the old dates. Do not claim sitemap refresh is complete on production.
- No Google account settings, Search Console settings, sitemap submission, Analytics configuration, or production deployment was changed during this review. PageSpeed Insights did not return usable field/lab scores in the available session.

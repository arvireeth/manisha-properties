# Manisha Properties — Experience Enhancements
**Date:** 6 November 2026
**Branch:** `work/manisha-experience-enhancements-2026-11-06`
**Base:** production-linked release checkpoint `2621bb4`
**Status:** Implemented locally; awaiting preview deployment/review. Production unchanged.

## Implemented

### 1. Opening brand introduction
- Added a short logo-led charcoal-and-gold entrance animation.
- Runs once per browser session, lasts about 1.75 seconds, and has a visible Skip intro control.
- Skips automatically when `prefers-reduced-motion: reduce` is enabled.
- Does not hold up page rendering or navigation.

### 2. Weather-responsive experience
- Weather effects are mounted at the application level, so they continue across Home, About, Videos and Privacy routes.
- When the browser grants geolocation, the background effect follows the visitor's approximate current coordinates.
- If permission is denied, unavailable or times out, office weather is used as the fallback. Browsing never depends on location access.
- Weather conditions map to subtle sunlight, clouds, rain, snow, thunderstorm, fog and night-sky effects.
- Effects are decorative, pointer-transparent, and disabled under reduced-motion preferences.
- Visitor coordinates are used only for the weather lookup; they are not posted to a Manisha Properties site database.

### 3. Animated office temperature
- The Home page shows current office conditions for DLF Capital Greens, Moti Nagar (28.6601, 77.1534).
- Shows temperature in Celsius, conditions, feels-like temperature, humidity and wind speed.
- Temperature numerals count up on load/update.
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
- No Git push or production release performed.
- Existing production deployment and all prior site requirements remain untouched.
- Next release step: commit and push this isolated branch for a protected Vercel Preview, validate the preview, and request explicit approval before any production release.

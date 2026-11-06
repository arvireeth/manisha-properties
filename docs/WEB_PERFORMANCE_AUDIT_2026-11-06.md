# Website Performance and Functional Audit — 6 November 2026

## Scope
- Existing Manisha Properties Vite/React application; no rebuild.
- Local production build audited with Lighthouse 13.6.0 on desktop and mobile.
- Browser consent flows tested on the public site with Google Tag Manager network requests intercepted so test events were not sent to Analytics.
- Production domain was not changed by this audit.

## Local Preview Lighthouse results

| Category | Desktop | Mobile |
|---|---:|---:|
| Performance | 98 | 97 |
| Accessibility | 100 | 100 |
| Best Practices | 96 | 96 |
| SEO | 100 | 100 |

| Metric | Desktop | Mobile |
|---|---:|---:|
| First Contentful Paint | 0.6 s | 1.9 s |
| Largest Contentful Paint | 0.9 s | 1.9 s |
| Total Blocking Time | 0 ms | 100 ms |
| Cumulative Layout Shift | 0.002 | 0.021 |

These are single-run local Lighthouse lab results, not field Core Web Vitals. Repeat runs can vary.

## Changes in this audit
- Added a responsive 400px/640px WebP source set for the visiting-card hero image; original image retained.
- Added responsive image preload with high fetch priority in the initial HTML.
- Reserved the hero image card's aspect ratio.
- Preloaded the first-viewport Inter and Playfair Display WOFF2 fonts to reduce font-swap shifts.
- Added visible-label-compatible accessible naming to the weather temperature-unit toggle.
- Earlier commit also reserved weather widget height and added descriptive accessible names to footer icon links.

## Browser consent checks
On a fresh browser context:
- Initial state: no saved choice, privacy prompt visible, no Google Analytics script.
- Reject: saved `rejected`, prompt hidden, no Google Analytics script/request.
- Review analytics choice: removes saved choice and reopens the prompt.
- Allow: saves `accepted` and injects the Google tag script only after the choice.
- Revocation: removes saved choice and reopens the prompt.
- Test requests to Google Tag Manager were intercepted; no test page-view or click events were sent to the live Analytics property.
- Final test context was left with `rejected` consent.

## Outstanding external dependency
The YouTube Data API key currently embedded via `VITE_YOUTUBE_API_KEY` in the local production environment returns HTTP 400 with Google's message: **API key expired. Please renew the API key.** This explains the failed playlist requests and the remaining Lighthouse Best Practices deduction / console errors.

No Google Cloud project or key settings were changed. A valid replacement YouTube Data API key must be created/renewed by the account owner, and its permitted website referrers / YouTube Data API v3 restriction must be configured in Google Cloud Console. After the key is supplied through the existing environment variable and Vercel environment configuration, rebuild and verify the four playlists. Do not publish the key in source control.

## Release status
- Local lint, TypeScript, production build, PWA generation, npm audit (production dependencies), and git diff checks passed.
- Local preview performance and accessibility scores are strong.
- The latest changes are for Preview only. Production deployment was not promoted.
- Do not release until the YouTube API key is renewed and the playlist flow is verified.

### Preview versus production API key verification
- The local `.env.production.local` key is expired (HTTP 400: `API key expired. Please renew the API key.`). This local key was not committed.
- The public production bundle's key is valid when the request referrer is `https://manishaproperties.in/`; YouTube API checks returned HTTP 200 for Sale, Rental, and Purchased. Occupied returned HTTP 200 with zero items for the one-item check.
- The current Vercel Preview bundle's key returns HTTP 403: `Requests from referer https://manisha-properties-bv25dl3vm-arvireeths-projects.vercel.app/ are blocked.` This is an HTTP-referrer restriction, not an invalid playlist ID.
- To validate dynamic playlists in Preview, the Google Cloud owner must add the stable Vercel branch alias `https://manisha-properties-git-work-manisha-948bbc-arvireeths-projects.vercel.app/*` (and optionally the current unique preview hostname) to the Preview key's allowed HTTP referrers. Keep the production key's restrictions scoped to the production domain.

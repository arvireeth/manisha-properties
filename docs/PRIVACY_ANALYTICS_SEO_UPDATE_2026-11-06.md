# Privacy, Analytics and Search Quality Update — 6 November 2026

## Scope
Preview-only update on the existing work branch. Production was not deployed or modified.

## Analytics privacy
- Removed the unconditional Google Analytics script from the HTML shell.
- Added an explicit optional analytics choice. The Google tag is injected only after the visitor selects Allow analytics; Reject keeps it unloaded.
- Consent choice is stored locally in the browser. The Privacy Notice includes a control to reopen the choice.
- Implemented privacy-minimised events for page views, phone-link clicks, WhatsApp-link clicks, property-video outbound clicks and the WhatsApp enquiry form start.
- Event payloads intentionally exclude enquiry text, names, email addresses, phone numbers, budget and preferred-location values.
- No Google Analytics account configuration or Google Search Console settings were changed.

## Privacy notice
- Clarified that enquiry form values are used to prepare a WhatsApp message and are not submitted to a Manisha Properties website database.
- Described optional Analytics, the consent choice, event categories and excluded form data.
- Added a visitor-facing way to revisit the Analytics choice.
- Existing weather/location disclosures and external-service disclosures remain.

## Search and structured data
- Existing route-level Helmet metadata and canonical URLs remain in place for Home, About, Videos and Privacy.
- Removed unverified structured-data assertions about opening hours, founding date, founder, and price range.
- Retained business contact, location and service information already present on the website.

## Verification
- ESLint: passed.
- TypeScript: passed.
- Vite production build and PWA generation: passed.
- Production dependency audit: 0 vulnerabilities.
- git diff --check: passed.
- Sitemap already contains the four public routes with 2026-11-06 lastmod dates in this branch.
- No production deployment, alias promotion, Search Console submission, or Google account setting change was performed.

## Remaining release boundary
Preview deployment and browser-level consent-flow verification are required before release. Production publication and Google-account changes remain subject to explicit approval.

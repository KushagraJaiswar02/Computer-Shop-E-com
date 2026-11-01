# Brand rail artwork

Optional portrait WebP images, 600 x 800, under 100 KB. Keep the product crop and angle consistent. Allow space for a centered logo and the brand name/product count at the bottom.

Expected filenames and legal sources:

- `asus.webp` — ASUS press kit/media team or an authorized ASUS distributor.
- `lenovo.webp` — Lenovo press kit/media team or an authorized Lenovo distributor.
- `msi.webp` — MSI press kit/media team or an authorized MSI distributor.
- `amd.webp` — AMD press kit/media team or an authorized AMD distributor.
- `intel.webp` — Intel press kit/media team or an authorized Intel distributor.
- `corsair.webp` — Corsair press kit/media team or an authorized Corsair distributor.
- `samsung.webp` — Samsung press kit/media team or an authorized Samsung distributor.
- `dell.webp` — Dell/Alienware press kit/media team or an authorized Dell distributor.

Obtain permission for commercial storefront use and follow the applicable brand guidelines. Press-kit availability alone does not grant advertising rights. Do not scrape brand sites.

Place the licensed file here, then add `cardSrc: '/brands/cards/asus.webp'` to its shared identity in `src/features/brands/useBrandDirectory.ts` (substitute the slug). Only configure paths for files that exist. Missing or broken artwork falls back to the brand gradient, pattern, and local SVG logo. Rail images are lazy-loaded and decoded asynchronously. The rail does not mount below 1024px.

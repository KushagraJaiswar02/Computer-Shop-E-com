# Brand hero artwork

Optional owner-supplied landscape WebP images, 1920 x 1080, under 250 KB. Keep the left side quiet for text and the main subject on the right. Desktop uses a full-bleed crop; the mobile showcase contains the same image in its reserved panel.

Expected filenames and legal sources:

- `asus.webp` — ASUS press kit/media team or an authorized ASUS distributor.
- `lenovo.webp` — Lenovo press kit/media team or an authorized Lenovo distributor.
- `msi.webp` — MSI press kit/media team or an authorized MSI distributor.
- `amd.webp` — AMD press kit/media team or an authorized AMD distributor.
- `intel.webp` — Intel press kit/media team or an authorized Intel distributor.
- `corsair.webp` — Corsair press kit/media team or an authorized Corsair distributor.
- `samsung.webp` — Samsung press kit/media team or an authorized Samsung distributor.
- `dell.webp` — Dell/Alienware press kit/media team or an authorized Dell distributor.

Obtain permission for commercial storefront use and follow the applicable brand guidelines. Press-kit availability alone does not grant advertising rights. No download or scraping is part of this implementation.

After placing a licensed file here, add `heroSrc: '/brands/hero/asus.webp'` to its shared identity in `src/features/brands/useBrandDirectory.ts` (substitute the slug). Only configure paths for files that exist. The desktop preloads only the active image; missing or broken artwork uses an accent gradient, dots, a logo watermark, and an existing catalog product image when available. Existing catalog photographs may have backgrounds; no image is represented as a supplied transparent cutout.

The hero panel and rail dimensions are reserved before images load. Below 1024px, only the existing accordion mounts; the desktop hero and rail image elements are absent.

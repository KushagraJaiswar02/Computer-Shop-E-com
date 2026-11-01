# Admin UX feature map

Written before implementation on 2026-11-01. Existing routes remain supported.

| Existing feature | New location |
| --- | --- |
| Gross sales, product count, stock alerts, enquiry count | Dashboard → Snapshot and Needs your attention |
| Recent orders, low-stock watchlist, builder shortcut | Dashboard → Recent activity, attention cards, quick actions |
| Product search and category filter | Products → All products → search and filters |
| Add/edit name, brand, category, SKU, price, stock, image, description | Products → All products → Add product / Edit → grouped form |
| Quick increase/decrease stock | Products → All products → row stock controls |
| Archive product with confirmation | Products → All products → Archive; confirmation and Undo toast |
| Restore and typed permanent deletion | Products → Archive |
| Category/subcategory hierarchy | Products → Categories (read-only directory) |
| Brand/series hierarchy | Products → Brands and series (read-only directory) |
| Enable, hide and reorder homepage sections | Storefront → Homepage → drag handles or arrow buttons; Save/Discard |
| Add/edit/delete/reorder/enable hero slides | Storefront → Banners |
| Hero mode, custom copy, desktop/mobile upload and URLs, alt text, focal/text positions, CTA, carousel timing, preview | Storefront → Banners → banner editor and live preview |
| Select featured products | Storefront → Featured |
| Select deal products | Storefront → Deals |
| Announcement visibility, badge, message, link label and URL | Storefront → Announcement bar |
| Homepage reset | Settings → Reset homepage, typed confirmation |
| Store preview and customer-view links | Header → View store / Back to store |
| Orders list and complete order details | Orders → searchable list → View order |
| Enquiry message, company, type, contacts, budget, status, date | Enquiries → searchable list → View enquiry |
| Audit history and before/after values | History → searchable list → View changes |
| Demo state reset | Settings → Reset demo data, typed confirmation |
| Admin role guard, public demo override and mock permission checks | Existing guard/service boundary; explicit config flags retained |
| Inactivity timeout | Guard → one-minute warning, Stay signed in, re-login after timeout |
| Admin account link | Store account dropdown → Admin panel |
| Theme preference | Admin header → theme toggle (shared storefront preference) |

New UX: collapsible desktop sidebar, mobile navigation drawer, grouped global search, reusable lists/forms, page help, period selector, deep-linked filters. Customer management remains disabled with a Soon badge; search can find customer names already present on orders without introducing a customer service.

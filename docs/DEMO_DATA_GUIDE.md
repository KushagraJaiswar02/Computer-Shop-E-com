# Demo data guide

This browser-only fixture set is enabled only while `DEMO_MODE` is on. It uses small SVG placeholders, seeded date offsets relative to today, and example-only identities.

## Demo access

- Admin: `admin@example.test` / `DemoAdmin123!`
- Customer: `demo@example.test` / `DemoPass123!`

Both accounts exist only in demo mode. Remove demo mode and provision accounts on the server before launch.

## Fixture coverage

| Fixture | Screen or behaviour to test |
| --- | --- |
| 48-product catalogue | Store search, filters, category and brand browsing, admin product list |
| Empty product images | Product-card fallback and product page image fallback |
| One-image product | Thumbnail/gallery behaviour |
| No-spec product | Product technical-spec empty state |
| Long product title | Card truncation, tables and accessible labels |
| Zero stock and two-unit stock | Disabled purchase state and admin low-stock attention cards |
| 40% discount item | Discount badge and pricing calculations |
| 110 orders over 90 days | Orders table, dashboard totals and status filters |
| 24 example customers | Customer and account-facing data scenarios |
| 14 product requests and 12 enquiries | Requests and enquiries status filters |
| Empty Webcams subcategory | Empty catalogue state |
| ASUS ROG laptop and GPU fixtures | A series spanning two categories |

## Manual checks

- Storefront: search the long-title product, filter for out-of-stock products, open an image-less product, and add a discounted item to cart.
- Account: sign in as the demo customer, review six orders in varied statuses, wishlist/compare items, and submit a product request.
- Admin: check low-stock dashboard links, product filters, order/enquiry filters, audit history, archive/restore, and Settings → Reload demo data.

## Limits of the current models

The current storefront has no persisted model for scheduled/expired banner records, named deal rules, general enquiry reply notes, or category/brand archive state. The fixtures therefore populate the existing homepage, product, order, and enquiry structures without inventing new application behaviour.

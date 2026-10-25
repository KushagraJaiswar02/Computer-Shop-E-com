# Production readiness notes

This repository currently builds a client-side storefront prototype. The application has no backend API, database, payment provider, authentication service, image storage service, or server-side admin authorization. Browser state is not a production source of truth.

## Current behavior and launch blockers

| Area | Current behavior | Needed before real customer use |
| --- | --- | --- |
| Catalog and inventory | Initial catalog plus edits in browser `localStorage` | Catalog/inventory API with authoritative price and stock checks |
| Homepage promotions | Admin editor writes configuration and uploaded image data to the current browser's `localStorage` | Authenticated admin API, shared database, object storage/CDN, image validation, and audit history |
| Admin access | `/admin` routes are public client routes; the prototype badge explains local storage only | Server-enforced role authorization on every admin operation |
| Customer accounts | Demo login accepts any submitted values and navigates to the account screen | Identity provider, secure session handling, account recovery, and server-side authorization |
| Cart and wishlist | Browser-local state; cart rows retain copied product/prices | Server or guest-session persistence; revalidate price, variant and stock at checkout |
| Checkout and payment | Form writes a local demo order preview; no order is submitted and no payment is collected | Order API, tax/shipping rules, idempotency, payment provider hosted/tokenized flow, webhook verification, fraud/error handling |
| Shipping and returns | Store-specific terms are not configured | Retailer-approved policies, rates, regions, delivery estimates and return process |
| Product reviews | Homepage data is explicitly sample content and is hidden | Genuine review ingestion/moderation and verified-purchase source |
| Enquiries | Forms are stored in local browser state | Secure API, delivery/notification workflow, retention and privacy controls |

The demo checkout deliberately calls the resulting record a local preview. It must not be used to accept orders or payment. Do not move payment credentials or authorization decisions into frontend code.

## Data and privacy

The prototype stores cart contents, wishlist, catalog edits, homepage configuration, demo orders and enquiries in browser storage. Clearing browser data removes them; they are not shared with administrators or other visitors. Avoid entering real payment credentials or sensitive customer information. Production should collect only necessary data, protect it in transit and at rest, define retention/deletion rules, and publish an owner-approved privacy notice.

## Retailer supplied information still required

- Registered business name, support email/phone, operating address and applicable tax details.
- Product prices, stock, warranty terms, shipping rates/regions/timelines, return/refund/cancellation policy and payment methods.
- Approved customer-facing promotion copy and media rights.
- Privacy notice and customer data retention policy.

These values should come from an approved source of truth and be reviewed before public launch; the demo should not be treated as evidence that any particular service or claim exists.

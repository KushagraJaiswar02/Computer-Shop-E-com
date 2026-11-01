# Backend requirements

The current browser mocks are not security. Before production:

- Enforce authentication and role/permission checks on every endpoint, including reads and uploads.
- Hash passwords with a modern password hashing algorithm, rate-limit login, and use secure server-managed sessions; support optional admin 2FA.
- Validate and sanitize all input on the server; protect against CSRF and XSS; allowlist, size-limit and scan uploads.
- Maintain tested backups and an append-only server-side audit log, including denied access, actor, timestamp, entity, action and before/after values.
- Enforce soft deletion and restrict permanent deletion to authorized archive operations.

## Data models

Users and roles; products (SKU, slug, taxonomy, prices, inventory, images, specifications, status); hierarchical categories; brands and series with category restrictions; banners and homepage configuration; orders; enquiries; customers; and audit entries. All catalog entities need stable IDs and archive timestamps; products need creation and update timestamps.

## API surface

Authenticated session/login/logout and profile endpoints; permission-checked list/create/read/update/archive/restore/permanently-delete endpoints for products, categories, brands, series and banners; upload endpoint; homepage configuration endpoints; order and enquiry management; customer read endpoints; audit history. Public read endpoints must return only published, non-archived catalog and active storefront configuration. Use pagination, filtering, sorting, validation and concurrency controls where appropriate.

## Demo access must be removed before launch

Remove DEMO_MODE, the seeded demo admin account and its login button before launch. Real admin accounts must be created server-side. PUBLIC_DEMO_ACCESS must remain disabled in production; it is a development-only preview override.

# Admin UX verification and changed files

## Scope

The feature-to-location map was written before coding in `docs/ADMIN_UX_MAP.md`. Existing admin services, authorization, audit entries and product archive storage remain in use. No dependencies were added. The existing storefront admin dropdown link was verified and did not need changes in this pass.

## Files changed in this UX pass

- `docs/ADMIN_UX_MAP.md` — pre-implementation feature map.
- `docs/BACKEND_REQUIREMENTS.md` — removal requirements for demo accounts and access flags.
- `docs/ADMIN_UX_VERIFICATION.md` — this report.
- `src/App.tsx` — admin routes for brands, banners, featured, deals and announcement.
- `src/config/admin.ts` — development-only demo seed and public-preview flags.
- `src/services/account/mockStorage.ts` — seed exactly one demo admin, including migration of existing mock databases.
- `src/pages/LoginPage.tsx` — demo-admin sign-in button while DEMO_MODE is enabled.
- `src/pages/admin/AdminLayout.tsx` — task navigation, mobile drawer, collapse, search, breadcrumbs, user menu, store links, theme and help.
- `src/pages/admin/AdminGuard.tsx` — retained role checks and timeout, plus the one-minute warning and Stay signed in action.
- `src/pages/admin/AdminUi.tsx` — reusable lists, forms, save bar, dialogs, help drawer, notifications, pagination, sorting, mobile cards and loading skeleton.
- `src/pages/admin/admin.css` — scoped responsive light/dark styles and reduced-motion support.
- `src/pages/admin/AdminDashboardOverview.tsx` — attention cards, quick actions, period snapshot and recent activity.
- `src/pages/admin/AdminProductsPage.tsx` — list controls, bulk archive, grouped editor, validation, preview and Undo.
- `src/pages/admin/AdminCategoriesBrandsPage.tsx` — searchable category and brand/series directories.
- `src/pages/admin/AdminHomepageBuilderPage.tsx` — separately navigable storefront controls, drafts, Save/Discard and announcement preview; existing banner controls retained.
- `src/pages/admin/AdminOrdersPage.tsx` — list controls, deep links and order details.
- `src/pages/admin/AdminEnquiriesPage.tsx` — list controls, deep links and complete enquiry details.
- `src/pages/admin/AdminArchivePage.tsx` — searchable archive, restore and typed permanent-delete dialog.
- `src/pages/admin/archiveActions.ts` — reuse existing archive/audit operations for restore, permanent delete and Undo.
- `src/pages/admin/AdminHistoryPage.tsx` — searchable/sortable/paginated history with before/after values.
- `src/pages/admin/AdminSettingsPage.tsx` — typed-confirmation homepage and demo resets.

Builds also update TypeScript build metadata and generate assets under `.codex-build/admin-ux`; the existing `dist` output was not overwritten in this pass.

## Browser checks completed

- Public development `/admin` access and demo-mode labeling.
- Demo-admin login and successful landing on `/admin`.
- Storefront account dropdown → Admin panel.
- Desktop sidebar collapse/expand and mobile drawer navigation.
- Desktop 1440px and mobile 390px layout checks; mobile banner-editor overflow found and fixed.
- Mobile product cards, stock controls, dark theme and visible input focus.
- Product form required-field validation and Discard.
- List pagination and product search.
- Grouped global search for orders/customers and `/` shortcut; Escape closes search.
- Banner editor retains content source, custom copy/image controls, uploads, desktop/mobile image URLs, image position, text position, link controls and preview.
- Announcement rejects unsafe link schemes; saved message persists after reload. Test text was restored afterward.
- Storefront still renders its announcement, hero and normal navigation after admin saves.
- Order detail delivery address, item quantities, totals and payment method.
- Help drawer and disabled reset button until typed confirmation.
- No browser console errors in the inspected demo flow.
- Production build: unauthenticated `/admin` returns the existing 404 page and the demo-admin login button is absent.

## Validation and limits

TypeScript and Vite production build pass. Vite retains its existing large-bundle advisory.

Not exercised end-to-end in the browser: waiting the full 15 minutes for timeout, uploaded image processing, archive/Undo/restore, permanent deletion, and executing either reset. Their existing permission, audit and archive calls remain wired in; destructive resets/deletes were not executed during UI verification. The product editor's create/update persistence was not separately exercised; it retains the existing StoreContext mutation calls.

The mock account model does not record signup dates. The New customers card explicitly says this metric is unavailable rather than inventing a count. Customer search uses customer names already present on orders. Customer management stays disabled with a Soon badge. Category and brand directories remain read-only, matching existing capability.

DEMO_MODE and PUBLIC_DEMO_ACCESS default to development-only. Production uses the retained role guard. Before launch, remove the demo admin seed/button and create real admin accounts server-side.
## Homepage drag-and-drop follow-up (2026-11-02)

Added `src/pages/admin/AdminSectionSorter.tsx`, integrated it into `AdminHomepageBuilderPage.tsx`, and updated the scoped admin stylesheet, page help and feature map. No dependencies added.

The section list supports mouse/pen/touch pointer handles, insertion indicators, edge scrolling, and keyboard pickup/move/drop/cancel. Existing arrow buttons, show/hide controls, unsaved-change warning, Save/Discard, persistence and audit calls are retained.

Browser checks passed: dragging Hero Carousel below Shop by Brand; saving and reloading the reordered list; restoring the original saved order; keyboard multi-position moves; Escape restoring the previous order while preserving a hidden section; Discard restoring the saved configuration; and 390px responsive layout without page overflow. Mobile card wrapping was corrected during verification. Physical touchscreen/pen behavior and prolonged edge auto-scrolling were not separately exercised.

TypeScript and Vite production build passed. Original demo section order and visibility were restored after verification.

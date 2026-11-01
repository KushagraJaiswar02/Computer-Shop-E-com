# Brand, themes and fluid layout verification

Implemented 2026-11-02. No packages or dependencies added. Existing features, admin guard, audit, archive and drag-and-drop behavior remain in place.

## Design tokens and brand configuration

`src/styles/tokens.css` is the canonical theme source. Tailwind now resolves semantic utilities through CSS variables rather than hardcoded blue/slate palettes.

Color roles: background, surface, surface-elevated, surface-soft, border, control-border, text, text-muted, primary, primary-hover, on-primary, accent-text, success, warning, danger, info, price, discount-badge and focus-ring. Semantic text variants, on-semantic, inverse/media colors, overlay, shadow/highlight colors and category accent support existing UI and photographic stages. Admin additionally defines sidebar, sidebar text, active background and active foreground.

Typography: body/heading/mono families; xs through 5xl size tokens; body and heading line-height tokens. Radius tokens cover small controls through panels and pills. Shadow tokens cover soft cards, elevation, headers, modals, pressed buttons, focus, glow and photographic drop shadows.

`src/config/brand.ts` supplies shop name, tagline, logo path and logo alternative text to the header, footer, login/register screens, admin logo and document titles. Remaining ComputerShop literals are confined to this configuration.

The storefront uses graphite/amber light and dark palettes. Storefront initialization honors a saved preference, otherwise the system preference, and no longer overwrites saved settings during React StrictMode initialization. Admin uses its own `compshop_admin_theme` preference and root `data-theme` scope; changing admin mode does not change the storefront preference.

## Fonts

Inter is self-hosted for weights 400–600; Space Grotesk for weights 600–700. Admin uses Inter throughout. Four variable WOFF2 Latin/Latin Extended subset files total 174,552 bytes. Only Inter Latin is preloaded; CSS uses `font-display: swap`. Font licenses and provenance are under `public/fonts`.

The external Google Fonts stylesheet did not load in the preview browser, so it was replaced by local files. Both official font families were checked against their TTF character maps for U+20B9 (₹); the local Latin Extended subset ranges include that character. Prices use Inter/tabular numbers. Monospace is restricted to explicitly marked SKU/spec-key text.

## Contrast adjustments

The requested primary storefront values are retained. Extra text roles and one hover adjustment ensure normal text reaches 4.5:1 and control boundaries/focus indicators reach 3:1:

- Success indicator: #16A34A; light success text: #166534.
- Warning indicator: #D97706; light warning text: #B45309.
- Danger indicator: #DC2626; light danger text: #B91C1C.
- Info indicator: #2563EB; light info text: #1D4ED8.
- Light admin muted text: #5F6F86, adjusted from #64748B to work on its page and soft backgrounds.
- Dark admin primary hover: #6D70F2, adjusted from #6366F1 because the requested dark foreground failed 4.5:1 on that hover background. Primary remains #818CF8; on-primary remains #0B1020.
- Input boundaries use dedicated control-border colors (#7D838F storefront/admin light, #69707D storefront dark, #697491 admin dark) instead of the decorative low-contrast border token.
- Category gradients use a darker accent blend and inverse text so small text remains readable in both themes.
- Primary buttons/chips and discount badges use on-primary, including nested active counts. Manufacturer directory actions now use storefront action colors rather than logo colors.

Run `node scripts/check-theme-contrast.mjs`: 92 checks pass across the four palettes, including semantic tints and category gradient stops.

## Layout and browser verification

Shared `.shop-container`: width 100%, maximum 1920px, gutters 16px below 768px, 24px from 768px, 32px from 1024px. It is used throughout page shells, homepage sections, header, footer, navigation panels and the product sticky bar. Narrow forms retain a comfortable inner width.

Desktop header is about 80px, with a flexible search column and spaced category/request/action controls. Mobile/tablet header is about 68px with menu, logo, search, account and cart. Request, wishlist, comparison and brand links remain reachable in the mobile menu. Existing search suggestions and the / shortcut are retained. The sticky header gains its token shadow after scrolling. Catalog and brand-product grids reach five columns from 1700px.

Browser sizes checked: 1920, 1366, 768 and 390px, in both modes. Scrollbar space reduces document client width slightly; overflow checks compare scrollWidth with clientWidth.

Checked home, shop, manufacturer directory, ASUS brand product page, a Samsung product detail page, cart page, cart drawer, wishlist, login/register, account dashboard/details/orders/requests, and admin dashboard/products. Populated cart and wishlist layouts were checked at all four widths in both modes, and the temporary sample item was removed afterward. Account details includes address and saved-card sections. No profile/password/address/payment submissions, purchases, catalog/archive deletions, or account edits were performed.

Final storefront route checks after self-hosting fonts found no horizontal page overflow or sampled solid-background text contrast failures. Account/admin and populated cart/wishlist checks also found no horizontal overflow or sampled text failures. Admin was checked in light and dark while the storefront remained dark, confirming palette independence. Mobile search suggestions and the menu links were exercised. The original localhost:5173 Vite process held an old Tailwind configuration; it was restarted and its stylesheet endpoint now returns HTTP 200 with the new tokens and font faces.

`npm run build -- --outDir .codex-build/brand-theme` passes. Vite retains the existing large-JavaScript-bundle advisory. Build outputs and TypeScript metadata are generated separately from source changes.

## Intentionally retained hardcoded colors and verification limits

- `src/features/brands/useBrandDirectory.ts`: manufacturer identity colors (ASUS, Lenovo, MSI, AMD, Intel, Corsair, Samsung, Dell) and their dark artwork variants. They are used for logos and decorative manufacturer artwork, not general storefront buttons or page text.
- `src/assets/brands/*.svg`: original manufacturer-logo artwork colors.
- `public/brand/shop-mark.svg`: the logo asset's amber fill and graphite stroke. External SVG image assets cannot inherit page CSS variables reliably; their palette is part of the logo artwork.
- `src/components/home/HeroBanner.tsx` and mask-image rules in brand/category CSS retain literal black/transparent alpha steps. These describe image opacity masks, not painted UI colors; substituting theme foreground/background values would change image visibility.

No generic storefront or admin UI hex colors remain outside the token file. Contrast sampling excludes photographic gradients, opacity transitions, hidden/inert content and disabled controls; token tests cover the defined solid/tinted UI pairings, and category gradient stops are tested explicitly. Contrast cannot be guaranteed against every future uploaded photograph. Real touchscreen/pen behavior, every hover/validation combination, forced-color modes and other browser engines were not exhaustively tested. The theme change does not claim a full accessibility certification or a re-test of backend/mock business operations.

## Files changed

- `docs/BRAND_THEME_VERIFICATION.md`
- `index.html`
- `public/brand/shop-mark.svg`
- `public/fonts/README.md`
- `public/fonts/inter-OFL.txt`
- `public/fonts/inter-latin-ext.woff2`
- `public/fonts/inter-latin.woff2`
- `public/fonts/space-grotesk-latin-ext.woff2`
- `public/fonts/space-grotesk-latin.woff2`
- `public/fonts/spacegrotesk-OFL.txt`
- `scripts/check-theme-contrast.mjs`
- `src/App.tsx`
- `src/components/common/KeyBadge.tsx`
- `src/components/common/KeycapButton.tsx`
- `src/components/home/BestsellersSection.tsx`
- `src/components/home/BrandsSection.css`
- `src/components/home/BrandsSection.tsx`
- `src/components/home/CategorySection.css`
- `src/components/home/CategorySection.tsx`
- `src/components/home/DealsSection.tsx`
- `src/components/home/FeaturedSection.tsx`
- `src/components/home/HeroBanner.tsx`
- `src/components/home/NewArrivalsSection.tsx`
- `src/components/home/ReviewsSection.tsx`
- `src/components/home/TrustSection.tsx`
- `src/components/layout/AnnouncementBar.tsx`
- `src/components/layout/BrandDocumentTitle.tsx`
- `src/components/layout/FloatingThemeToggle.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/layout/Header.tsx`
- `src/components/layout/StoreLayout.tsx`
- `src/components/layout/header/BrandLogo.tsx`
- `src/components/layout/header/HeaderAccount.tsx`
- `src/components/layout/header/HeaderActions.tsx`
- `src/components/layout/header/HeaderNav.css`
- `src/components/layout/header/HeaderNav.tsx`
- `src/components/layout/header/HeaderSearch.tsx`
- `src/components/layout/header/MobileNavMenu.tsx`
- `src/components/product/ProductCard.tsx`
- `src/components/shortcuts/KeyboardShortcutsModal.tsx`
- `src/config/brand.ts`
- `src/context/StoreContext.tsx`
- `src/data/categories.ts`
- `src/data/mockData.ts`
- `src/features/account/AccountAddresses.tsx`
- `src/features/account/AccountCards.tsx`
- `src/features/account/AccountDashboard.tsx`
- `src/features/account/AccountOrders.tsx`
- `src/features/account/AccountRequests.tsx`
- `src/features/account/AccountUi.tsx`
- `src/features/account/AuthScreen.tsx`
- `src/features/account/ProtectedAccountRoute.tsx`
- `src/features/account/account.css`
- `src/features/brands/BrandAccordion.tsx`
- `src/features/brands/BrandDesktopShowcase.css`
- `src/features/brands/BrandDesktopShowcase.tsx`
- `src/features/brands/BrandHero.tsx`
- `src/features/brands/useBrandDirectory.ts`
- `src/features/cart/CartDrawer.tsx`
- `src/features/cart/CartItemRow.tsx`
- `src/features/cart/cartUiUtils.tsx`
- `src/features/catalog/ActiveFilterChips.tsx`
- `src/features/catalog/CategoryChipBar.tsx`
- `src/features/catalog/EmptyResultsState.tsx`
- `src/features/catalog/FilterSidebar.tsx`
- `src/features/catalog/MobileFilterDrawer.tsx`
- `src/features/catalog/ProductGrid.tsx`
- `src/features/catalog/ShopHeader.tsx`
- `src/features/catalog/ShopSortControls.tsx`
- `src/features/product/CompatibleProductsSection.tsx`
- `src/features/product/MoreFromSeries.tsx`
- `src/features/product/ProductEnquiryModal.tsx`
- `src/features/product/ProductGallery.tsx`
- `src/features/product/ProductInfoBox.tsx`
- `src/features/product/ProductSpecsTabs.tsx`
- `src/features/product/ProductTrustStrip.tsx`
- `src/features/product/StickyCartBar.tsx`
- `src/index.css`
- `src/pages/AboutPage.tsx`
- `src/pages/AccountPage.tsx`
- `src/pages/BrandPage.tsx`
- `src/pages/BrandsPage.css`
- `src/pages/CartPage.tsx`
- `src/pages/CategoryPage.tsx`
- `src/pages/CheckoutPage.tsx`
- `src/pages/ComparePage.tsx`
- `src/pages/ContactPage.tsx`
- `src/pages/EnquiryPage.tsx`
- `src/pages/LoginPage.tsx`
- `src/pages/NotFoundPage.tsx`
- `src/pages/OrderConfirmationPage.tsx`
- `src/pages/PoliciesPage.tsx`
- `src/pages/ProductDetailPage.tsx`
- `src/pages/ShopPage.tsx`
- `src/pages/WishlistPage.tsx`
- `src/pages/admin/AdminDashboardOverview.tsx`
- `src/pages/admin/AdminHomepageBuilderPage.tsx`
- `src/pages/admin/AdminLayout.tsx`
- `src/pages/admin/AdminProductsPage.tsx`
- `src/pages/admin/admin.css`
- `src/styles/fonts.css`
- `src/styles/tokens.css`
- `tailwind.config.js`

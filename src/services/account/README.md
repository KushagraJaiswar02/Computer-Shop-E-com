# Mock accounts

This is a browser-only demo, not production authentication. Passwords and sessions are stored in plain text in localStorage. Do not enter real credentials. No new dependencies were added and checkout and StoreContext behavior were not changed.

## Adapter boundary

`contracts.ts` defines auth, orders, requests, addresses, card references, and basket interfaces. `index.ts` selects the mock implementations; `AuthProvider` also accepts an injected `AccountServices` object. Components use `useAuth`, `useOrders`, `useOrder`, `useProductRequests`, `useProductRequestSubmission`, `useAddresses`, and `useCardDetails`. Only the mock storage adapter accesses localStorage.

`accountBasketBridge.ts` exports the single guest-to-account merge entry point and applies results through existing StoreContext actions. Matching product/variant lines combine quantities; wishlist IDs are unique. Merge tokens make retries idempotent, and a pending merge survives refresh. Account baskets restore on sign-in and the visible basket clears on logout. Compare continues using the existing browser-level state.

New orders created by the existing checkout while signed in are observed and copied into the mock account service. Previous shared/guest orders are never claimed on login. Request a Product uses the existing enquiry form and preserves the existing local enquiry queue while also recording signed-in product availability requests in the account service. Guest requests are not retrospectively assigned based on their email address.

## Routes

- `/login`, `/register`
- Protected `/account`, `/account/details`, `/account/orders`, `/account/orders/:id`, `/account/requests`
- `/account/addresses` only when `SHOW_ADDRESSES` is true
- Compatibility redirects: `/auth/login`, `/auth/register`, `/account/profile`
- Wishlist and Compare remain available through storefront header icons; account navigation and quick links do not include them.

Logged-out protected routes preserve pathname, query, and hash in a validated `returnTo` query parameter. External return URLs are rejected. Unknown account routes and unknown order IDs have recovery links.

## Configuration

All account configuration lives in `src/config/account.ts`:

- `SHOW_ADDRESSES = true`: shows address CRUD inside Account details and registers the standalone address route. Enabled at the owner's request; this does not add delivery or change checkout.
- `SHOW_CARD_DETAILS = true`: shows mock card references inside Account details. Only name, network, last four digits, expiry, and default preference are accepted; no card number or CVV fields exist.
- `CARD_NETWORKS`: allowed card-network choices for mock references.
- `ORDER_MODE = 'orders'`: `'orders' | 'enquiries'`; controls account/header order nouns, without changing URLs or checkout behavior.
- `ENABLE_DEMO_SEED = true`: creates the demo user and fixtures only when the mock database does not exist.
- `SHOW_MOCK_NOTICE = true`: displays browser-only mock notices on auth/account screens.
- `MOCK_LATENCY_MS = 240`: artificial service latency.
- `STORAGE_KEY = 'compshop_mock_accounts_v1'`: isolated, versioned mock database namespace.
- `PASSWORD_MIN_LENGTH = 8`: demo validation only; production password policy belongs on the server.
- `MOBILE_QUERY = '(max-width: 767px)'`: header account link instead of desktop dropdown.
- `DEMO_USER`: all seeded identity/credential values, including `demo@example.test` / `DemoPass123!`.

Fixtures are isolated in `demoSeed.ts`, have `isMock: true`, and use `MOCK-` order numbers. `removeDemoSeed()` in `mockStorage.ts` removes the demo user and all of its records, addresses, card references, and basket while retaining other users. Disable `ENABLE_DEMO_SEED` to prevent a new database from seeding. For a complete demo reset, delete only the configured storage key in browser developer tools. The existing legacy enquiry queue uses its original storage separately.

## Real backend replacement

Replace every mock adapter before launch. Use server-managed sessions, password hashing and recovery, server-side validation, authorization and ownership checks, and role enforcement; client route protection is only UI. Public registration must remain customer-only. The role model is ready for future admin authentication, but this work does not secure or build admin screens.

Implement authoritative order/request lifecycle and basket persistence, a retry-safe merge endpoint, current stock/pricing validation, and real invoice URLs. Replace `captureLocalOrder` with real order retrieval/creation integration and replace the local enquiry compatibility bridge with real submissions. Supply real address persistence when supported. Replace mock card references with a payment provider's tokenized vault and hosted card fields; never persist full card numbers or CVVs in this app. Card references are display-only and are not connected to checkout. Do not enable invoice downloads without a real invoice. Mock data is isolated per browser, not shared across devices, and has no email verification or password recovery service.

## File inventory for this account feature

Created:

- `src/config/account.ts`
- `src/services/account/{contracts.ts,index.ts,validation.ts,demoSeed.ts,mockStorage.ts,mockAuth.ts,mockBasket.ts,mockOrders.ts,mockRequests.ts,mockAddresses.ts,mockCards.ts,README.md}`
- `src/features/account/{useAuth.tsx,hooks.ts,accountBasketBridge.ts,ProtectedAccountRoute.tsx,AuthScreen.tsx,AccountUi.tsx,AccountDashboard.tsx,AccountDetails.tsx,AccountOrders.tsx,AccountRequests.tsx,AccountAddresses.tsx,AccountCards.tsx,account.css}`
- `src/components/layout/header/HeaderAccount.tsx`

Changed:

- `src/App.tsx`
- `src/components/layout/header/HeaderActions.tsx`
- `src/pages/{AccountPage.tsx,LoginPage.tsx,RegisterPage.tsx,EnquiryPage.tsx}`

Other existing workspace changes predate this account task.

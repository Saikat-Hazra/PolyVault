# PolyVault PRD

Oct 26, 2026 · @Cyclone

## 1. Product Overview

PolyVault is a two-sided marketplace where 3D artists sell and license digital assets (models, rigs, HDRIs, materials) and buyers preview them in 3D before paying. It is a full-stack MERN application, and the second iteration of the architecture proven in ShopKart (Labs 01 to 06): the same authentication, catalog, wishlist, cart, checkout and payment-verification patterns, applied to digital goods.

**Elevator pitch:** a creator-first vault for 3D assets, with live in-browser previews, clear license tiers and payment-gated downloads.

| Item | Detail |
| --- | --- |
| Product name | PolyVault |
| Product type | Web application (React frontend, Node/Express API, MongoDB) |
| Payments | Razorpay, Test Mode only |
| Builds on | ShopKart Labs 01 to 06 |
| Primary roles | Buyer, Creator |
| Status | Proposed external project |

## 2. Problem and Opportunity

ShopKart proved the commerce pattern for physical goods; PolyVault tests whether the same pattern holds for digital goods, where the hard problems are licensing and delivery rather than inventory and shipping.

**Problems this product addresses**

- **Buyers cannot judge a 3D asset from a flat thumbnail.** Topology, scale and materials only show when the model is rotated and zoomed.
- **One asset has several legitimate uses.** A hobbyist, a studio and a reseller should not pay the same price or receive the same rights, so price must attach to a license tier, not to the asset alone.
- **Digital delivery is irreversible.** Once a file is downloaded it cannot be taken back, so access must unlock only after payment is cryptographically verified on the server.
- **Creators have no storefront of their own** in a plain catalog model. A marketplace needs an upload flow, ownership rules and a sales view.

**Opportunity**

- A live 3D preview on the product page makes the demo visually distinct from a standard shopping site.
- License tiers, creator ownership and gated downloads are new backend problems that go beyond renaming ShopKart's Product model.
- Auth, payments and signature verification are the highest-risk parts of any commerce system, and ShopKart already proved them, so new effort goes into new problems.

## 3. Goals, Non-Goals and Success Metrics

The goal is a working, demonstrable marketplace in which a creator can publish an asset and a buyer can preview, license, pay for and download it, with every security rule enforced on the server.

**Goals**

1. Reuse ShopKart's proven architecture for auth, catalog, wishlist, cart, checkout and orders.
2. Add three genuinely new capabilities: license tiers, creator uploads with ownership, and payment-gated downloads.
3. Show a live 3D preview on the asset detail page.
4. Keep every price, total and access decision server-side.

**Non-goals**

- Real payments, creator payouts or tax handling (Razorpay Test Mode only).
- An admin or moderation system, refunds, or dispute handling.
- Mobile apps, notifications or email delivery.
- Automatic format conversion or server-side model rendering.

**Success metrics**

| Metric | Target | How it is checked |
| --- | --- | --- |
| Verified-payment rule | 100% of downloads follow a PAID order whose signature was verified | Postman tests T8 to T10 in section 13 |
| Tampered totals | 0 orders created with a client-supplied price | Test with a fake total in the request body |
| Secret exposure | 0 API responses contain a password hash or the Razorpay key secret | Inspect every response in the test plan |
| Ownership | 0 cross-user reads of orders, downloads or listing edits | Test with a second account |
| End-to-end flow | Register to download works in one session | Manual run with a Razorpay test card |
| UI consistency | Navbar cart count always equals the Cart page | Manual check after add, change and remove |

## 4. Users and Personas

Every account is a Buyer; any Buyer can switch on the Creator role, so both roles live on one user record and no separate admin system is needed.

|  | Buyer | Creator |
| --- | --- | --- |
| Who | Indie game developer, motion designer or student building a scene | 3D artist who wants to sell or license finished work |
| Goal | Find a usable asset quickly and know exactly what rights the license gives | Publish assets, set tier prices and see what sells |
| Pain points | Cannot judge quality from a still image; unclear usage rights; unsure the file matches the listing | No storefront, no control over license pricing, no view of sales |
| Key actions | Search, filter, preview in 3D, wishlist, add a license to the cart, pay, download, view order history | Everything a Buyer does, plus upload an asset, define license tiers, edit or unlist, view sales |
| Access rules | Sees only their own cart, wishlist and orders | Edits only listings they own; sees sales only for their own assets |

The personas are representative archetypes for design decisions, not research findings.

## 5. Feature Requirements

Thirteen features are must-haves (P0), four are should-haves (P1), and two are stretch items (P2); each maps to the ShopKart lab it extends.

| ID | Feature | Priority | Origin | Requirement |
| --- | --- | --- | --- | --- |
| F1 | Authentication | P0 | Lab 01 | Register, login, logout, profile; bcrypt hashes; JWT in an HttpOnly cookie; auth middleware |
| F2 | Frontend session | P0 | Lab 02 | AuthContext restores the session on reload; ProtectedRoute guards private pages |
| F3 | Creator role | P0 | New | A Buyer can opt in to selling; role stored as a flag on the user |
| F4 | Asset catalog | P0 | Lab 03 | List, search, and filter by category, file format, polycount range and price |
| F5 | Asset detail with 3D preview | P0 | New | Rotate and zoom a .glb preview before buying |
| F6 | License tiers | P0 | New | Each asset has one or more tiers with a name, price and optional license limit |
| F7 | Wishlist | P1 | Lab 04 | Save and remove assets; hearts reflect saved state after reload |
| F8 | License cart | P0 | Lab 05 | One tier per asset, no quantity; validation against tier availability |
| F9 | Global cart state | P0 | Lab 05 | One shared CartContext; subtotal and item count derived, never stored |
| F10 | Checkout with billing details | P0 | Lab 06 | Form with client and server validation; replaces the shipping address |
| F11 | Razorpay payment | P0 | Lab 06 | Server-created order, Test Mode checkout, HMAC signature verification |
| F12 | Orders and snapshots | P0 | Lab 06 | Order stores title, tier and price at purchase time; order history and detail pages |
| F13 | Gated download | P0 | New | Download works only for the owner of a PAID order |
| F14 | Creator upload and My Listings | P0 | New | Create, edit and unlist own assets; ownership enforced |
| F15 | Creator sales dashboard | P1 | New | Sales list and total earnings for own assets |
| F16 | Change password | P1 | Lab 01 bonus | Verify old password, hash the new one |
| F17 | Order status progression | P1 | Lab 06 bonus | PLACED moves to DELIVERED when the buyer first downloads |
| F18 | Reviews and ratings | P2 | New | Only buyers of an asset can review it |
| F19 | Bundle pricing | P2 | New | Discount for several assets from one creator |

## 6. Key User Journeys

The buyer journey ends only after the server verifies the payment signature; a failed payment marks the order FAILED and leaves the cart intact.

**Buyer: from discovery to download**

1. Register, log in, and land on the catalog.
2. Search or filter; open an asset and rotate its 3D preview.
3. Optionally save the asset to the wishlist.
4. Choose a license tier and add it to the cart; the navbar count updates at once.
5. Open the cart, change a tier or remove an item; the subtotal is recalculated from live prices.
6. Proceed to checkout and fill in billing details; invalid fields block the request on the client.
7. The server re-validates every cart line, calculates the total, creates a PENDING\_PAYMENT order and a Razorpay order.
8. Razorpay Checkout opens; the buyer pays with a test card.
9. The browser sends the payment id, order id and signature to the server.
10. The server recomputes the signature using the Razorpay order id it stored. If it matches, the order becomes PAID and PLACED, license counts are reduced, and the cart is cleared. If it does not match, the order is marked FAILED and the cart stays intact.
11. The buyer sees the confirmation page, then downloads from My Orders.

**Creator: from listing to sale**

1. Log in and switch on the Creator role.
2. Create a listing: title, description, category, formats, polycount, thumbnail, preview model and one or more license tiers.
3. The listing appears in My Listings and, once published, in the public catalog.
4. Edit prices or unlist the asset; only the owner can do so.
5. Open the sales dashboard to see which tiers sold and the total earned.

## 7. Data Model

Three collections: Customer (with embedded wishlist and cart lines), Asset (with embedded license tiers) and Order (with item snapshots). The Order copies purchase-time data; the cart always shows live data.

**Customer** (extends the ShopKart model)

| Field | Type | Rules |
| --- | --- | --- |
| fullName | String | Required |
| email | String | Required, unique, lowercase |
| password | String | bcrypt hash; excluded from queries by default |
| phone | String | Required |
| isCreator | Boolean | Default false; set by the become-creator endpoint |
| wishlist | \[ObjectId\] | References Asset; no duplicates |
| cart | \[CartLine\] | See below |
| createdAt | Date | Automatic |

**Asset** (replaces Product)

| Field | Type | Rules |
| --- | --- | --- |
| title | String | Required |
| description | String | Optional |
| creator | ObjectId | References Customer; set from the token, never from the request body |
| category | String | Character, Prop, Environment, HDRI or Material |
| fileFormats | \[String\] | For example .blend, .fbx, .obj |
| polycount | Number | Minimum 0 |
| thumbnailImage | String | URL |
| previewModelUrl | String | URL of a .glb file for the viewer |
| filePath | String | Private location of the deliverable file; never returned by public endpoints |
| licenseTiers | \[LicenseTier\] | At least one; tier names unique within an asset |
| isPublished | Boolean | Unlisted assets are hidden from the catalog |
| createdAt, updatedAt | Date | Automatic |

**LicenseTier** (embedded in Asset)

| Field | Type | Rules |
| --- | --- | --- |
| name | String | Personal, Commercial or Extended |
| price | Number | Minimum 0 |
| remainingLicenses | Number or null | null means unlimited; never below 0 |

**CartLine** (embedded in Customer)

| Field | Type | Rules |
| --- | --- | --- |
| asset | ObjectId | References Asset |
| licenseTier | String | Name of one tier of that asset; one line per asset |

**Order**

| Field | Type | Rules |
| --- | --- | --- |
| user | ObjectId | References Customer |
| items | \[OrderItem\] | Snapshot; see below |
| billingDetails | Object | fullName, email, phone, optional GST number |
| totalAmount | Number | Calculated on the server |
| paymentStatus | Enum | PENDING, PAID, FAILED |
| status | Enum | PENDING\_PAYMENT, PLACED, DELIVERED |
| razorpayOrderId, razorpayPaymentId | String | Set at creation and after verification |
| createdAt, updatedAt | Date | Automatic |

**OrderItem** (snapshot): asset (ObjectId), title, licenseTier, price, thumbnailImage. A download link is never stored; it is generated on request after the ownership and payment checks pass.

## 8. API Contract

There are 29 endpoints; every route marked Yes, Creator, Owner or Dev only requires a valid token cookie, and the user always comes from the token, never from the request body. Register /assets/categories before /assets/:id so the word categories is not read as an id.

| Method | Endpoint | Auth | Purpose and key errors |
| --- | --- | --- | --- |
| POST | /customers/register | No | Create account. 400 missing field or short password; 409 duplicate email |
| POST | /customers/login | No | Verify password, set HttpOnly cookie. 401 generic invalid credentials |
| GET | /customers/me | Yes | Current profile, no password. 401 |
| POST | /customers/logout | Yes | Clear cookie |
| PATCH | /customers/change-password | Yes | Verify old password, hash new one. 400, 401 |
| PATCH | /customers/become-creator | Yes | Set isCreator to true |
| GET | /assets | No | Published assets; query: search, category, format, minPolycount, maxPolycount, minPrice, maxPrice. Never returns filePath |
| GET | /assets/:id | No | One published asset with tiers and preview URL. 400 bad id; 404 |
| POST | /assets | Creator | Create a listing owned by the caller. 400 validation; 403 not a creator |
| PATCH | /assets/:id | Owner | Edit fields, tiers or isPublished. 403 not owner; 404 |
| GET | /creator/assets | Creator | The caller's own listings, including unpublished |
| GET | /creator/sales | Creator | Paid order items for the caller's assets |
| GET | /creator/earnings | Creator | Total earned from PAID orders |
| POST | /wishlist/:assetId | Yes | Add; idempotent. 404 unknown asset |
| GET | /wishlist | Yes | Populated wishlist |
| DELETE | /wishlist/:assetId | Yes | Remove |
| POST | /cart/:assetId | Yes | Body: licenseTier. Add or replace the line. 400 unknown tier or sold out; 404 |
| GET | /cart | Yes | Cart populated with live asset and tier data |
| PATCH | /cart/:assetId | Yes | Body: licenseTier. Change tier. 400, 404 not in cart |
| DELETE | /cart/:assetId | Yes | Remove the line |
| POST | /orders/create-payment-order | Yes | Body: billingDetails only. Re-validates the cart, calculates the total, creates the order and Razorpay order. 400 empty cart, bad billing data, unavailable tier |
| POST | /orders/verify-payment | Yes | Body: shopKartOrderId, razorpay\_order\_id, razorpay\_payment\_id, razorpay\_signature. 400 invalid signature; 403 not the buyer's order |
| GET | /orders | Yes | The caller's orders, newest first |
| GET | /orders/:id | Yes | One order. 403 or 404 for someone else's |
| GET | /orders/:id/download/:assetId | Yes | Short-lived download for an item of a PAID order. 403 unpaid or not the buyer; 404 |
| GET | / | No | Health check |
| GET | /assets/categories | No | Allowed categories for filters and the upload form |
| DELETE | /assets/:id | Owner | Permanently remove an unpublished asset with no orders. 409 if orders exist |
| PATCH | /orders/:id/status | Dev only | Temporary development endpoint for status progression (F17) |

## 9. Business Rules and Edge Cases

The server owns every rule below; the frontend may mirror them for convenience, but a request that breaks one is rejected regardless of what the UI allowed.

| Rule | Expected behavior |
| --- | --- |
| Authentication | All wishlist, cart, order and creator routes reject a missing or invalid token with 401 |
| Creator-only actions | Uploading requires isCreator; otherwise 403 |
| Listing ownership | Edit, unpublish and delete work only for the asset's creator; creator is set from the token |
| One tier per asset in the cart | Adding the same asset again with another tier replaces the line instead of stacking |
| Unknown tier | A tier name not on the asset is rejected with 400 |
| Limited licenses | A tier with remainingLicenses of 0 cannot be added or bought; null means unlimited |
| Unpublished or deleted asset | Cannot be added; if it disappears after being added, checkout rejects the order |
| Price and tier changes | The cart always shows the latest price; an old order keeps its snapshot price |
| Empty cart | create-payment-order returns 400 |
| Client-supplied totals | Ignored; the total is the sum of live tier prices calculated on the server |
| Amount to Razorpay | Rupees multiplied by 100 and rounded, in paise |
| Signature check | Uses the Razorpay order id stored in the database, not the one in the browser callback |
| Invalid signature | Order marked FAILED, never PAID; cart unchanged; no download |
| Payment verified | Order becomes PAID and PLACED; license counts reduced; cart cleared |
| Cart clearing | Never when Checkout merely opens and never on a client-side success callback |
| Last license race | The count is reduced with a conditional update at verification; if it was just taken, the order is marked FAILED and flagged for a manual refund (see section 17) |
| Repeat verification | Verifying an already PAID order is idempotent and does not reduce counts twice |
| Download access | Only the buyer, only for items of a PAID order; the link is generated per request and expires |
| Order privacy | Another user's order returns 403 or 404 |
| Responses | Never include the password hash, the Razorpay key secret or the private file path |
| Login errors | A generic message, never revealing whether the email or password was wrong |

**Status codes used**

| Code | Meaning in this API |
| --- | --- |
| 200 | Success |
| 201 | Resource created (register, upload, payment order) |
| 400 | Validation failure, unknown tier, empty cart, invalid signature |
| 401 | Missing, invalid or expired token; wrong credentials |
| 403 | Authenticated but not allowed (not a creator, not the owner, unpaid download) |
| 404 | Resource does not exist |
| 409 | Duplicate email, or deleting an asset that has orders |
| 500 | Unexpected server error with a generic message |

## 10. Non-Functional Requirements

Security is the dominant requirement because the product sells files and takes payments; performance and reliability targets are modest and sized for a demo.

| Area | Requirement |
| --- | --- |
| Password storage | bcrypt with 10 salt rounds; the plain password is never stored or logged |
| Session | JWT payload holds only the user id; cookie is HttpOnly, SameSite and Secure in production |
| Secrets | JWT secret and Razorpay key secret live in .env, excluded from Git; only .env.example is committed; the secret never reaches the frontend |
| CORS | One allowed origin with credentials enabled; no wildcard |
| Input validation | Every body, param and query is validated on the server; the frontend checks are a convenience |
| Authorization | Ownership checked on every order, download, listing edit and sales read |
| File access | The deliverable file path is private; downloads go through a protected route that checks the order |
| Payments | Test Mode keys only; no card data is stored, only Razorpay identifiers |
| Preview performance | Preview models are capped in size so the detail page stays responsive; the exact cap is set in milestone M3 |
| Reliability | Server starts only after the database connects; unexpected errors return a generic 500 without stack traces |
| Usability | Every page has loading, empty and error states; the layout works at laptop and phone widths |
| Maintainability | MVC structure; one file per model, controller and route group; README documents setup and every endpoint |

## 11. Architecture and Tech Stack

A React single-page app talks to one Express API over REST; only the API holds secrets and reaches the database, Razorpay and file storage.

&#91;embedded content: system architecture · browser, API, 3 services\]

The browser reaches Razorpay only to open Checkout; order creation, signature verification and all database access happen in the API.

**Technology**

| Layer | Choice |
| --- | --- |
| Frontend | React 18 with Vite, React Router, Axios with credentials enabled |
| 3D preview | model-viewer web component for .glb files; a custom three.js canvas is an upgrade option |
| State | React Context: AuthContext and CartContext |
| Backend | Node.js and Express, MVC layout |
| Database | MongoDB Atlas with Mongoose |
| Auth | jsonwebtoken, bcrypt, cookie-parser; no authentication framework |
| Payments | Razorpay SDK on the server, Razorpay Checkout script in the browser, Test Mode |
| Uploads | Multipart upload handling on the server; storage provider to be decided (section 17) |

**Backend folder structure**

```text
backend/
  config/        razorpay.js
  controllers/   customer, asset, creator, wishlist, cart, order
  middlewares/   auth.middleware.js, creator.middleware.js, validate.js
  models/        customer.model.js, asset.model.js, order.model.js
  routes/        one file per controller
  utils/         generateToken.js, signDownload.js
  seed/          seedAssets.js
  index.js
```

**Frontend folder structure**

```text
frontend/src/
  context/       AuthContext.jsx, CartContext.jsx
  components/    Navbar, AssetCard, ModelPreview, CartLine, ProtectedRoute
  pages/         Login, Register, Catalog, AssetDetail, Wishlist, Cart,
                 Checkout, OrderSuccess, Orders, OrderDetails,
                 MyListings, NewListing, SalesDashboard
  services/      api.js
```

## 12. UI Pages and States

Thirteen pages cover both roles; every data-driven page must show a loading, empty and error state, and forms must block bad input before calling the API.

| Page | Route | Access | Purpose |
| --- | --- | --- | --- |
| Register | /register | Public | Create an account |
| Login | /login | Public | Sign in |
| Catalog | / | Logged in | Search, filter, wishlist heart, add a license |
| Asset detail | /assets/:id | Logged in | 3D preview, tiers, add to cart, wishlist |
| Wishlist | /wishlist | Logged in | Saved assets |
| Cart | /cart | Logged in | Tier per asset, remove, order summary |
| Checkout | /checkout | Logged in | Billing form, Razorpay Checkout |
| Order success | /order-success/:id | Logged in | Confirmation after verification |
| My orders | /orders | Logged in | Order history |
| Order details | /orders/:id | Logged in | Items, status, download buttons |
| My listings | /creator/listings | Creator | Own assets, edit, unlist |
| New listing | /creator/new | Creator | Upload form with tiers |
| Sales dashboard | /creator/sales | Creator | Sales list and earnings |

**Required states**

| State | Behavior |
| --- | --- |
| Loading | A plain message such as Loading your cart; buttons disabled while a request runs |
| Empty | A message and a link onward, for example an empty cart links to the catalog |
| Error | A message and a Try again button |
| Validation | Field-level errors on checkout and upload forms; no API call while a field is invalid |
| Direct access | Opening /checkout with an empty cart redirects to the cart; a logged-out user is sent to login |
| Cart sync | After any cart change the navbar count and the cart page agree without a refresh |
| Payment failure | A clear message; the cart is not cleared |

**Checkout form validation**

| Field | Rule |
| --- | --- |
| Full name | Required, not whitespace only |
| Email | Required, valid format |
| Phone | Required, 10 digits |
| GST number | Optional; if present, 15 characters |

## 13. Acceptance Criteria and Test Plan

The project is accepted when every checklist item holds and tests T1 to T12 pass in Postman before the React app is wired in.

**Backend acceptance**

- [ ] Customer has isCreator; existing users default to false
- [ ] Asset model stores license tiers, preview URL and a private file path
- [ ] Public endpoints never return filePath, password hashes or secrets
- [ ] Only creators can upload; only owners can edit or unpublish
- [ ] Cart holds one tier per asset and rejects unknown or sold-out tiers
- [ ] create-payment-order ignores client totals and creates a PENDING\_PAYMENT order plus a Razorpay order in paise
- [ ] verify-payment recomputes the HMAC using the stored Razorpay order id
- [ ] The order becomes PAID only after a valid signature; the cart is cleared only then
- [ ] Downloads work only for the buyer of a PAID order
- [ ] Order and download routes enforce ownership

**Frontend acceptance**

- [ ] AuthContext restores the session after a refresh; private routes redirect when logged out
- [ ] Asset detail shows a rotatable 3D preview
- [ ] One CartContext drives the navbar, catalog cards and cart page
- [ ] Subtotal and item count are derived, not stored
- [ ] Checkout validates billing details and shows server errors
- [ ] A successful payment clears cart state and the navbar shows zero
- [ ] A failed payment keeps the cart and shows a message
- [ ] Every data page has loading, empty and error states

**Postman test plan**

| ID | Test | Expected result |
| --- | --- | --- |
| T1 | Register with an email already in use | 409 |
| T2 | Log in with valid credentials | 200 and an HttpOnly token cookie |
| T3 | GET /customers/me with no cookie | 401 |
| T4 | POST /assets as a user who is not a creator | 403 |
| T5 | Add to cart with a tier name that does not exist | 400 |
| T6 | Add a tier whose remainingLicenses is 0 | 400 |
| T7 | create-payment-order with a fake totalAmount of 1 in the body | Razorpay amount equals the server-calculated total |
| T8 | verify-payment with a fake signature | 400; order is FAILED; cart still full |
| T9 | Download an item before the order is PAID | 403 |
| T10 | Complete a Test Mode payment, then verify | Order PAID and PLACED; cart empty; download works |
| T11 | A second user requests the first user's order | 403 or 404 |
| T12 | A creator edits another creator's asset | 403 |

## 14. Milestones and Build Order

Six milestones take the existing ShopKart code to a finished PolyVault; each ends in a gate that can be tested before the next begins, and no calendar dates are fixed yet.

&#91;embedded content: build roadmap · 6 milestones, 6 gates\]

The gates are the pass and fail checks from section 13; a milestone starts only when the previous gate holds.

## 15. Risks and Mitigations

The riskiest items are the ones ShopKart never covered: file upload, private storage and the license-count race at payment time.

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Asset files stored where anyone can fetch them | Paid content leaks | Keep files private; serve only through the protected download route |
| Two buyers take the last license | One buyer pays and cannot be served | Reduce the count with a conditional update at verification; mark the order FAILED and flag it for a manual refund |
| Creator spoofing via the request body | A user lists assets as someone else | Set creator from the token and ignore any creator field in the body |
| Large preview models slow the detail page | Poor demo experience | Cap preview size and keep previews separate from the deliverable file |
| Test-mode payments behave differently from live | Surprises after the lab | State clearly that only Test Mode is in scope |
| Mongo SRV lookup fails on some networks | Server cannot start | Use the non-SRV connection string, as in ShopKart |
| Secrets committed to Git | Account compromise | .gitignore for .env; only .env.example is committed |
| Scope creep into reviews and bundles | Core flow unfinished | Keep P2 items out until every P0 gate passes |
| Cart and navbar disagree | Visible bug in the demo | One CartContext; derived values only |

## 16. Evaluation Rubric and Viva Preparation

The proposed rubric weights the new work (licensing, uploads, gated downloads) alongside the carried-over payment and state-management work, out of 100 marks.

| Area | Marks |
| --- | --: |
| Auth, roles and ownership rules | 10 |
| Asset model, license tiers and creator upload | 15 |
| Catalog, filters and 3D preview | 10 |
| License cart and global state | 15 |
| Checkout form and validation | 10 |
| Razorpay order and signature verification | 15 |
| Orders, snapshots and gated downloads | 15 |
| Code quality, README and viva | 10 |
| **Total** | **100** |

**Viva questions to prepare**

1. Why must the Razorpay order be created on the server, and why must the key secret never reach React?
2. What are razorpay\_order\_id, razorpay\_payment\_id and razorpay\_signature, and why is verification mandatory?
3. Why does the signature check use the order id stored in the database?
4. Why does an Order store title, tier and price instead of only references?
5. Why does the cart hold a license tier instead of a quantity, and what happens when the same asset is added with another tier?
6. How do you stop a user downloading a file they have not paid for, and why is the file path never returned?
7. How is the creator of a listing decided, and why is it not taken from the request body?
8. What happens if two buyers pay for the last license at the same moment?
9. Why are the subtotal and cart count derived instead of stored?
10. Why does the cart persist across logout and login, and where does that state live?
11. Why bcrypt rather than encryption, and what does the JWT payload contain?
12. What does the HttpOnly flag protect against?

## 17. Future Scope and Open Questions

Four decisions are still open and affect milestones M2, M3, M5 and M6; the rest are extensions beyond this project.

**Open questions**

- [ ] **File storage provider.** Where do preview models and deliverable files live, and how are they kept private? This decides the upload library and the download route in M2 and M6.
- [ ] **Last-license failure path.** When a payment succeeds but the license was just taken, is the order only flagged for a manual refund, or should the project attempt a Razorpay refund call? The current plan flags it.
- [ ] **Preview size cap.** What maximum size for a preview .glb keeps the detail page responsive? To be measured in M3.
- [ ] **Creator access.** Is the Creator switch open to every user, as proposed, or does the submission need an approval step?

**Future scope**

- Creator payouts and a commission model
- Reviews and ratings limited to verified buyers
- Bundle discounts and coupons
- Thumbnails rendered automatically from uploaded models
- Pagination for the catalog and order history
- An admin role for moderation and refunds

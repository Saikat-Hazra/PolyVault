# 🧊 PolyVault — A 3D Asset Marketplace for Creators

**External Project Proposal — built on the ShopKart engineering lab series**
**Proposed by:** Saikat Hazra

---

## 1. The Pitch

ShopKart taught the full purchase journey — auth, catalog, wishlist, cart, checkout, payment verification, order history — using a generic physical-goods store. **PolyVault reuses every one of those same architectural patterns**, but applies them to a domain you actually care about and already create content around: **a marketplace where 3D artists sell and license Blender/3D assets (models, rigs, HDRIs, materials) to other creators.**

This isn't "ShopKart with different product names." The domain forces genuinely new engineering problems that a plain e-commerce clone never hits:

- **Digital licensing instead of physical stock** — "stock" doesn't mean warehouse inventory, it means *how many times this asset can be licensed* (or unlimited, for some tiers) — a different business rule entirely from Lab 05's stock validation.
- **Interactive 3D preview** — instead of a flat product photo, buyers rotate/zoom a live 3D model in the browser before buying (three.js / `<model-viewer>`), using exactly the 3D skills you're already building for your channel.
- **Two-sided marketplace** — creators *upload and sell* assets, not just an admin seeding a catalog. This adds an upload flow, a "my listings" dashboard, and creator payouts as a genuinely new backend concern Lab 06 never covered.
- **License tiers instead of a single price** — one asset might have a "Personal Use," "Commercial Use," and "Extended/Resale" tier at different prices, which changes how Cart, Order snapshots, and Checkout all need to work.

Every one of these is a natural *extension* of something you already built — not a rewrite.

---

## 2. User Roles

| Role | Can do |
|---|---|
| **Buyer** (every registered user by default) | Browse, preview in 3D, wishlist, add license tiers to cart, checkout, pay, download purchased assets, view order history |
| **Creator** (any user can opt in via a "Become a Creator" toggle on their profile) | Everything a Buyer can, plus: upload assets, set license tiers/pricing, view sales dashboard, see earnings |

Keeping both roles on the same `Customer`/`User` model (with an `isCreator: Boolean` flag) avoids building a separate admin system from scratch — it's a direct, small extension of your existing `customer.model.js`.

---

## 3. Feature Map — ShopKart Lab → PolyVault Equivalent

| ShopKart (Labs 01–06) | PolyVault equivalent | What's new |
|---|---|---|
| Lab 01 — Customer auth (JWT + HttpOnly cookie) | **Identical**, unchanged | Add `isCreator: Boolean` field to the user model |
| Lab 03 — Product catalog, search/filter | **Asset catalog** — search/filter by category (Character, Prop, Environment, HDRI, Material), file format (.blend, .fbx, .obj), polycount range | Filtering gets domain-specific facets |
| Lab 04 — Wishlist | **Identical pattern** — "Save for later" on assets | Unchanged |
| Lab 05 — Cart, quantity, stock validation | **License cart** — instead of quantity, each cart line is *which license tier* for that asset; "stock" becomes "remaining licenses" (or `null` for unlimited) | New validation: can't add the same asset at two different tiers simultaneously — must replace, not stack |
| Lab 06 — Checkout, server-side price recalculation, Razorpay, Order snapshot | **Identical payment flow** — Razorpay Test Mode, signature verification, server-calculated total, Order snapshots name/price/tier at purchase time | Order snapshot also stores a **secure, time-limited download link** generated only after payment is verified |
| *(New)* | **Creator upload + dashboard** | `POST /assets` (creator-only), `GET /creator/sales`, `GET /creator/earnings` |
| *(New)* | **3D preview on the product page** | Embed a `.glb`/`.gltf` preview using `<model-viewer>` (Google's web component, zero backend work) or a custom three.js canvas if you want to show off more |

---

## 4. New Data Models

### Asset (replaces `Product`)

```js
{
  title: String,
  description: String,
  creator: ObjectId,              // ref: Customer, where isCreator === true
  category: String,                // Character | Prop | Environment | HDRI | Material
  fileFormats: [String],           // [".blend", ".fbx", ".obj"]
  polycount: Number,
  thumbnailImage: String,
  previewModelUrl: String,         // .glb file for the 3D viewer
  licenseTiers: [
    {
      name: String,                // "Personal", "Commercial", "Extended"
      price: Number,
      remainingLicenses: Number,   // null = unlimited
      downloadFileUrl: String      // only revealed after verified purchase
    }
  ],
  createdAt, updatedAt
}
```

### Cart item (extends the Lab 05 pattern)

```js
{
  asset: ObjectId,
  licenseTier: String,   // which tier, instead of a plain quantity
  // quantity is implicitly 1 — a license isn't usually bought in bulk
}
```

### Order item (extends the Lab 06 snapshot pattern)

```js
{
  asset: ObjectId,
  title: String,          // snapshot
  licenseTier: String,    // snapshot — tier pricing could change later
  price: Number,           // snapshot
  downloadUrl: String      // generated/unlocked only after payment verification
}
```

---

## 5. Suggested Build Order (reusing your existing code as a base)

1. **Extend the Customer model** — add `isCreator`, migrate existing users to default `false`
2. **Rename/extend Product → Asset** — add `licenseTiers`, `previewModelUrl`, creator-specific fields
3. **Creator upload flow** — new `POST /assets` (creator-only via a small role check in middleware), a simple "My Listings" page on the frontend
4. **3D preview integration** — add `<model-viewer>` via CDN script to the Asset detail page; point it at `previewModelUrl`. This is a 10-line addition once you have a `.glb` file to test with (Blender can export `.glb` directly — you likely already know this)
5. **Reuse Cart/Checkout/Order almost as-is** — swap `quantity` validation for `licenseTier` validation, everything else (Razorpay flow, signature verification, server-side total calc) carries over directly
6. **Secure download delivery** — after `verify-payment` succeeds, generate a signed/expiring download URL (or just a protected `GET /orders/:id/download/:assetId` route guarded by ownership + payment status) instead of a static link

---

## 6. Why This Is a Strong External Project Submission

- **Not a copy-paste rename** — license tiers, creator uploads, and the download-gating logic are genuinely new backend problems, which shows depth beyond "I changed the model name."
- **Visually distinctive** — a live, rotatable 3D preview is immediately more impressive in a demo/viva than a static product grid, and it's a natural showcase of your Blender/VFX skillset alongside your MERN skillset.
- **Clear two-sided marketplace story** — "buyers and creators" gives you a richer system-design narrative than a single-sided storefront, which tends to score well on architecture/design rubrics.
- **Everything risky is already proven** — auth, payments, and signature verification are the hardest/highest-stakes parts of any e-commerce system, and you've already built and debugged all of them in ShopKart. This project's *new* surface area (uploads, previews, licensing) is comparatively low-risk to add on top.

---

## 7. Stretch Ideas (only if time allows)

- Creator earnings dashboard with a simple chart (sales over time)
- Reviews/ratings on assets
- A "render preview" thumbnail generator using a serverless Blender headless render (ambitious — skip unless you have time to spare)
- Bundle pricing (buy 3 assets from one creator, get a discount)

---

<div align="center">

**PolyVault — same architecture you've already mastered, applied to a domain that's actually yours.**

</div>

# 🧊 PolyVault — 3D Asset Marketplace for Creators

**Discover, preview, buy, and sell digital 3D assets in one place.**

PolyVault is a full-stack marketplace designed for 3D artists, digital creators, and developers. It enables creators to showcase and sell digital assets while allowing buyers to explore available resources, preview supported 3D models interactively, manage their shopping carts, and purchase digital products.

Built with the MERN stack, PolyVault combines a React-based storefront, an Express REST API, MongoDB persistence, JWT-based authentication, and Razorpay Test Mode payment integration.

> **Project status:** Under active development. Payment integration uses Razorpay Test Mode. Production deployment, payment verification, and download authorization should be validated before accepting real payments or distributing protected assets.

---

## ✨ Key Features

### 🛍️ Marketplace & Asset Discovery
- Browse a catalog of digital 3D assets.
- Explore assets such as 3D models, rigs, HDRIs, and materials.
- View asset information and available product details.
- Use a centralized storefront to discover digital resources.

### 🎨 Interactive 3D Preview
- Preview supported 3D models in an interactive viewport.
- Explore digital assets before making a purchase.
- Provide creators with a dedicated space to showcase their work.

### 👤 Authentication & User Accounts
- Customer registration and login.
- JWT-based authentication using HttpOnly cookies.
- Protected endpoints for authenticated operations.
- Customer profile and account management.
- Password change functionality.

### ❤️ Wishlist & Shopping Cart
- Add assets to a personal wishlist.
- Manage cart items before checkout.
- Organize the purchase flow from discovery to order placement.

### 💳 Payment Integration
- Razorpay SDK integration in Test Mode.
- Backend API for handling order and payment workflows.
- HMAC-based payment signature verification in the payment flow.
- Server-side payment verification and order validation.
- Payment-gated digital asset delivery as an intended security boundary.

**Security principle:** The backend must remain authoritative for prices, payment status, order ownership, and download authorization. A frontend success message alone must never grant access to a paid asset.

### 🧑‍🎨 Creator Experience
- Dedicated creator-related API routes.
- Creator role and authorization middleware.
- A foundation for managing digital products and creator workflows.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React 18, Vite, React Router |
| Styling | Tailwind CSS, custom CSS design tokens |
| 3D rendering | Three.js |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Authentication | JSON Web Tokens (JWT), HttpOnly cookies |
| Password security | bcryptjs |
| Payments | Razorpay SDK — Test Mode |
| API communication | REST APIs, Axios |
| Development tools | npm, Nodemon, Git |

---

## 🏗️ Architecture

PolyVault follows a modular client-server architecture with a clear separation between the frontend, backend, and database.

```text
                 ┌─────────────────────────┐
                 │      React Frontend     │
                 │                         │
                 │  Catalog & Asset Views  │
                 │  3D Model Preview       │
                 │  Authentication         │
                 │  Cart & Wishlist        │
                 │  Checkout & Orders      │
                 └────────────┬────────────┘
                              │
                         REST API
                              │
                 ┌────────────▼────────────┐
                 │      Express API        │
                 │                         │
                 │  Customer Controllers   │
                 │  Asset Controllers      │
                 │  Creator Controllers    │
                 │  Cart & Wishlist        │
                 │  Order & Payment Logic  │
                 │  Authentication Guards  │
                 └────────────┬────────────┘
                              │
                 ┌────────────▼────────────┐
                 │       MongoDB Atlas     │
                 │                         │
                 │  Customers              │
                 │  Assets                 │
                 │  Orders                 │
                 └─────────────────────────┘
```

### Request Flow

1. The React frontend renders the marketplace interface and collects user actions.
2. The frontend communicates with the Express API through HTTP requests.
3. Backend routes dispatch requests to the relevant controllers and middleware.
4. Mongoose manages application data in MongoDB.
5. Authentication middleware protects endpoints that require a logged-in customer or creator.
6. Payment and order workflows are handled by the backend, with Razorpay used for payment processing.

---

## 📁 Project Structure

```text
PolyVault/
├── backend/
│   ├── config/
│   │   └── razorpay.js
│   ├── controllers/
│   │   ├── customer.controller.js
│   │   ├── asset.controller.js
│   │   ├── creator.controller.js
│   │   ├── wishlist.controller.js
│   │   ├── cart.controller.js
│   │   └── order.controller.js
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   └── creator.middleware.js
│   ├── models/
│   │   ├── customer.model.js
│   │   ├── asset.model.js
│   │   └── order.model.js
│   ├── routes/
│   │   ├── customer.routes.js
│   │   ├── asset.routes.js
│   │   ├── creator.routes.js
│   │   ├── wishlist.routes.js
│   │   ├── cart.routes.js
│   │   └── order.routes.js
│   ├── seed/
│   │   └── seedAssets.js
│   ├── utils/
│   │   ├── generateToken.js
│   │   └── signDownload.js
│   ├── .env.example
│   ├── package.json
│   └── index.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── ProjectRules.md
├── PRD.md
├── progress.txt
├── Workflow.png
├── .gitignore
└── README.md
```

*The structure above is a guide to the main application files. Keep filenames and optional documentation files consistent with the actual repository.*

---

## 🚀 Getting Started

Follow these instructions to run PolyVault locally.

### Prerequisites

Install the following before starting:

- [Node.js](https://nodejs.org/) — use a currently supported LTS release.
- npm, included with Node.js.
- A [MongoDB Atlas](https://www.mongodb.com/atlas) cluster or a local MongoDB instance.
- A [Razorpay account](https://razorpay.com/) for testing payment integration.
- Git, if cloning the repository.

### 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd PolyVault
```

Replace the repository URL with the actual public or private Git URL.

### 2. Configure the Backend

```bash
cd backend
npm install
```

Create your local environment file by copying `.env.example`.

**Windows PowerShell:**

```powershell
Copy-Item .env.example .env
```

**macOS / Linux:**

```bash
cp .env.example .env
```

Open `backend/.env` and configure the following variables:

```dotenv
PORT=5001
NODE_ENV=development
CLIENT_URL=http://localhost:5173

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret

RAZORPAY_KEY_ID=your_razorpay_test_key_id
RAZORPAY_KEY_SECRET=your_razorpay_test_key_secret
```

Replace every placeholder with your own values. Do not commit `.env` to version control.

**MongoDB configuration**

1. Create a database in MongoDB Atlas.
2. Create a database user with appropriate permissions.
3. Configure network access for your development environment.
4. Copy the database connection string into `MONGO_URI`.

**JWT configuration**

Use a long, randomly generated secret for `JWT_SECRET`. Keep it private and separate from your database and payment credentials.

**Razorpay configuration**

Use your Razorpay Test Mode credentials while developing. Never place the Razorpay secret key in frontend code.

### 3. Start the Backend

From the `backend` directory, run:

```bash
npm run dev
```

The API should start on:

```text
http://localhost:5001
```

Verify that MongoDB connects successfully. The root health endpoint is:

```text
GET http://localhost:5001/
```

A successful response should indicate that the PolyVault API is operational.

### 4. Configure and Start the Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The Vite development server should be available at:

```text
http://localhost:5173
```

Open that address in your browser.

### 5. Configure API Proxying

During local development, the Vite proxy forwards API requests to the backend.

For example, if the frontend uses `/api/customers/register`, the proxy should remove the `/api` prefix before forwarding the request to Express.

Ensure the frontend API client and `vite.config.js` use the same URL convention. The Express backend currently mounts routes under `/customers`, `/assets`, `/creator`, `/wishlist`, `/cart`, and `/orders`.

---

## 🔐 Security Considerations

Security is especially important in a marketplace that sells downloadable digital products.

### Authentication
- Store authentication tokens in appropriately configured HttpOnly cookies.
- Protect private endpoints using authentication middleware.
- Apply creator authorization checks to creator-only operations.
- Validate user input on the server.

### Passwords
- Hash passwords before storing them.
- Never return password hashes in API responses.
- Avoid logging passwords, tokens, or other credentials.

### Payments
- Keep Razorpay secret credentials exclusively on the backend.
- Verify payment signatures using the expected server-side HMAC procedure.
- Validate the corresponding order, amount, currency, and payment state.
- Do not trust client-submitted payment status or prices.
- Make order confirmation and fulfillment resilient to repeated requests.

### Digital Asset Delivery
- Authorize each download against a verified, paid order.
- Check that the requesting customer owns the relevant purchase.
- Avoid exposing permanent private storage URLs.
- If signed download URLs are used, make them time-limited and difficult to reuse.
- Prevent unauthorized users from bypassing the payment workflow.

### Deployment
- Use HTTPS in production.
- Configure secure cookie settings and appropriate CORS origins.
- Keep secrets in the hosting provider's environment-variable configuration.
- Never commit `.env`, database credentials, payment secrets, or private asset files.

> **Production readiness:** These are the security requirements for the intended system. Review and test the actual implementation before treating payment verification, download gating, or other security controls as production-ready.

---

## 🌐 Deployment & Hosting

PolyVault can be deployed using separate frontend and backend hosting services, with MongoDB Atlas providing managed database access.

A typical deployment setup is:

| Component | Deployment option |
|---|---|
| Frontend | Vercel, Netlify, or another static frontend host |
| Backend | Render, Railway, or another Node.js-capable host |
| Database | MongoDB Atlas |
| Payments | Razorpay Test Mode during development |

### Deployment Checklist

- [ ] Push the project to a Git repository.
- [ ] Remove `.env` files, `node_modules`, build output, and other generated files from version control.
- [ ] Configure production MongoDB connection settings.
- [ ] Set a strong production `JWT_SECRET`.
- [ ] Configure the frontend's API base URL.
- [ ] Set `CLIENT_URL` to the deployed frontend origin.
- [ ] Configure production cookie and CORS behavior.
- [ ] Set Razorpay credentials through the backend hosting environment.
- [ ] Verify payment signatures and order ownership.
- [ ] Test protected routes and digital asset download authorization.
- [ ] Test refresh, error handling, and routing behavior on the deployed frontend.
- [ ] Verify that no secrets are exposed in client-side bundles or logs.

**Note:** Deployment commands and settings depend on the hosting provider. The project should not be considered deployed until the live frontend and backend have been tested together.

---

## 🧪 Testing & Validation

Before submitting a release or accepting contributions, validate the following workflows:

- Customer registration, login, and logout.
- Invalid credentials and duplicate registration attempts.
- Protected routes and expired authentication.
- Asset catalog retrieval and asset detail views.
- Wishlist and cart operations.
- Creator authorization.
- Order creation and payment verification.
- Failed, repeated, and interrupted payment attempts.
- Download authorization for paid and unpaid orders.
- Mobile responsiveness and interactive 3D previews.
- API behavior when MongoDB or payment services are unavailable.

Add automated unit and integration tests as the project evolves. Do not consider a workflow tested merely because the relevant page renders successfully.

---

## 🤝 Contributing

Contributions, bug reports, feature suggestions, and documentation improvements are welcome.

### Contribution Workflow

1. Fork the repository.
2. Create a feature branch.
3. Make your changes and test the affected workflows.
4. Commit your changes with a descriptive message.
5. Push the branch to your fork.
6. Open a pull request describing the changes and their impact.

Example:

```bash
git checkout -b feature/asset-filtering
git add .
git commit -m "feat: add asset filtering"
git push origin feature/asset-filtering
```

Please avoid committing secrets, generated dependencies, or unrelated formatting changes. For substantial changes, open an issue first to discuss the proposed design.

---

## 🗺️ Roadmap

Potential future improvements include:

- [ ] Advanced asset search, filtering, and sorting.
- [ ] Richer 3D preview controls and supported file-format documentation.
- [ ] Creator dashboards with sales and asset analytics.
- [ ] Asset reviews and ratings.
- [ ] Automated testing and continuous integration.
- [ ] Production-grade payment reconciliation and webhook handling.
- [ ] Secure object storage and expiring download links.
- [ ] Deployment documentation and a public demo.
- [ ] Accessibility and performance improvements.

This roadmap describes possible future work; it does not imply that every item is currently implemented.

---

## 📄 License

No license has been specified yet.

Before publishing PolyVault as an open-source project, add a `LICENSE` file and choose a license that matches your intentions.

For example, the MIT License permits broad reuse with attribution. Other licenses may better suit projects requiring different conditions.

Until a license is added, do not assume that the public availability of the repository grants permission to reuse its code.

---

## 👨‍💻 Author

**Project:** PolyVault — 3D Asset Marketplace for Creators

**Author:** `Saikat Hazra (CYCLONE)`

- GitHub: `https://github.com/Saikat-Hazra`
- LinkedIn: `https://www.linkedin.com/in/saikat-hazra-7836a3364`


---

## ⭐ Support the Project

If you find PolyVault interesting, consider starring the repository, reporting issues, or contributing improvements.

PolyVault aims to make discovering, previewing, and purchasing digital 3D assets a more accessible experience for creators and developers.

**Built for the 3D creator community.**
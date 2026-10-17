# CarryMate ✈

**Shop the world, carried by travelers.** A peer-to-peer marketplace where
travelers list upcoming trips and shoppers get products carried from abroad —
with escrow payments, traveler verification, and customs made clear.

Someone is already flying from India to the USA. Why not have them bring
your sneakers, iPhone, or perfume — for a commission? CarryMate works for
domestic routes too.

## How it works

1. **Match** — Travelers list trips (Hyderabad → New York…); shoppers post
   product requests. The shopper proposes a deal on a trip: product price +
   traveler commission.
2. **Pay safely** — The shopper pays the total into platform **escrow hold**.
   The traveler only gets paid after delivery is confirmed.
3. **Fly & deliver** — The traveler buys abroad, files a **customs
   declaration** (the platform shows an estimated duty), carries it home,
   and hands it over. The shopper confirms → money is released.

Trust comes from traveler identity verification + post-deal ratings.
Compliance comes from an explicit customs declaration step — duty figures
are **estimates for planning only**, and travelers must declare truthfully.

## Repo layout

```
carrymate/
├── backend/            # Spring Boot 3 / Java 17 API
│   ├── src/main/java/com/carrymate
│   │   ├── controller/ # Auth, Trip, Request, Deal, Payment, Customs, Review, Verification
│   │   ├── service/    # Deal state machine, escrow, DutyEstimator, seed data
│   │   ├── model/      # JPA entities
│   │   ├── payment/    # PaymentGateway interface + MockGatewayImpl
│   │   └── security/   # JWT (HMAC-SHA256) filter, BCrypt auth
│   ├── Dockerfile      # multi-stage build
│   ├── README.md
│   └── DEPLOY.md       # docker run recipe
└── frontend/           # React 18 + Vite + TypeScript, plain CSS
    └── src/
        ├── pages/      # Home, BrowseTrips/Requests, details, NewTrip/Request,
        │               # DealDetail, Dashboard, Login, Register, Profile
        ├── auth/       # AuthContext (token, 401 → logout)
        └── api.ts      # typed API client
```

## Run locally

**Backend** (needs `AUTH_JWT_SECRET`):

```bash
cd backend
AUTH_JWT_SECRET=dev-secret-change-me mvn spring-boot:run
# → http://localhost:8080
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

**Demo logins** (password `demo1234`, seeded on first start):

| Email | Role |
|---|---|
| `priya@example.com` | Verified traveler — 2 trips, 1 deal in transit |
| `arjun@example.com` | Shopper — 3 product requests |

Set `APP_DEMO_SEED=false` to skip demo data.

## API overview

All endpoints except `/api/auth/**` require `Authorization: Bearer <token>`.

| Area | Key endpoints |
|---|---|
| Auth | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` |
| Trips | `GET /api/trips/search?from=&to=&date=`, CRUD `/api/trips` |
| Requests | `GET /api/requests/search?buyCountry=&category=&q=`, CRUD `/api/requests` |
| Deals | `POST /api/deals` (propose), `…/{id}/accept`, `…/decline`, `…/status` (traveler: PURCHASED→IN_TRANSIT→DELIVERED), `…/confirm` (shopper), `…/cancel` |
| Payments | `POST /api/payments/hold` (escrow); release/refund driven by deal confirm/cancel |
| Customs | `POST /api/customs` (returns estimated duty), `…/{id}/confirm` |
| Reviews | `POST /api/reviews` (after CONFIRMED), `GET /api/users/{id}/reviews` |
| Verification | `POST /api/verification/request`, `…/{id}/approve`, `…/{id}/reject` |

### Deal state machine

```
PROPOSED → ACCEPTED → PURCHASED → IN_TRANSIT → DELIVERED → CONFIRMED
   (shopper)  (traveler)  (traveler*)   (traveler)   (traveler)  (shopper)
                          * requires payment HELD in escrow
```

Payment: **HELD** on shopper pay → **RELEASED** on delivery confirm →
**REFUNDED** on cancel.

## Money & compliance notes

- **Payments are mocked in v1.** `MockGatewayImpl` logs instead of moving
  money. To go live, implement `PaymentGateway` with Razorpay/Stripe
  (hold = authorize, release = transfer to traveler, refund = refund to
  shopper) and mark it `@Primary`.
- **Duty figures are estimates**, from a static country × category table
  in `DutyEstimator`. Real duty depends on HS codes and the assessing
  officer — the UI labels every figure ESTIMATE.
- **Verification approve/reject endpoints are open in v1** (no admin
  roles yet) — restrict them before any production use.

## Deploy

See [`backend/DEPLOY.md`](backend/DEPLOY.md) for the Docker recipe
(image build, `AUTH_JWT_SECRET`, H2 volume, CORS). Build the frontend
with `VITE_API_URL=https://<your-backend-url>` for production.

## Roadmap

- Real payment gateway (Razorpay for INR) + platform fee split
- Admin role + real document verification flow
- In-app chat between traveler and shopper
- Duty calculator backed by real tariff data
- Push notifications for deal events
- Dispute resolution flow (DISPUTED status exists in the model)

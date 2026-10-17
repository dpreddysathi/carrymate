# CarryMate backend

Spring Boot 3 / Java 17 API for the CarryMate traveler-courier marketplace.

## Run locally

```bash
cd backend
AUTH_JWT_SECRET=dev-secret-change-me mvn spring-boot:run
```

The API listens on `http://localhost:8080`. Demo data is seeded on first
start (see `DemoDataSeeder`): log in with `priya@example.com / demo1234`
(traveler) or `arjun@example.com / demo1234` (shopper).

Set `app.demo-seed=false` (env `APP_DEMO_SEED=false`) to skip seeding.

## API overview

All endpoints except `/api/auth/**` need `Authorization: Bearer <token>`.

| Area | Endpoints |
|---|---|
| Auth | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` |
| Trips | `GET /api/trips/search?from=&to=&date=`, `GET /api/trips/mine`, CRUD `/api/trips` |
| Requests | `GET /api/requests/search?buyCountry=&category=&q=`, `GET /api/requests/mine`, CRUD `/api/requests` |
| Deals | `POST /api/deals`, `GET /api/deals`, `GET /api/deals/{id}`, `POST /api/deals/{id}/accept\|decline\|confirm\|cancel`, `POST /api/deals/{id}/status` |
| Payments | `POST /api/payments/hold`, `GET /api/payments/deal/{dealId}` |
| Customs | `POST /api/customs`, `POST /api/customs/{id}/confirm`, `GET /api/customs/deal/{dealId}` |
| Reviews | `POST /api/reviews`, `GET /api/users/{id}`, `GET /api/users/{id}/reviews` |
| Verification | `POST /api/verification/request`, `GET /api/verification/mine`, `POST /api/verification/{id}/approve\|reject` |

Deal flow: `PROPOSED → ACCEPTED → PURCHASED → IN_TRANSIT → DELIVERED → CONFIRMED`.
Payment must be HELD before the traveler marks PURCHASED; it is RELEASED
on shopper confirmation and REFUNDED on cancel. The duty figure on
customs declarations is an ESTIMATE for planning only.

## Money

`PaymentGateway` has one implementation in v1: `MockGatewayImpl`, which
logs instead of moving money. Implement the interface with Razorpay /
Stripe and mark it `@Primary` to go live.

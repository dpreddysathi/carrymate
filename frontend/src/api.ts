import type {
  AuthResponse,
  AuthUser,
  Customs,
  CustomsInput,
  Deal,
  DealProposeInput,
  DealStatus,
  LoginInput,
  Payment,
  ProductRequest,
  RegisterInput,
  RequestInput,
  Review,
  ReviewInput,
  Trip,
  TripInput,
  User,
  Verification,
  VerificationInput,
} from './types';

/**
 * Base URL of the Spring Boot backend.
 * Overridden at build time for production, e.g.:
 *   VITE_API_URL=https://your-backend.example.com npm run build
 */
const BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ??
  'http://localhost:8080';

// ---- Auth token ----

const TOKEN_KEY = 'carrymate-auth-token';

let authToken: string | null = null;
try {
  authToken = localStorage.getItem(TOKEN_KEY);
} catch {
  /* private mode etc. */
}

export function getAuthToken(): string | null {
  return authToken;
}

export function setAuthToken(token: string | null): void {
  authToken = token;
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

/**
 * Called when the backend answers 401 (bad/expired token). The auth
 * provider registers a handler that logs the user out and sends them
 * back to the login page.
 */
let onUnauthorized: () => void = () => {};
export function setOnUnauthorized(fn: () => void): void {
  onUnauthorized = fn;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: { ...headers, ...(init?.headers ?? {}) },
  });
  if (res.status === 401 && !path.startsWith('/api/auth/')) {
    onUnauthorized();
    throw new Error('Session expired — please log in again.');
  }
  if (!res.ok) {
    let detail = '';
    try {
      detail = await res.text();
    } catch {
      /* ignore */
    }
    try {
      const parsed = JSON.parse(detail) as { error?: string };
      if (parsed?.error) detail = parsed.error;
    } catch {
      /* keep raw text */
    }
    throw new Error(
      `API ${res.status} ${res.statusText}${detail ? ` — ${detail}` : ''}`,
    );
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

const get = <T,>(path: string) => request<T>(path);
const post = <T,>(path: string, body: unknown) =>
  request<T>(path, { method: 'POST', body: JSON.stringify(body) });
const put = <T,>(path: string, body: unknown) =>
  request<T>(path, { method: 'PUT', body: JSON.stringify(body) });
const del = (path: string) => request<void>(path, { method: 'DELETE' });

function query(
  params: Record<string, string | number | boolean | undefined>,
): string {
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== '') usp.set(k, String(v));
  }
  const s = usp.toString();
  return s ? `?${s}` : '';
}

export const api = {
  // ---- Auth (public) ----
  register: (data: RegisterInput) =>
    post<AuthResponse>('/api/auth/register', data),
  login: (data: LoginInput) => post<AuthResponse>('/api/auth/login', data),
  me: () => get<AuthUser>('/api/auth/me'),

  // ---- Trips ----
  searchTrips: (params?: { from?: string; to?: string; date?: string }) =>
    get<Trip[]>(`/api/trips/search${query(params ?? {})}`),
  myTrips: () => get<Trip[]>('/api/trips/mine'),
  getTrip: (id: number) => get<Trip>(`/api/trips/${id}`),
  createTrip: (data: TripInput) => post<Trip>('/api/trips', data),
  updateTrip: (id: number, data: TripInput) =>
    put<Trip>(`/api/trips/${id}`, data),
  cancelTrip: (id: number) => del(`/api/trips/${id}`),

  // ---- Product requests ----
  searchRequests: (params?: {
    buyCountry?: string;
    category?: string;
    q?: string;
  }) => get<ProductRequest[]>(`/api/requests/search${query(params ?? {})}`),
  myRequests: () => get<ProductRequest[]>('/api/requests/mine'),
  getRequest: (id: number) => get<ProductRequest>(`/api/requests/${id}`),
  createRequest: (data: RequestInput) =>
    post<ProductRequest>('/api/requests', data),
  updateRequest: (id: number, data: RequestInput) =>
    put<ProductRequest>(`/api/requests/${id}`, data),
  cancelRequest: (id: number) => del(`/api/requests/${id}`),

  // ---- Deals ----
  myDeals: () => get<Deal[]>('/api/deals'),
  getDeal: (id: number) => get<Deal>(`/api/deals/${id}`),
  proposeDeal: (data: DealProposeInput) => post<Deal>('/api/deals', data),
  acceptDeal: (id: number) => post<Deal>(`/api/deals/${id}/accept`, {}),
  declineDeal: (id: number) => post<Deal>(`/api/deals/${id}/decline`, {}),
  advanceDeal: (id: number, to: DealStatus) =>
    post<Deal>(`/api/deals/${id}/status`, { to }),
  confirmDeal: (id: number) => post<Deal>(`/api/deals/${id}/confirm`, {}),
  cancelDeal: (id: number) => post<Deal>(`/api/deals/${id}/cancel`, {}),

  // ---- Payments ----
  holdPayment: (dealId: number) =>
    post<Payment>('/api/payments/hold', { dealId }),
  paymentForDeal: (dealId: number) =>
    get<Payment>(`/api/payments/deal/${dealId}`),

  // ---- Customs ----
  declareCustoms: (data: CustomsInput) =>
    post<Customs>('/api/customs', data),
  confirmCustoms: (id: number) =>
    post<Customs>(`/api/customs/${id}/confirm`, {}),
  customsForDeal: (dealId: number) =>
    get<Customs>(`/api/customs/deal/${dealId}`),

  // ---- Reviews & users ----
  createReview: (data: ReviewInput) => post<Review>('/api/reviews', data),
  getUser: (id: number) => get<User>(`/api/users/${id}`),
  userReviews: (id: number) => get<Review[]>(`/api/users/${id}/reviews`),

  // ---- Verification ----
  requestVerification: (data: VerificationInput) =>
    post<Verification>('/api/verification/request', data),
  myVerifications: () => get<Verification[]>('/api/verification/mine'),
};

export { BASE_URL };

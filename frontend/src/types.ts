/** Shared shapes between the CarryMate API and the UI. */

export type VerificationStatus = 'NONE' | 'PENDING' | 'VERIFIED' | 'REJECTED';
export type TripStatus = 'OPEN' | 'FULL' | 'COMPLETED' | 'CANCELLED';
export type RequestStatus = 'OPEN' | 'MATCHED' | 'CLOSED' | 'CANCELLED';
export type DealStatus =
  | 'PROPOSED'
  | 'ACCEPTED'
  | 'PURCHASED'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'DISPUTED';
export type PaymentStatus = 'HELD' | 'RELEASED' | 'REFUNDED';
export type DocType = 'PASSPORT' | 'AADHAAR' | 'DRIVING_LICENSE';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse extends AuthUser {
  token: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  travelerVerified: boolean;
  verificationStatus: VerificationStatus;
  ratingAvg: number;
  ratingCount: number;
}

export interface Trip {
  id: number;
  traveler: User;
  fromCountry: string;
  fromCity: string | null;
  toCountry: string;
  toCity: string | null;
  departureDate: string;
  arrivalDate: string | null;
  availableKg: number | null;
  categories: string | null;
  commissionPct: number | null;
  status: TripStatus;
}

export interface TripInput {
  fromCountry: string;
  fromCity?: string;
  toCountry: string;
  toCity?: string;
  departureDate: string;
  arrivalDate?: string;
  availableKg?: number;
  categories?: string;
  commissionPct?: number;
}

export interface ProductRequest {
  id: number;
  shopper: User;
  productName: string;
  description: string | null;
  buyCountry: string;
  buyCity: string | null;
  maxPrice: number;
  currency: string;
  quantity: number;
  category: string;
  deliverCity: string | null;
  deliverCountry: string | null;
  imageUrl: string | null;
  status: RequestStatus;
}

export interface RequestInput {
  productName: string;
  description?: string;
  buyCountry: string;
  buyCity?: string;
  maxPrice: number;
  currency?: string;
  quantity?: number;
  category?: string;
  deliverCity?: string;
  deliverCountry?: string;
  imageUrl?: string;
}

export interface DealEvent {
  status: DealStatus;
  at: string;
  note: string | null;
}

export interface Payment {
  id: number;
  amount: number;
  currency: string;
  status: PaymentStatus;
  gatewayRef: string;
}

export interface Deal {
  id: number;
  trip: Trip;
  productRequest: ProductRequest;
  traveler: User;
  shopper: User;
  agreedProductPrice: number;
  commissionAmount: number;
  totalAmount: number;
  currency: string;
  status: DealStatus;
  events: DealEvent[];
  payment: Payment | null;
  createdAt: string;
  updatedAt: string;
}

export interface DealProposeInput {
  tripId: number;
  requestId: number;
  agreedProductPrice: number;
  commissionAmount: number;
  currency?: string;
}

export interface Customs {
  id: number;
  dealId: number;
  itemsDescription: string;
  declaredValue: number;
  currency: string;
  /** ESTIMATE for planning — not the real duty. */
  estimatedDuty: number;
  estimateRate: number;
  travelerConfirmed: boolean;
}

export interface CustomsInput {
  dealId: number;
  itemsDescription: string;
  declaredValue: number;
  currency?: string;
}

export interface Review {
  id: number;
  dealId: number;
  reviewer: User;
  reviewee: User;
  rating: number;
  comment: string | null;
}

export interface ReviewInput {
  dealId: number;
  rating: number;
  comment?: string;
}

export interface Verification {
  id: number;
  userId: number;
  docType: DocType;
  docReference: string | null;
  status: VerificationStatus;
}

export interface VerificationInput {
  docType: DocType;
  docReference?: string;
}

export const CATEGORIES = [
  'electronics',
  'fashion',
  'perfume',
  'other',
] as const;

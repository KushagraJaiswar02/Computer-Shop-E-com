import { CartItem, CustomerAddress, HardwareEnquiry, Order } from '../../types';

export interface AccountUser { id: string; name: string; email: string; phone: string; role: 'customer' | 'admin'; }
export type ProfileInput = Pick<AccountUser, 'name' | 'email' | 'phone'>;
export interface LoginInput { email: string; password: string; }
export interface RegisterInput extends ProfileInput { password: string; }
export interface PasswordInput { currentPassword: string; newPassword: string; confirmPassword: string; }
export interface AccountBasket { cart: CartItem[]; wishlist: string[]; }
export type AccountOrderStatus = 'Placed' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
export interface AccountOrder {
  id: string;
  userId: string;
  number: string;
  date: string;
  total: number;
  status: AccountOrderStatus;
  items: Order['items'];
  timeline: { status: AccountOrderStatus; at?: string }[];
  invoiceUrl?: string;
  isMock: boolean;
}
export type RequestInput = Omit<HardwareEnquiry, 'id' | 'createdAt' | 'status'>;
export interface ProductRequest {
  id: string;
  userId: string | null;
  createdAt: string;
  message: string;
  status: 'Received' | 'Searching' | 'Available' | 'Unavailable';
  isMock: boolean;
}
export type AddressInput = Omit<CustomerAddress, 'id'>;
// Display metadata only. Never accept a full card number, CVV, or payment credential.
export interface CardDetails { id: string; cardholder: string; network: string; last4: string; expiry: string; isDefault: boolean; }
export type CardDetailsInput = Omit<CardDetails, 'id'>;
export interface CardsService {
  list(): Promise<CardDetails[]>;
  add(input: CardDetailsInput): Promise<CardDetails>;
  update(id: string, input: CardDetailsInput): Promise<CardDetails>;
  delete(id: string): Promise<void>;
  setDefault(id: string): Promise<void>;
}
export interface AuthService {
  register(input: RegisterInput): Promise<AccountUser>;
  login(input: LoginInput): Promise<AccountUser>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<AccountUser | null>;
  updateProfile(input: ProfileInput): Promise<AccountUser>;
  changePassword(input: PasswordInput): Promise<void>;
}
export interface OrdersService {
  listOrders(): Promise<AccountOrder[]>;
  getOrder(id: string): Promise<AccountOrder>;
  captureLocalOrder(order: Order): Promise<void>;
}
export interface RequestsService {
  listProductRequests(): Promise<ProductRequest[]>;
  submitProductRequest(input: RequestInput): Promise<ProductRequest>;
}
export interface AddressesService {
  list(): Promise<CustomerAddress[]>;
  add(input: AddressInput): Promise<CustomerAddress>;
  update(id: string, input: AddressInput): Promise<CustomerAddress>;
  delete(id: string): Promise<void>;
  setDefault(id: string): Promise<void>;
}
export interface BasketService {
  get(pendingGuest?: AccountBasket): Promise<AccountBasket>;
  mergeGuestIntoAccount(guest: AccountBasket, mergeToken: string): Promise<AccountBasket>;
  save(userId: string, basket: AccountBasket): Promise<void>;
}
export interface AccountServices { auth: AuthService; orders: OrdersService; requests: RequestsService; addresses: AddressesService; cards: CardsService; basket: BasketService; }

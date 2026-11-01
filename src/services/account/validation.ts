import { accountConfig } from '../../config/account';
import { AddressInput, CardDetailsInput, LoginInput, PasswordInput, ProfileInput, RegisterInput } from './contracts';

export type FieldErrors = Record<string, string>;
export const normalizeEmail = (email: string) => email.trim().toLowerCase();
export const validPhone = (phone: string) => /^[+\d\s().-]+$/.test(phone) && phone.replace(/\D/g, '').length >= 7 && phone.replace(/\D/g, '').length <= 15;
export function validateProfile(input: ProfileInput): FieldErrors {
  const errors: FieldErrors = {};
  if (input.name.trim().length < 2 || input.name.trim().length > 80) errors.name = 'Enter a name between 2 and 80 characters.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(input.email))) errors.email = 'Enter a valid email address.';
  if (!validPhone(input.phone)) errors.phone = 'Enter a valid phone number, including a country code if needed.';
  return errors;
}
export function validateLogin(input: LoginInput): FieldErrors {
  return { ...(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(input.email)) ? { email: 'Enter a valid email address.' } : {}), ...(!input.password ? { password: 'Enter your password.' } : {}) };
}
export function validateRegistration(input: RegisterInput, confirmPassword?: string): FieldErrors {
  const errors = validateProfile(input);
  if (input.password.length < accountConfig.PASSWORD_MIN_LENGTH) errors.password = `Use at least ${accountConfig.PASSWORD_MIN_LENGTH} characters.`;
  if (confirmPassword !== undefined && input.password !== confirmPassword) errors.confirmPassword = 'Passwords do not match.';
  return errors;
}
export function validatePassword(input: PasswordInput): FieldErrors {
  const errors: FieldErrors = {};
  if (!input.currentPassword) errors.currentPassword = 'Enter your current password.';
  if (input.newPassword.length < accountConfig.PASSWORD_MIN_LENGTH) errors.newPassword = `Use at least ${accountConfig.PASSWORD_MIN_LENGTH} characters.`;
  if (input.currentPassword === input.newPassword) errors.newPassword = 'Choose a different password.';
  if (input.newPassword !== input.confirmPassword) errors.confirmPassword = 'Passwords do not match.';
  return errors;
}
export function validateAddress(input: AddressInput): FieldErrors {
  const errors: FieldErrors = {};
  for (const key of ['fullName', 'street', 'city', 'state'] as const) if (!input[key].trim()) errors[key] = 'This field is required.';
  if (!validPhone(input.phone)) errors.phone = 'Enter a valid phone number.';
  if (!/^[A-Za-z0-9 -]{3,12}$/.test(input.postalCode.trim())) errors.postalCode = 'Enter a valid postal code.';
  return errors;
}
export function requireValid(errors: FieldErrors) { const first = Object.values(errors)[0]; if (first) throw new Error(first); }
export function validateCardDetails(input: CardDetailsInput): FieldErrors {
  const errors: FieldErrors = {};
  if (input.cardholder.trim().length < 2 || input.cardholder.trim().length > 80) errors.cardholder = 'Enter a cardholder name between 2 and 80 characters.';
  if (!accountConfig.CARD_NETWORKS.includes(input.network)) errors.network = 'Choose a card network.';
  if (!/^\d{4}$/.test(input.last4)) errors.last4 = 'Enter only the last 4 digits.';
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(input.expiry)) errors.expiry = 'Use MM/YY, for example 12/29.';
  else {
    const [month, year] = input.expiry.split('/').map(Number);
    if (new Date(2000 + year, month, 1).getTime() <= Date.now()) errors.expiry = 'Enter a future expiry date.';
  }
  return errors;
}
export const errorMessage = (error: unknown) => error instanceof Error ? error.message : 'Something went wrong. Please try again.';
export function safeReturnTo(value: string | null | undefined) {
  if (!value || !value.startsWith('/') || value.startsWith('//') || /[\\\u0000-\u001f]/.test(value) || /^\/(?:login|register)(?:[/?#]|$)|^\/auth\//i.test(value)) return '/account';
  return value;
}

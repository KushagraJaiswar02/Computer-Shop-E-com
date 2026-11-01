// NOT SECURE: this mock stores passwords and sessions in localStorage. Replace it
// with a real backend and secure server-managed sessions before launch.
// The backend must check roles on every endpoint, hash passwords, rate-limit login,
// protect against CSRF/XSS, scan uploads, keep backups and server-side audit logs,
// and support optional admin 2FA.
// The backend must check roles on every endpoint, hash passwords, rate-limit login,
// protect against CSRF/XSS, scan uploads, keep backups and server-side audit logs,
// and support optional admin 2FA.
import { AuthService } from './contracts';
import { delay, newId, publicUser, readDatabase, withUser, writeDatabase } from './mockStorage';
import { normalizeEmail, requireValid, validateLogin, validatePassword, validateProfile, validateRegistration } from './validation';

export const mockAuthService: AuthService = {
  async register(input) {
    requireValid(validateRegistration(input));
    await delay();
    const db = readDatabase(), email = normalizeEmail(input.email);
    if (db.users.some(user => user.email === email)) throw new Error('An account with that email already exists.');
    const user = { id: newId('user'), name: input.name.trim(), email, phone: input.phone.trim(), password: input.password, role: 'customer' as const };
    db.users.push(user); db.sessionId = user.id; db.sessionNeedsMerge = true; writeDatabase(db);
    return publicUser(user);
  },
  async login(input) {
    requireValid(validateLogin(input));
    await delay();
    const db = readDatabase(), user = db.users.find(user => user.email === normalizeEmail(input.email) && user.password === input.password);
    if (!user) throw new Error('The email or password is incorrect.');
    db.sessionId = user.id; db.sessionNeedsMerge = true; writeDatabase(db); return publicUser(user);
  },
  async logout() { await delay(); const db = readDatabase(); db.sessionId = null; db.sessionNeedsMerge = false; writeDatabase(db); },
  async getCurrentUser() { await delay(); const db = readDatabase(), user = db.users.find(user => user.id === db.sessionId); return user ? publicUser(user) : null; },
  updateProfile(input) {
    requireValid(validateProfile(input));
    return withUser((db, user) => {
      const email = normalizeEmail(input.email);
      if (db.users.some(other => other.id !== user.id && other.email === email)) throw new Error('That email is already used by another account.');
      user.name = input.name.trim(); user.email = email; user.phone = input.phone.trim();
      return publicUser(user);
    }, true);
  },
  changePassword(input) {
    requireValid(validatePassword(input));
    return withUser((_db, user) => { if (user.password !== input.currentPassword) throw new Error('Your current password is incorrect.'); user.password = input.newPassword; }, true);
  },
};

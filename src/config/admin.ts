/// <reference types="vite/client" />
// REMOVE DEMO MODE AND THIS SEEDED ACCOUNT BEFORE LAUNCH.
// Real admin accounts must be provisioned server-side, never by public signup.
export const adminConfig = {
  DEMO_MODE: import.meta.env.DEV,
  // Retained public preview override. Production builds require account role checks.
  PUBLIC_DEMO_ACCESS: import.meta.env.DEV,
  DEMO_ADMIN: { id: 'mock-demo-admin', name: 'Demo Shop Owner', email: 'admin@example.test', phone: '+91 90000 00000', password: 'DemoAdmin123!', role: 'admin' as const },
};

export const accountConfig = {
  SHOW_ADDRESSES: true,
  SHOW_CARD_DETAILS: true,
  CARD_NETWORKS: ['Visa', 'Mastercard', 'RuPay', 'American Express', 'Other'],
  ORDER_MODE: 'orders' as 'orders' | 'enquiries',
  ENABLE_DEMO_SEED: true,
  SHOW_MOCK_NOTICE: true,
  MOCK_LATENCY_MS: 240,
  STORAGE_KEY: 'compshop_mock_accounts_v1',
  PASSWORD_MIN_LENGTH: 8,
  MOBILE_QUERY: '(max-width: 767px)',
  DEMO_USER: {
    id: 'mock-demo-customer',
    name: 'Demo Customer',
    email: 'demo@example.test',
    phone: '+1 202 555 0100',
    password: 'DemoPass123!',
  },
};

export const accountLabels = () => accountConfig.ORDER_MODE === 'enquiries'
  ? { plural: 'Enquiries', singular: 'Enquiry', lower: 'enquiry' }
  : { plural: 'Orders', singular: 'Order', lower: 'order' };

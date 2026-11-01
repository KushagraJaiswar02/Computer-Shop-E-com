import { AccountServices } from './contracts';
import { mockAuthService } from './mockAuth';
import { mockOrdersService } from './mockOrders';
import { mockRequestsService } from './mockRequests';
import { mockAddressesService } from './mockAddresses';
import { mockBasketService } from './mockBasket';
import { mockCardsService } from './mockCards';

// Swap this adapter object for HTTP implementations; hooks and pages keep their contracts.
export const accountServices: AccountServices = {
  auth: mockAuthService,
  orders: mockOrdersService,
  requests: mockRequestsService,
  addresses: mockAddressesService,
  cards: mockCardsService,
  basket: mockBasketService,
};

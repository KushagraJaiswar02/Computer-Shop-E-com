import { makeDemoCatalog } from '../../demo/catalog';
import { createDemoAccountRecords } from '../../demo/accounts';
import { INITIAL_BRANDS, INITIAL_CATEGORIES, INITIAL_PRODUCTS } from '../../data/mockData';

// Disable ENABLE_DEMO_SEED to omit these fixtures from new databases.
// Existing fixtures can be removed with removeDemoSeed(); all IDs are prefixed "mock-".
export function createDemoRecords() {
  return createDemoAccountRecords(makeDemoCatalog(INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_BRANDS).products);
}

import { AddressesService } from './contracts';
import { newId, withUser } from './mockStorage';
import { requireValid, validateAddress } from './validation';

export const mockAddressesService: AddressesService = {
  list: () => withUser((db, user) => db.addresses.filter(address => address.userId === user.id)),
  add(input) {
    requireValid(validateAddress(input));
    return withUser((db, user) => {
      const own = db.addresses.filter(address => address.userId === user.id);
      const address = { ...input, id: newId('address'), userId: user.id, isDefault: own.length === 0 || input.isDefault };
      if (address.isDefault) own.forEach(item => { item.isDefault = false; });
      db.addresses.push(address); return address;
    }, true);
  },
  update(id, input) {
    requireValid(validateAddress(input));
    return withUser((db, user) => {
      const address = db.addresses.find(address => address.id === id && address.userId === user.id);
      if (!address) throw new Error('Address not found.');
      const own = db.addresses.filter(address => address.userId === user.id);
      const wasDefault = address.isDefault;
      Object.assign(address, input, { id, userId: user.id });
      if (address.isDefault) own.forEach(item => { if (item.id !== id) item.isDefault = false; });
      else if (wasDefault) (own.find(item => item.id !== id) || address).isDefault = true;
      return address;
    }, true);
  },
  delete: id => withUser((db, user) => {
    if (!db.addresses.some(address => address.id === id && address.userId === user.id)) throw new Error('Address not found.');
    db.addresses = db.addresses.filter(address => address.id !== id || address.userId !== user.id);
    const own = db.addresses.filter(address => address.userId === user.id);
    if (own.length && !own.some(address => address.isDefault)) own[0].isDefault = true;
  }, true),
  setDefault: id => withUser((db, user) => {
    const own = db.addresses.filter(address => address.userId === user.id);
    if (!own.some(address => address.id === id)) throw new Error('Address not found.');
    own.forEach(address => { address.isDefault = address.id === id; });
  }, true),
};

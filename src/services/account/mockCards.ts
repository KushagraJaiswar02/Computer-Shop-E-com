// Mock display references only. Real saved cards must come from a payment
// provider's tokenized vault; never add PAN/CVV fields to this local adapter.
import { CardDetailsInput, CardsService } from './contracts';
import { newId, withUser } from './mockStorage';
import { requireValid, validateCardDetails } from './validation';

// Explicitly allowlist fields so extra caller properties cannot persist credentials.
const metadata = (input: CardDetailsInput): CardDetailsInput => ({ cardholder: input.cardholder.trim(), network: input.network, last4: input.last4, expiry: input.expiry, isDefault: !!input.isDefault });
export const mockCardsService: CardsService = {
  list: () => withUser((db, user) => db.cards.filter(card => card.userId === user.id)),
  add(input) {
    requireValid(validateCardDetails(input));
    return withUser((db, user) => {
      const own = db.cards.filter(card => card.userId === user.id);
      const card = { ...metadata(input), id: newId('card'), userId: user.id, isDefault: own.length === 0 || !!input.isDefault };
      if (card.isDefault) own.forEach(item => { item.isDefault = false; });
      db.cards.push(card); return card;
    }, true);
  },
  update(id, input) {
    requireValid(validateCardDetails(input));
    return withUser((db, user) => {
      const card = db.cards.find(card => card.id === id && card.userId === user.id);
      if (!card) throw new Error('Card reference not found.');
      const own = db.cards.filter(card => card.userId === user.id), wasDefault = card.isDefault;
      Object.assign(card, metadata(input));
      if (card.isDefault) own.forEach(item => { if (item.id !== id) item.isDefault = false; });
      else if (wasDefault) (own.find(item => item.id !== id) || card).isDefault = true;
      return card;
    }, true);
  },
  delete: id => withUser((db, user) => {
    if (!db.cards.some(card => card.id === id && card.userId === user.id)) throw new Error('Card reference not found.');
    db.cards = db.cards.filter(card => card.id !== id || card.userId !== user.id);
    const own = db.cards.filter(card => card.userId === user.id);
    if (own.length && !own.some(card => card.isDefault)) own[0].isDefault = true;
  }, true),
  setDefault: id => withUser((db, user) => {
    const own = db.cards.filter(card => card.userId === user.id);
    if (!own.some(card => card.id === id)) throw new Error('Card reference not found.');
    own.forEach(card => { card.isDefault = card.id === id; });
  }, true),
};

import { RequestsService } from './contracts';
import { clone, delay, newId, readDatabase, writeDatabase, withUser } from './mockStorage';

export const mockRequestsService: RequestsService = {
  listProductRequests: () => withUser((db, user) => db.requests.filter(request => request.userId === user.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt))),
  async submitProductRequest(input) {
    if (!input.message.trim()) throw new Error('Describe the product you are looking for.');
    const owner = readDatabase().sessionId;
    await delay();
    const db = readDatabase();
    if (db.sessionId !== owner) throw new Error('Your account changed. Please submit the request again.');
    const request = { id: newId('request'), userId: owner, createdAt: new Date().toISOString(), message: input.message.trim(), status: 'Received' as const, isMock: true };
    db.requests.push(request); writeDatabase(db); return clone(request);
  },
};

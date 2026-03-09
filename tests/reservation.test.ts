import request from 'supertest';
import app from '../src/index';

describe('Ticket Reservation - Integration Tests', () => {
  it('Should retrieve the list of events with status 200', async () => {
    const res = await request(app).get('/api/events');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('Should return 400 if the ticket quantity is negative', async () => {
    const res = await request(app).post('/api/reservations').send({
      eventId: 1,
      userId: 1,
      quantity: -5,
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.status).toBe('error');
  });
});
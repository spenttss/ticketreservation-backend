import request from 'supertest';
import app from '../src/index';

describe('Global Error Handling and Edge Cases', () => {
  it('Should return 404 for a non-existent route', async () => {
    const res = await request(app).get('/api/ghost-route-123');

    expect(res.statusCode).toEqual(404);
  });

  it('Should correctly handle malformed JSON', async () => {
    const res = await request(app)
      .post('/api/reservations')
      .set('Content-Type', 'application/json')
      .send('{"eventId": 1, "userId": 1, "quantity": 2');

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('status');
    expect(res.body.status).toBe('error');
  });

  it('Should return an error when trying to reserve for a non-existent event', async () => {
    const res = await request(app).post('/api/reservations').send({
      eventId: 99999,
      userId: 1,
      quantity: 1,
    });

    expect(res.statusCode).toBeGreaterThanOrEqual(400);
    expect(res.body.status).toBe('error');
    expect(res.body).toHaveProperty('message');
  });
});
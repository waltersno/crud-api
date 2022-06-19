import request from 'supertest';
import { server } from '../server';

interface MockUser {
  username: string;
  hobbies: string[];
  id?: string;
  age?: number;
  city?: string;
}

const ropz: MockUser = {
  username: 'Ropz',
  hobbies: [],
};

const niko: MockUser = {
  username: 'Niko',
  age: 25,
  hobbies: ['reading'],
  city: 'London',
};

const users = [ropz, niko];

describe('third scenario', () => {
  test('post user without one property', async () => {
    const res = await request(server).post('/api/users').send(ropz);
    expect(res.statusCode).toBe(400);
  });

  test('post a user with extra data', async () => {
    const res = await request(server).post('/api/users').send(niko);
    expect(res.statusCode).toBe(400);
  });

  test('users should still be empty', async () => {
    const res = await request(server).get('/api/users');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('server should return 404 for non-existent field', async () => {
    const res = await request(server)
      .post('/some-non/existing/resource')
      .send(users);
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual('Non-existent endpoints');
  });

  server.close();
});

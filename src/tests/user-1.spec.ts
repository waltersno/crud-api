import request from 'supertest';
import { server } from '../server';

interface MockUser {
  username: string;
  age: number;
  hobbies: never[];
  id?: string;
}

const mockUser: MockUser = {
  username: 'Ropz',
  age: 19,
  hobbies: [],
};

const updatedUser = {
  username: 'Niko',
  age: 25,
  hobbies: ['reading'],
};

describe('first scenario', () => {
  test('get all users', async () => {
    const res = await request(server).get('/api/users');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('create a new user', async () => {
    const res = await request(server).post('/api/users').send(mockUser);
    expect(res.statusCode).toBe(201);
    expect(res.body).toMatchObject(mockUser);
    mockUser.id = res.body.id;
  });

  test('get user by id', async () => {
    const res = await request(server).get(`/api/users/${mockUser.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockUser);
  });

  test('update user', async () => {
    const res = await request(server)
      .put(`/api/users/${mockUser.id}`)
      .send(updatedUser);
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject(updatedUser);
  });

  test('delete user', async () => {
    const res = await request(server).delete(`/api/users/${mockUser.id}`);
    expect(res.statusCode).toBe(204);
  });

  test('get non-existent user', async () => {
    const res = await request(server).get(`/api/users/${mockUser.id}`);
    expect(res.statusCode).toBe(404);
  });
  server.close();
});

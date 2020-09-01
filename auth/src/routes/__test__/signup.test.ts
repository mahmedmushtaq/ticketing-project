import { app } from '../../app';
import request from 'supertest';

it('returns a 201 on successful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);
});

it('returns a 400 invalid email', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'testskdf',
      password: 'password',
    })
    .expect(400);
});

it('returns a 400 invalid password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'testskdf@gmail.com',
      password: 'pa',
    })
    .expect(400);
});

it('disallow duplicate tests', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'tests@gmail.com',
      password: 'password',
    })
    .expect(201);

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'tests@gmail.com',
      password: 'password',
    })
    .expect(400);
});

it('sets a cookie after successful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'tests@gmail.com',
      password: 'password',
    })
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
});

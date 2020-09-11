import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Order } from '../../models/order';
import mongoose from 'mongoose';

const buildTickets = async () => {
  const ticket = Ticket.build({
    title: 'Concert',
    price: 20,
    id: mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();
  return ticket;
};

it('fetches all orders', async () => {
  // save 3 tickets into the db
  const ticketOne = await buildTickets();
  const ticketTwo = await buildTickets();
  const ticketThree = await buildTickets();

  // create two users

  const userOne = global.signin();
  const userTwo = global.signin();

  // create one order for user#1

  await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201);

  // create 2 order for user#2

  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketTwo.id })
    .expect(201);

  const { body: orderTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketThree.id })
    .expect(201);

  // make request to get orders of the user2

  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwo)
    .send({})
    .expect(200);

  // make sure user2 order is retrieved only
  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(orderOne.id);
  expect(response.body[1].id).toEqual(orderTwo.id);
});

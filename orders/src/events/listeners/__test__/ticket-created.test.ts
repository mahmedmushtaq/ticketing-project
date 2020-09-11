import { TicketCreatedListener } from '../ticket-created-listener';
import { TicketCreatedEvent } from '@muab/common';
import mongoose from 'mongoose';
import { natsWrapper } from '../../../nats-wrapper';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  // create an instance of the listener
  const listener = new TicketCreatedListener(natsWrapper.client);
  // create a fake data event
  const data: TicketCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 22,
    userId: mongoose.Types.ObjectId().toHexString(),
    version: 0,
  };

  // create a fake message object

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('create and saves the ticket', async () => {
  const { listener, data, msg } = await setup();
  // call on message function with data and object params
  await listener.onMessage(data, msg);

  // create a fake message object
  const ticket = await Ticket.findById(data.id);
  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();
  // call on message function with data and object params
  await listener.onMessage(data, msg);

  // make sure ack is called

  expect(msg.ack).toHaveBeenCalled();
});

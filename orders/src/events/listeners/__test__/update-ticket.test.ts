import mongoose from 'mongoose';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketUpdatedListener } from '../ticket-updated-listener';
import { TicketUpdatedEvent } from '@muab/common';
import { Message } from 'node-nats-streaming';

const setup = async () => {
  const listener = await new TicketUpdatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: ' concert',
    price: 22,
  });

  await ticket.save();

  // create fake data objects

  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    version: ticket.version + 1, // 1 is added because ticket service version is 1 times greter than order ticket
    title: ticket.title,
    price: ticket.price,
    userId: '12slkdjf',
  };

  // create fake msg object

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket };
};

it('find, updates and save a ticket', async () => {
  const { msg, data, listener, ticket } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.version).toEqual(data.version);
});

it('does not called when version number is not in sequential order', async () => {
  const { listener, data, msg, ticket } = await setup();
  data.version = 10;
  try {
    await listener.onMessage(data, msg);
  } catch (err) {}

  expect(msg.ack).not.toHaveBeenCalled();
});

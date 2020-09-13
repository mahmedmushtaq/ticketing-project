import { OrderCreatedListener } from '../order-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';
import mongoose from 'mongoose';
import { OrderCreatedEvent, OrderStatus } from '@muab/common';
import { Message } from 'node-nats-streaming';

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);
  // create ticket instance

  const ticket = Ticket.build({
    userId: 'abc',
    title: 'concert',
    price: 22,
  });

  await ticket.save();

  // create fake data event which is coming from other services

  const data: OrderCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: 'asldkf',
    expiresAt: 'slkdjf',
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  // create fake message

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg };
};

it('set the userId of the ticket', async () => {
  const { listener, ticket, data, msg } = await setup();
  await listener.onMessage(data, msg);
  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.orderId).toEqual(data.id);
});

it('acks the message', async () => {
  const { listener, ticket, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('check published function is called', async () => {
  const { listener, ticket, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

// it('check order id is updated', async () => {
//   const { listener, ticket, data, msg } = await setup();
//   await listener.onMessage(data, msg);

//   const updatedTicket = JSON.parse(
//     (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
//   );

//   expect(data.id).toEqual(updatedTicket.orderId);
// });

it('publishes a ticket updated event', async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
 
  const ticketUpdatedData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[3][1]
  );

  expect(data.id).toEqual(ticketUpdatedData.orderId);
});

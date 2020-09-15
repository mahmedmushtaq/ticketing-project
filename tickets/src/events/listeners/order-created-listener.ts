import { Message } from 'node-nats-streaming';
import { Listener, Subjects, OrderCreatedEvent } from '@muab/common';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // find the ticket that order has been reserved
    const ticket = await Ticket.findById(data.ticket.id);
    // if no ticket throw error
    if (!ticket) {
      throw new Error('No ticket is found');
    }
    // Mark the ticket is reserved by setting orderId
    ticket.set({ orderId: data.id });
    // save the ticket
    await ticket.save();

    console.log('ticket updated publisher');

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
      orderId: ticket.orderId,
    });

    console.log('after ticket updated publisher');
    // ack the message
    msg.ack();
  }
}

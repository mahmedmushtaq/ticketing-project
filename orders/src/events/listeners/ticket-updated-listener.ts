import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketUpdatedEvent } from '@muab/common';
import { queryGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = queryGroupName;
  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    const { id, title, price } = data;

    const ticket = await Ticket.findByEvent(data);

    if (!ticket) {
      throw new Error('ticket is not found');
    }

    ticket.set({ title, price });

    await ticket.save();

    // acknowledge message is received
    msg.ack();
  }
}

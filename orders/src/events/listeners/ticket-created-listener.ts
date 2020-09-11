import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketCreatedEvent } from '@muab/common';
import { Ticket } from '../../models/ticket';
import { queryGroupName } from './queue-group-name';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = queryGroupName;
  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const { id,title, price } = data;

    const ticket = Ticket.build({
      id,
      title,
      price,
    });

    await ticket.save();

    // acknowledge message is received
    msg.ack();
  }
}

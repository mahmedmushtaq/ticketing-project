import { TicketUpdatedEvent, Publisher, Subjects } from '@muab/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}

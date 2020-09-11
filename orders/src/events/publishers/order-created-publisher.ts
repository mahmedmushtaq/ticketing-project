import { OrderCreatedEvent, Publisher, Subjects } from '@muab/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}

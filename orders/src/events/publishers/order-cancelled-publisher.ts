import { Subjects, Publisher, OrderCancelledEvent } from '@muab/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  
}

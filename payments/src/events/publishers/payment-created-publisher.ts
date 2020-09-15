import { Subjects, Publisher, PaymentCreatedEvent } from '@muab/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
    readonly subject = Subjects.PaymentCreated;
    
}


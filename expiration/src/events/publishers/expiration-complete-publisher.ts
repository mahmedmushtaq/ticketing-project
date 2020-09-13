import { Publisher, Subjects, ExpirationCompleteEvent } from '@muab/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
    readonly subject = Subjects.ExpirationComplete
}
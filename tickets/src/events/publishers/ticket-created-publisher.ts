import {TicketCreatedEvent,Publisher,Subjects} from "@muab/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    readonly subject = Subjects.TicketCreated;
    

}
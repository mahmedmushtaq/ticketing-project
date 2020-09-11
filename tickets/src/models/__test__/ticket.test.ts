import { Ticket } from '../ticket';

it('implement optimistic currency control', async (done) => {
  // create an instance of a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 22,
    userId: '123',
  });

  // save the ticket to the db

  await ticket.save();

  // fetch the ticket twice

  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // make two separate changes to the ticket

  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 5 });

  // save the first fetched ticket

  await firstInstance!.save();

  // again fetched version v
  const firstInstanceS = await Ticket.findById(ticket.id);
  console.log(firstInstanceS);
  // save the second fetched ticket and error will occur

  try {
    await secondInstance!.save();
  } catch (err) {
    return done();
  }
});

it('increment version number on multiple saves', async () => {
  const ticket = Ticket.build({
    title: 'convert',
    price: 30,
    userId: '134',
  });

  const ticket1 = Ticket.build({
    title: 'convert',
    price: 30,
    userId: '134',
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);
  // update record
  await ticket.save();
  expect(ticket.version).toEqual(1);
  // update record
  await ticket.save();
  expect(ticket.version).toEqual(2);
  // new record
  await ticket1.save();
  expect(ticket1.version).toEqual(0);
});

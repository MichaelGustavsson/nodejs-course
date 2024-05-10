import { v4 as uuid4 } from 'uuid';

export default class Transaction {
  constructor(amount, sender, recipient) {
    this.amount = amount;
    this.sender = sender;
    this.recipient = recipient;
    this.transactionId = uuid4().replaceAll('-', '');
    // this.id = uuid4().split('-').join('');
  }
}

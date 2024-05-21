import { it, describe, expect, beforeEach } from 'vitest';
import Wallet from '../models/Wallet.mjs';
import { verifySignature } from '../utilities/crypto-lib.mjs';
import Transaction from '../models/Transaction.mjs';

describe('Transaction', () => {
  let transaction, sender, recipient, amount;

  beforeEach(() => {
    sender = new Wallet();
    recipient = 'recipient-dummy-address';
    amount = 50;

    transaction = new Transaction({ sender, recipient, amount });
  });
});

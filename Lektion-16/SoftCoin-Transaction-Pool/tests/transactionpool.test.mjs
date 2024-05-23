import { it, describe, expect, beforeEach } from 'vitest';
import Transaction from '../models/Transaction.mjs';
import Wallet from '../models/Wallet.mjs';
import TransactionPool from '../models/TransactionPool.mjs';

describe('TransactionPool', () => {
  // sender = wallet...
  let transactionPool, transaction, sender;
  sender = new Wallet();

  beforeEach(() => {
    transaction = new Transaction({
      sender,
      recipient: 'Eva-Lena',
      amount: 50,
    });
    transactionPool = new TransactionPool();
  });

  describe('properties', () => {
    it('should have a property named transactionMap', () => {
      expect(transactionPool).toHaveProperty('transactionMap');
    });
  });

  describe('addTransaction()', () => {
    it('should add a transaction to the transaction pool', () => {
      transactionPool.addTransaction(transaction);

      expect(transactionPool.transactionMap[transaction.id]).toBe(transaction);
    });
  });

  describe('transactionExist()', () => {
    it('should return a transaction based on its address', () => {
      transactionPool.addTransaction(transaction);

      expect(
        transactionPool.transactionExist({ address: sender.publicKey })
      ).toBe(transaction);
    });
  });
});

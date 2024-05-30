import { it, describe, expect, beforeEach } from 'vitest';
import Transaction from '../models/Transaction.mjs';
import Wallet from '../models/Wallet.mjs';
import TransactionPool from '../models/TransactionPool.mjs';
import Blockchain from '../models/Blockchain.mjs';

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

  describe('validTransaction method', () => {
    let transactions;

    beforeEach(() => {
      transactions = [];

      for (let i = 0; i < 10; i++) {
        transaction = new Transaction({
          sender,
          recipient: 'Nils Nilsson',
          amount: 50,
        });

        // Fejka felaktiga transaktioner
        if (i % 3 === 0) {
          transaction.inputMap.amount = 1010;
        } else if (i % 3 === 1) {
          transaction.inputMap.signature = new Wallet().sign('baad!');
        } else {
          transactions.push(transaction);
        }

        transactionPool.addTransaction(transaction);
      }
    });

    it('should return valid transactions', () => {
      expect(transactionPool.validateTransactions()).toStrictEqual(
        transactions
      );
    });
  });

  // Detta är en farlig metod. Den tar inte hänsyn till om det finns transaktioner
  // som ännu inte är flyttade till ett block eller till blockkedjan...
  describe('clearTransaction method', () => {
    it('should clear the transactionPool', () => {
      transactionPool.clearTransactions();
      expect(transactionPool.transactionMap).toEqual({});
    });
  });

  // En säkrare metod som kontrollerar om blockkedjan är uppdaterad med transaktionen/transaktionerna...
  describe('clearBlockTransactions method', () => {
    it('should clear the pool of existing blockchain transactions', () => {
      const blockchain = new Blockchain();
      const expectedMap = {};

      // skapa fejk transaktioner...
      for (let i = 0; i < 20; i++) {
        const transaction = new Wallet().createTransaction({
          recipient: 'Nils',
          amount: 5,
        });

        transactionPool.addTransaction(transaction);

        if (i % 2 === 0) {
          blockchain.addBlock({ data: [transaction] });
        } else {
          expectedMap[transaction.id] = transaction;
        }
      }

      transactionPool.clearBlockTransactions({ chain: blockchain.chain });

      expect(transactionPool.transactionMap).toEqual(expectedMap);
    });
  });
});

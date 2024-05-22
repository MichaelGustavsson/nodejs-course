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

  describe('properties', () => {
    it('should have a property named id', () => {
      expect(transaction).toHaveProperty('id');
    });

    it('should have a property named outputMap', () => {
      expect(transaction).toHaveProperty('outputMap');
    });

    it('should have a property named inputMap', () => {
      expect(transaction).toHaveProperty('inputMap');
    });
  });

  describe('outputMap()', () => {
    it('should display the recipients balance', () => {
      expect(transaction.outputMap[recipient]).toEqual(amount);
    });

    it('should display the senders balance', () => {
      expect(transaction.outputMap[sender.publicKey]).toEqual(
        sender.balance - amount
      );
    });
  });

  describe('inputMap()', () => {
    it('should have a property named timestamp', () => {
      expect(transaction.inputMap).toHaveProperty('timestamp');
    });

    it('should set the amount to the senders balance', () => {
      expect(transaction.inputMap.amount).toEqual(sender.balance);
    });

    it('should set the address value to the senders publicKey', () => {
      expect(transaction.inputMap.address).toEqual(sender.publicKey);
    });

    it('should sign the input', () => {
      expect(
        verifySignature({
          publicKey: sender.publicKey,
          data: transaction.outputMap,
          signature: transaction.inputMap.signature,
        })
      ).toBe(true);
    });
  });

  describe('validate the transaction', () => {
    describe('when the transaction is valid', () => {
      it('should return true', () => {
        expect(Transaction.validate(transaction)).toBe(true);
      });
    });

    describe('when the transaction is invalid', () => {
      describe('and the transactions outputMap value is invalid', () => {
        it('should return false', () => {
          transaction.outputMap[sender.publicKey] = 99996699449393;
          expect(Transaction.validate(transaction)).toBe(false);
        });
      });
      describe('and the transactions inputMap signature is invalid', () => {
        it('should return false', () => {
          transaction.inputMap.signature = new Wallet().sign('Stendumt-gjort');
          expect(Transaction.validate(transaction)).toBe(false);
        });
      });
    });
  });
});

import { it, describe, expect, beforeEach } from 'vitest';
import Wallet from '../models/Wallet.mjs';
import { verifySignature } from '../utilities/crypto-lib.mjs';
import Transaction from '../models/Transaction.mjs';

describe('Wallet', () => {
  let wallet;

  beforeEach(() => {
    wallet = new Wallet();
  });

  describe('Properties', () => {
    it('should have a property named balance', () => {
      expect(wallet).toHaveProperty('balance');
    });

    it('should have a property named publicKey', () => {
      // console.log(wallet.publicKey);
      expect(wallet).toHaveProperty('publicKey');
    });
  });

  describe('Signing process', () => {
    let data = 'test';

    it('should verify a signature', () => {
      expect(
        verifySignature({
          publicKey: wallet.publicKey,
          data,
          signature: wallet.sign(data),
        })
      ).toBe(true);
    });

    it('should not verify an invalid signature', () => {
      expect(
        verifySignature({
          publicKey: wallet.publicKey,
          data,
          signature: new Wallet().sign(data),
        })
      ).toBe(false);
    });
  });

  describe('Create transaction', () => {
    describe('and the amount is larger than the balance', () => {
      it('should throw an error', () => {
        expect(() =>
          wallet.createTransaction({ amount: 898989, recipient: 'Darth Vader' })
        ).toThrow('Not enough funds!');
      });
    });
    describe('and the amount is valid', () => {
      let transaction, amount, recipient;

      beforeEach(() => {
        amount = 25;
        recipient = 'Michael';
        transaction = wallet.createTransaction({ amount, recipient });
      });
      it('should create a Transaction object', () => {
        expect(transaction).toBeInstanceOf(Transaction);
      });

      it('should match the wallet input', () => {
        expect(transaction.input.address).toEqual(wallet.publicKey);
      });

      it('should output the amount to the recipient', () => {
        expect(transaction.outputMap[recipient]).toEqual(amount);
      });
    });
  });
});

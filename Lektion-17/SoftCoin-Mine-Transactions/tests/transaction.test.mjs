import { it, describe, expect, beforeEach } from 'vitest';
import Transaction from '../models/Transaction.mjs';
import Wallet from '../models/Wallet.mjs';
import { verifySignature } from '../utilities/crypto-lib.mjs';
import { REWARD_ADDRESS } from '../config/settings.mjs';

describe('Transaction', () => {
  let transaction, sender, recipient, amount;

  beforeEach(() => {
    sender = new Wallet();
    recipient = 'Michael';
    amount = 25;
    transaction = new Transaction({ sender, recipient, amount });
  });

  describe('Properties', () => {
    it('should have a property named id', () => {
      expect(transaction).toHaveProperty('id');
    });
  });

  describe('OutputMap', () => {
    it('should have a property named outputMap', () => {
      expect(transaction).toHaveProperty('outputMap');
    });

    it('should output the recipients balance', () => {
      expect(transaction.outputMap[recipient]).toEqual(amount);
    });

    it('should display the senders balance', () => {
      expect(transaction.outputMap[sender.publicKey]).toEqual(
        sender.balance - amount
      );
    });
  });

  describe('InputMap', () => {
    it('should have a property named input', () => {
      expect(transaction).toHaveProperty('input');
    });

    it('should have a property named timestamp', () => {
      expect(transaction.input).toHaveProperty('timestamp');
    });

    it('should set the amount to the senders balance', () => {
      expect(transaction.input.amount).toEqual(sender.balance);
    });

    it('should set the address value to the senders publicKey', () => {
      expect(transaction.input.address).toEqual(sender.publicKey);
    });

    it('should sign the input', () => {
      expect(
        verifySignature({
          publicKey: sender.publicKey,
          data: transaction.outputMap,
          signature: transaction.input.signature,
        })
      ).toBe(true);
    });
  });

  describe('Validate transaction', () => {
    describe('when the transaction is valid', () => {
      it('should return true', () => {
        expect(Transaction.validate(transaction)).toBe(true);
      });
    });

    describe('when the transaction is invalid', () => {
      describe('and the transaction outputMap value is invalid', () => {
        it('should return false', () => {
          transaction.outputMap[sender.publicKey] = 89898989;
          expect(Transaction.validate(transaction)).toBe(false);
        });
      });
      describe('and the transaction input signature is invalid', () => {
        it('should return false', () => {
          transaction.input.signature = new Wallet().sign('Dummy data');
          expect(Transaction.validate(transaction)).toBe(false);
        });
      });
    });
  });

  describe('Update transaction', () => {
    let orgSignature, orgSenderOutput, nextRecipient, nextAmount;

    describe('and the amount is invalid(not enough funds)', () => {
      it('should throw an error', () => {
        expect(() => {
          transaction.update({ sender, recipient, amount: 1010 });
        }).toThrow('Not enough funds!');
      });
    });

    describe('and the amount is valid', () => {
      beforeEach(() => {
        orgSignature = transaction.input.signature;
        orgSenderOutput = transaction.outputMap[sender.publicKey];
        nextAmount = 25;
        nextRecipient = 'Gustav';

        transaction.update({
          sender,
          recipient: nextRecipient,
          amount: nextAmount,
        });
      });

      it('should display the amount for the next recipient', () => {
        expect(transaction.outputMap[nextRecipient]).toEqual(nextAmount);
      });

      it('should withdraw the amount from the original sender output balance', () => {
        expect(transaction.outputMap[sender.publicKey]).toEqual(
          orgSenderOutput - nextAmount
        );
      });

      it('should match the total output amount with the input amount', () => {
        expect(
          Object.values(transaction.outputMap).reduce(
            (total, amount) => total + amount
          )
        ).toEqual(transaction.input.amount);
      });

      it('should create a new signature for the transaction', () => {
        expect(transaction.input.signature).not.toEqual(orgSignature);
      });
    });
  });

  describe('Transaction reward', () => {
    let transactionReward, miner;

    beforeEach(() => {
      miner = new Wallet();
      transactionReward = Transaction.transactionReward({ miner });
    });

    it('should create a reward transaktion with the address of the miner', () => {
      expect(transactionReward.input).toEqual(REWARD_ADDRESS);
    });
  });
});

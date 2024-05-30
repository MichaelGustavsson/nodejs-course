import { it, describe, expect, beforeEach } from 'vitest';
import Transaction from '../models/Transaction.mjs';
import Wallet from '../models/Wallet.mjs';
import { verifySignature } from '../utilities/crypto-lib.mjs';
import { MINING_REWARD, REWARD_ADDRESS } from '../config/settings.mjs';

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

  describe('inputMapMap', () => {
    it('should have a property named inputMap', () => {
      expect(transaction).toHaveProperty('inputMap');
    });

    it('should have a property named timestamp', () => {
      expect(transaction.inputMap).toHaveProperty('timestamp');
    });

    it('should set the amount to the senders balance', () => {
      expect(transaction.inputMap.amount).toEqual(sender.balance);
    });

    it('should set the address value to the senders publicKey', () => {
      expect(transaction.inputMap.address).toEqual(sender.publicKey);
    });

    it('should sign the inputMap', () => {
      expect(
        verifySignature({
          publicKey: sender.publicKey,
          data: transaction.outputMap,
          signature: transaction.inputMap.signature,
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
      describe('and the transaction inputMap signature is invalid', () => {
        it('should return false', () => {
          transaction.inputMap.signature = new Wallet().sign('Dummy data');
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
        orgSignature = transaction.inputMap.signature;
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

      it('should match the total output amount with the inputMap amount', () => {
        expect(
          Object.values(transaction.outputMap).reduce(
            (total, amount) => total + amount
          )
        ).toEqual(transaction.inputMap.amount);
      });

      it('should create a new signature for the transaction', () => {
        expect(transaction.inputMap.signature).not.toEqual(orgSignature);
      });
    });
  });

  describe('Transaction reward', () => {
    let transactionReward, miner;

    beforeEach(() => {
      miner = new Wallet();
      transactionReward = Transaction.transactionReward({ miner });
    });

    it('should create a reward transaction with the address of the miner', () => {
      expect(transactionReward.inputMap).toEqual(REWARD_ADDRESS);
    });

    it('should create ONE and only ONE transaction with the MINING_REWARD', () => {
      expect(transactionReward.outputMap[miner.publicKey]).toEqual(
        MINING_REWARD
      );
    });
  });
});

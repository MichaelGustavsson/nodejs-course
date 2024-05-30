import { it, describe, expect, beforeEach, vi } from 'vitest';
import Wallet from '../models/Wallet.mjs';
import { verifySignature } from '../utilities/crypto-lib.mjs';
import Transaction from '../models/Transaction.mjs';
import Blockchain from '../models/Blockchain.mjs';
import { INITIAL_BALANCE } from '../config/settings.mjs';

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

      it('should match the wallet inputMap', () => {
        expect(transaction.inputMap.address).toEqual(wallet.publicKey);
      });

      it('should output the amount to the recipient', () => {
        expect(transaction.outputMap[recipient]).toEqual(amount);
      });
    });
  });

  describe('Calculate the balance', () => {
    let blockchain;

    beforeEach(() => {
      blockchain = new Blockchain();
    });

    // Fall 1.  När det inte finns några outputs(transaktioner)
    // för vår digitala plånbok...
    describe('and there is no output for the wallet', () => {
      it('should return the initial balance(starting balance)', () => {
        expect(
          Wallet.calculateBalance({
            chain: blockchain.chain,
            address: wallet.publicKey,
          })
        ).toEqual(INITIAL_BALANCE);
      });
    });

    // Fall 2.  Det har skett förändring i plånboken...
    describe('and there are outputs/transactions for the wallet', () => {
      let transaction_1, transaction_2;

      beforeEach(() => {
        transaction_1 = new Wallet().createTransaction({
          recipient: wallet.publicKey,
          amount: 10,
        });

        transaction_2 = new Wallet().createTransaction({
          recipient: wallet.publicKey,
          amount: 20,
        });

        blockchain.addBlock({ data: [transaction_1, transaction_2] });
      });

      it('should calculate the sum of all outputs(transactions) for the wallet', () => {
        expect(
          Wallet.calculateBalance({
            chain: blockchain.chain,
            address: wallet.publicKey,
          })
        ).toEqual(
          INITIAL_BALANCE +
            transaction_1.outputMap[wallet.publicKey] +
            transaction_2.outputMap[wallet.publicKey]
        );
      });

      describe('and the wallet has made a transaction', () => {
        let latestTransaction;

        beforeEach(() => {
          latestTransaction = wallet.createTransaction({
            recipient: 'Nils',
            amount: 25,
          });

          blockchain.addBlock({ data: [latestTransaction] });
        });

        it('should return the amount from the latest transaction', () => {
          expect(
            Wallet.calculateBalance({
              chain: blockchain.chain,
              address: wallet.publicKey,
            })
          ).toEqual(latestTransaction.outputMap[wallet.publicKey]);
        });

        describe('and there are outputs next and after the recent transaction', () => {
          let currentBlockTransaction, nextBlockTransaction;

          beforeEach(() => {
            latestTransaction = wallet.createTransaction({
              recipient: 'Olle',
              amount: 35,
            });

            // Belönings transaktionen...
            currentBlockTransaction = Transaction.transactionReward({
              miner: wallet,
            });

            // Placera ovanstående transaktioner i ett block i blockkedjan...
            blockchain.addBlock({
              data: [latestTransaction, currentBlockTransaction],
            });

            // Skapa en ny transaktion...
            nextBlockTransaction = new Wallet().createTransaction({
              recipient: wallet.publicKey,
              amount: 55,
            });

            blockchain.addBlock({ data: [nextBlockTransaction] });
          });

          it('should include the amounts from the returned balance', () => {
            expect(
              Wallet.calculateBalance({
                chain: blockchain.chain,
                address: wallet.publicKey,
              })
            ).toEqual(
              latestTransaction.outputMap[wallet.publicKey] +
                currentBlockTransaction.outputMap[wallet.publicKey] +
                nextBlockTransaction.outputMap[wallet.publicKey]
            );
          });
        });
      });
    });
  });
});

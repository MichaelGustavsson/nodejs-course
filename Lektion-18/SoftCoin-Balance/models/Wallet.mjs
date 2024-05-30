import { INITIAL_BALANCE } from '../config/settings.mjs';
import { ellipticHash, createHash } from '../utilities/crypto-lib.mjs';
import Transaction from './Transaction.mjs';

export default class Wallet {
  constructor() {
    this.balance = INITIAL_BALANCE;
    this.keyPair = ellipticHash.genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode('hex');
  }

  // STATIC METHODS...
  static calculateBalance({ chain, address }) {
    let total = 0;
    let hasAddedTransaction = false;

    // Gå igenom varje block i blockkedjan...
    for (let i = chain.length - 1; i > 0; i--) {
      const block = chain[i];

      // För varje block behöver gå igenom transaktionerna...
      for (let transaction of block.data) {
        if (transaction.inputMap.address === address) {
          hasAddedTransaction = true;
        }

        const value = transaction.outputMap[address];

        if (value) {
          total += value;
        }
      }

      if (hasAddedTransaction) break;
    }

    return hasAddedTransaction ? total : INITIAL_BALANCE + total;
  }

  // INSTANCE METHODS...
  createTransaction({ recipient, amount, chain }) {
    if (chain) {
      this.balance = Wallet.calculateBalance({
        chain,
        address: this.publicKey,
      });
    }

    if (amount > this.balance) throw new Error('Not enough funds!');

    return new Transaction({ sender: this, recipient, amount });
  }

  sign(data) {
    return this.keyPair.sign(createHash(data));
  }
}

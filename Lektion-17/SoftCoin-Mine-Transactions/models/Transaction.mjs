import { v4 as uuidv4 } from 'uuid';
import { verifySignature } from '../utilities/crypto-lib.mjs';
import { REWARD_ADDRESS, MINING_REWARD } from '../config/settings.mjs';

export default class Transaction {
  constructor({ sender, recipient, amount, input, outputMap }) {
    this.id = uuidv4().replaceAll('-', '');
    this.outputMap = outputMap || this.createMap({ sender, recipient, amount });
    this.input =
      input || this.createInput({ sender, outputMap: this.outputMap });
  }

  static transactionReward({ miner }) {
    console.log('MINER', miner);
    return new this({
      input: REWARD_ADDRESS,
      outputMap: { [miner.publicKey]: MINING_REWARD },
    });
  }

  static validate(transaction) {
    const {
      input: { address, amount, signature },
      outputMap,
    } = transaction;

    const outputTotal = Object.values(outputMap).reduce(
      (total, amount) => total + amount
    );

    if (amount !== outputTotal) {
      return false;
    }

    if (!verifySignature({ publicKey: address, data: outputMap, signature })) {
      return false;
    }

    return true;
  }

  update({ sender, recipient, amount }) {
    if (amount > this.outputMap[sender.publicKey])
      throw new Error('Not enough funds!');

    if (!this.outputMap[recipient]) {
      this.outputMap[recipient] = amount;
    } else {
      this.outputMap[recipient] = this.outputMap[recipient] + amount;
    }

    this.outputMap[sender.publicKey] =
      this.outputMap[sender.publicKey] - amount;

    this.input = this.createInput({ sender, outputMap: this.outputMap });
  }

  createMap({ sender, recipient, amount }) {
    const outputMap = {};

    outputMap[recipient] = amount;
    outputMap[sender.publicKey] = sender.balance - amount;

    return outputMap;
  }

  createInput({ sender, outputMap }) {
    return {
      timestamp: Date.now(),
      amount: sender.balance,
      address: sender.publicKey,
      signature: sender.sign(outputMap),
    };
  }
}

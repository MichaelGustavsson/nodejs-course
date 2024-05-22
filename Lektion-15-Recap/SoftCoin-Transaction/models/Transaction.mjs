import { v4 as uuidv4 } from 'uuid';
import { verifySignature } from '../utilities/crypto-lib.mjs';

export default class Transaction {
  constructor({ sender, recipient, amount }) {
    this.id = uuidv4().replaceAll('-', '');
    this.outputMap = this.createOutputMap({ sender, recipient, amount });
    this.inputMap = this.createInputMap({ sender, outputMap: this.outputMap });
  }

  createOutputMap({ sender, recipient, amount }) {
    const outputMap = {};

    // console.log('SENDER', sender);
    // console.log('RECIPIENT', recipient);
    // console.log('AMOUNT', amount);

    outputMap[recipient] = amount;
    outputMap[sender.publicKey] = sender.balance - amount;

    // console.log('CREATE OUTPUT MAP:', outputMap);
    return outputMap;
  }

  createInputMap({ sender, outputMap }) {
    // console.log('SENDER:', sender);
    // console.log('OUTPUT MAP:', outputMap);
    // console.log('AMOUNT:', sender.balance);
    // console.log('ADDRESS:', sender.publicKey);
    // console.log('SIGNATURE:', sender.sign(outputMap));

    return {
      timestamp: Date.now(),
      amount: sender.balance,
      address: sender.publicKey,
      signature: sender.sign(outputMap),
    };
  }
  // Static methods...
  static validate(transaction) {
    // console.log('TRANSACTION:', transaction);
    const {
      inputMap: { address, amount, signature },
      outputMap,
    } = transaction;

    const outputTotal = Object.values(outputMap).reduce(
      (total, amount) => total + amount
    );

    // console.log('TOTAL:', outputTotal);
    if (amount !== outputTotal) return false;

    if (!verifySignature({ publicKey: address, data: outputMap, signature }))
      return false;

    return true;
  }
}

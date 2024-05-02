import { createHash } from '../utilities/crypto-lib.mjs';
import Block from './Block.mjs';

export default class Blockchain {
  constructor() {
    this.chain = [];

    // Skapa vårt genisis block...
    this.createBlock(Date.now(), '0', '0', []);
  }

  // Metod för att lägga till ett nytt block i kedjan...
  createBlock(timestamp, previousBlockHash, currentBlockHash, data) {
    // Skapa blocket...
    const block = new Block(
      timestamp,
      this.chain.length + 1,
      previousBlockHash,
      currentBlockHash,
      data
    );

    this.chain.push(block);

    return block;
  }

  getLastBlock() {
    return this.chain.at(-1);
  }

  hashBlock(timestamp, previousBlockHash, currentBlockData) {
    const stringToHash =
      timestamp.toString() +
      previousBlockHash +
      JSON.stringify(currentBlockData);
    const hash = createHash(stringToHash);

    return hash;
  }
}

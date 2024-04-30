import { createHash } from '../utilities/crypto-lib.mjs';
import Block from './Block.mjs';

export default class Blockchain {
  constructor() {
    this.chain = [];
    // Skapa vårt genisis block...
    this.createBlock('0', '0', []);
  }

  // Metod för att lägga till ett nytt block i kedjan...
  createBlock(previousBlockHash, currentBlockHash, data) {
    // Skapa blocket...
    const block = new Block(
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

  hashBlock(previousBlockHash, currentBlockData) {
    const stringToHash = previousBlockHash + JSON.stringify(currentBlockData);
    const hash = createHash(stringToHash);
    console.log(hash);
    return hash;
  }
}

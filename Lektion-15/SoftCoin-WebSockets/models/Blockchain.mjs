import { createHash } from '../utilities/crypto-lib.mjs';
import Block from './Block.mjs';

export default class Blockchain {
  constructor() {
    this.chain = [Block.genesis];
  }

  // Instance method...
  addBlock({ data }) {
    const newBlock = Block.mineBlock({
      lastBlock: this.chain.at(-1),
      data: data,
    });
    this.chain.push(newBlock);
    return newBlock;
  }

  replaceChain(chain) {
    if (chain.length <= this.chain.length) return;

    if (!Blockchain.validateChain(chain)) return;

    this.chain = chain;
  }

  // Static methods...
  // Concensus
  static validateChain(chain) {
    // Regel 1. Ha ett korrekt genesis block
    if (JSON.stringify(chain.at(0)) !== JSON.stringify(Block.genesis))
      return false;

    for (let i = 1; i < chain.length; i++) {
      const { timestamp, lastHash, hash, data, nonce, difficulty } =
        chain.at(i);
      const currentLastHash = chain[i - 1].hash;
      const lastDifficulty = chain[i - 1].difficulty;

      // Regel 2. Föregående blocks hash måste stämma överens med aktuellt blocks lastHash...
      if (lastHash !== currentLastHash) return false;

      // Skydda oss mot för stora skillnader i difficulty värdet både uppåt och nedåt...
      if (Math.abs(lastDifficulty - difficulty) > 1) return false;

      // Regel 3. Kontrollera så att blocket är ok...
      // Att ingen har manipulerat datat...
      const validHash = createHash(
        timestamp,
        lastHash,
        data,
        nonce,
        difficulty
      );
      if (hash !== validHash) return false;
    }

    return true;
  }
}

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
  }

  replaceChain(chain) {
    if (chain.length <= this.chain.length) return;

    if (!Blockchain.validateChain(chain)) return;

    this.chain = chain;
  }

  // Static methods...
  static validateChain(chain) {
    // Regel 1. Ha ett korrekt genesis block
    if (JSON.stringify(chain.at(0)) !== JSON.stringify(Block.genesis))
      return false;

    for (let i = 1; i < chain.length; i++) {
      const { timestamp, lastHash, hash, data } = chain.at(i);
      const currentLastHash = chain[i - 1].hash;

      // Regel 2. Föregående blocks hash måste stämma överens med aktuellt blocks lastHash...
      if (lastHash !== currentLastHash) return false;

      // Regel 3. Kontrollera så att blocket är ok...
      const validHash = createHash(timestamp, lastHash, data);
      if (hash !== validHash) return false;
    }

    return true;
  }
}

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

  // Static methods...
  static validateChain(chain) {
    if (JSON.stringify(chain.at(0)) !== JSON.stringify(Block.genesis))
      return false;
  }
}

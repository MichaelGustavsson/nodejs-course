import { GENESIS_DATA } from '../utilities/config.mjs';

export default class Block {
  constructor(timestamp, hash, lastHash, nonce, difficulty, data) {
    this.timestamp = timestamp;
    this.hash = hash;
    this.lastHash = lastHash;
    this.nonce = nonce;
    this.difficulty = difficulty;
    this.data = data;
  }

  static createGenesis() {
    return new this(GENESIS_DATA);
  }
}

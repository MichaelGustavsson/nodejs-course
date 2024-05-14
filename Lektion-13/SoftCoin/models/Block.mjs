import { GENESIS_DATA } from '../config/settings.mjs';
import { createHash } from '../utilities/crypto-lib.mjs';

export default class Block {
  constructor({ timestamp, lastHash, hash, data }) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
  }

  // Getter... = property...
  static get genesis() {
    return new this(GENESIS_DATA);
  }

  static mineBlock({ lastBlock, data }) {
    const timestamp = Date.now();
    const lastHash = lastBlock.hash;
    const hash = createHash(timestamp, lastHash, data);

    return new this({
      timestamp,
      lastHash,
      hash,
      data,
    });
  }
}

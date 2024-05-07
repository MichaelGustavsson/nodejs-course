import { GENESIS_DATA, MINE_RATE } from '../utilities/config.mjs';
import { createHash } from '../utilities/crypto-lib.mjs';
export default class Block {
  constructor({ timestamp, hash, lastHash, nonce, difficulty, data }) {
    this.timestamp = timestamp;
    this.hash = hash;
    this.lastHash = lastHash;
    this.nonce = nonce;
    this.difficulty = difficulty;
    this.data = data;
  }

  static createGenesis() {
    return new this(GENESIS_DATA);
    // return new this(
    //   GENESIS_DATA.timestamp,
    //   GENESIS_DATA.hash,
    //   GENESIS_DATA.lastHash,
    //   GENESIS_DATA.nonce,
    //   GENESIS_DATA.difficulty,
    //   GENESIS_DATA.data
    // );
  }

  static mineBlock(lastBlock, data) {
    // Deklarera variabler för timestamp och hash samt för nonce;
    let timestamp, hash;
    let nonce = 2048;

    let lastHash = lastBlock.hash;
    let { difficulty } = lastBlock;

    do {
      nonce++;
      timestamp = Date.now();
      difficulty = Block.adjustDifficultyLevel(lastBlock, timestamp);

      const stringToHash = timestamp
        .toString()
        .concat(lastHash, JSON.stringify(data), nonce, difficulty);

      hash = createHash(stringToHash);
    } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));

    return new this({ timestamp, hash, lastHash, nonce, difficulty, data });
    // return new this(timestamp, hash, lastHash, nonce, difficulty, data);
  }

  static adjustDifficultyLevel(block, timestamp) {
    let { difficulty } = block;

    if (difficulty < 1) return 1;

    if (timestamp - block.timestamp > MINE_RATE) return difficulty - 1;

    return difficulty + 1;
  }
}

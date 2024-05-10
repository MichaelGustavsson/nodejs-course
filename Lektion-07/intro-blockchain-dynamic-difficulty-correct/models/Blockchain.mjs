import { createHash } from '../utilities/crypto-lib.mjs';
import Block from './Block.mjs';

export default class Blockchain {
  constructor() {
    console.log('Blockchain constructor', process.env.DIFFICULTY);
    this.chain = [];
    // Skapa vårt genisis block...
    this.createBlock(Date.now(), '0', '0', [], process.env.DIFFICULTY);
  }

  // Metod för att lägga till ett nytt block i kedjan...
  createBlock(
    timestamp,
    previousBlockHash,
    currentBlockHash,
    data,
    difficulty
  ) {
    // Skapa blocket...
    const block = new Block(
      timestamp,
      this.chain.length + 1,
      previousBlockHash,
      currentBlockHash,
      data,
      difficulty
    );

    this.chain.push(block);

    return block;
  }

  getLastBlock() {
    return this.chain.at(-1);
  }

  hashBlock(timestamp, previousBlockHash, currentBlockData, nonce, difficulty) {
    const stringToHash =
      timestamp.toString() +
      previousBlockHash +
      JSON.stringify(currentBlockData) +
      nonce +
      difficulty;
    const hash = createHash(stringToHash);

    return hash;
  }

  proofOfWork(previousBlockHash, data) {
    const lastBlock = this.getLastBlock();
    let difficulty, hash, timestamp;
    let nonce = 0;

    do {
      nonce++;
      timestamp = Date.now();

      difficulty = this.difficultyAdjustment(lastBlock, timestamp);
      hash = this.hashBlock(
        timestamp,
        previousBlockHash,
        data,
        nonce,
        difficulty
      );
    } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));

    return { nonce, difficulty, timestamp };
  }

  difficultyAdjustment(lastBlock, timestamp) {
    const MINE_RATE = process.env.MINE_RATE;
    let { difficulty } = lastBlock;

    console.log(+difficulty);

    if (difficulty < 1) return 1;

    return timestamp - lastBlock.timestamp > MINE_RATE
      ? +difficulty + 1
      : +difficulty - 1;
  }
}

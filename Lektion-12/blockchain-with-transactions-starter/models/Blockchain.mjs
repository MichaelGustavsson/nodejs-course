import { createHash } from '../utilities/crypto-lib.mjs';
import Block from './Block.mjs';

export default class Blockchain {
  constructor() {
    this.chain = [];
    // Array för att hålla reda på vilka medlemmar(noder) som är registrerade på denna server(blockkedja)
    this.memberNodes = [];
    // Variabel som håller koll på vår egen nods url(namn)...
    this.nodeUrl = process.argv[3];

    // Skapa vårt genisis block...
    this.createBlock(Date.now(), '0', '0', [], 2048, process.env.DIFFICULTY);
  }

  // Metod för att lägga till ett nytt block i kedjan...
  createBlock(
    timestamp,
    previousBlockHash,
    currentBlockHash,
    data,
    nonce,
    difficulty
  ) {
    // Skapa blocket...
    const block = new Block(
      timestamp,
      this.chain.length + 1,
      previousBlockHash,
      currentBlockHash,
      data,
      nonce,
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

  validateChain(blockchain) {
    let isValid = true;

    // Gå igenom varje block i kedjan och validera dem.
    for (let i = 1; i < blockchain.length; i++) {
      const block = blockchain[i];
      const previousBlock = blockchain[i - 1];

      const hash = this.hashBlock(
        block.timestamp,
        previousBlock.currentBlockHash,
        block.data
      );

      if (hash !== block.currentBlockHash) isValid = false;
      if (block.previousBlockHash !== previousBlock.currentBlockHash)
        isValid = false;
    }

    return isValid;
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

    if (difficulty < 1) return 1;

    return timestamp - lastBlock.timestamp > MINE_RATE
      ? +difficulty + 1
      : +difficulty - 1;
  }
}

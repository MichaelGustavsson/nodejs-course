export default class Block {
  constructor(
    timestamp,
    blockIndex,
    previousBlockHash,
    currentBlockHash,
    data,
    nonce,
    difficulty
  ) {
    this.timestamp = timestamp;
    this.blockIndex = blockIndex;
    this.previousBlockHash = previousBlockHash;
    this.currentBlockHash = currentBlockHash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty;
  }
}

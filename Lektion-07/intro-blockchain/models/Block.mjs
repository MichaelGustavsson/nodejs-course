export default class Block {
  constructor(
    timestamp,
    blockIndex,
    previousBlockHash,
    currentBlockHash,
    data
  ) {
    this.timestamp = timestamp;
    this.blockIndex = blockIndex;
    this.previousBlockHash = previousBlockHash;
    this.currentBlockHash = currentBlockHash;
    this.data = data;
  }
}

import { blockchain } from '../startup.mjs';

const getBlockchain = (req, res, next) => {
  res.status(200).json({ success: true, data: blockchain });
};

// endpoint .../mine.
const createBlock = (req, res, next) => {
  const lastBlock = blockchain.getLastBlock();
  const data = req.body;
  const { nonce, difficulty, timestamp } = blockchain.proofOfWork(
    lastBlock.currentBlockHash,
    data
  );

  const currentBlockHash = blockchain.hashBlock(
    timestamp,
    lastBlock.currentBlockHash,
    data,
    nonce,
    difficulty
  );

  const block = blockchain.createBlock(
    timestamp,
    lastBlock.currentBlockHash,
    currentBlockHash,
    data,
    difficulty
  );

  res.status(201).json({ success: true, data: block });
};

export { createBlock, getBlockchain };

import { blockchain } from '../startup.mjs';

const getBlockchain = (req, res, next) => {
  res.status(200).json({ success: true, data: blockchain });
};

// endpoint .../mine.
const createBlock = (req, res, next) => {
  const lastBlock = blockchain.getLastBlock();
  const data = req.body;
  const timestamp = Date.now();

  const currentBlockHash = blockchain.hashBlock(
    timestamp,
    lastBlock.currentBlockHash,
    data
  );

  const block = blockchain.createBlock(
    timestamp,
    lastBlock.currentBlockHash,
    currentBlockHash,
    data
  );

  res.status(201).json({ success: true, data: block });
};

// Concensus endpoint.
// Regeln är väldigt enkel den med flest korrekta block vinner alltid
const synchronizeChain = (req, res, next) => {
  // Ta reda på aktuellt antal block i kedjan.
  const currentLength = blockchain.chain.length;
  let maxLength = currentLength;
  let longestChain = null;

  // Gå igenom alla noder i memberNodes för aktuellt node...
  blockchain.memberNodes.forEach(async (member) => {
    const response = await fetch(`${member}/api/v1/blockchain`);
    if (response.ok) {
      const result = await response.json();

      if (result.data.chain.length > maxLength) {
        maxLength = result.data.chain.length;
        longestChain = result.data.chain;
      }

      if (
        !longestChain ||
        (longestChain && !blockchain.validateChain(longestChain))
      ) {
        console.log('Är synkade');
      } else {
        blockchain.chain = longestChain;
        console.log(blockchain);
      }
    }
  });

  res.status(200).json({
    success: true,
    statusCode: 200,
    data: { message: 'Synkroniseringen är klar' },
  });
};

export { createBlock, getBlockchain, synchronizeChain };

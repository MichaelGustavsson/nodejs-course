import { blockchain } from '../startup.mjs';

const getBlockchain = (req, res, next) => {
  res.status(200).json({ success: true, data: blockchain });
};

const mineBlock = async (req, res, next) => {
  const lastBlock = blockchain.getLastBlock();
  const data = blockchain.pendingTransactions;
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
    nonce,
    difficulty
  );

  blockchain.memberNodes.forEach(async (url) => {
    const body = { block };
    await fetch(`${url}/api/v1/blockchain/block/broadcast`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  const reward = { amount: 3, sender: '0000', recipient: blockchain.nodeUrl };

  await fetch(
    `${blockchain.nodeUrl}/api/v1/transactions/transaction/broadcast`,
    {
      method: 'POST',
      body: JSON.stringify(reward),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  res.status(200).json({
    success: true,
    statusCode: 200,
    data: { message: 'Block skapat och distribuerat', block },
  });
};

const updateChain = (req, res, next) => {
  const block = req.body.block;
  const lastBlock = blockchain.getLastBlock();
  const hash = lastBlock.currentBlockHash === block.previousBlockHash;
  const index = lastBlock.blockIndex + 1 === block.blockIndex;

  if (hash && index) {
    blockchain.chain.push(block);
    blockchain.pendingTransactions = [];
    res.status(201).json({
      success: true,
      statusCode: 201,
      data: {
        message: 'Blocket är tillagt och skickat till alla noder',
        block: block,
      },
    });
  } else {
    res.status(500).json({
      success: false,
      statusCode: 500,
      data: { message: 'Det nya blocket avvisades', block },
    });
  }
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
      }
    }
  });

  res.status(200).json({
    success: true,
    statusCode: 200,
    data: { message: 'Synkroniseringen är klar' },
  });
};

export { mineBlock, getBlockchain, synchronizeChain, updateChain };

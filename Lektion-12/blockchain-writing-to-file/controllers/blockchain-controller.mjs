import { blockchain } from '../startup.mjs';
import { writeFileSync, writeFileAsync } from '../utilities/filehandler.mjs';

const getBlockchain = (req, res, next) => {
  res.status(200).json({ success: true, data: blockchain });
};

const createBlock = async (req, res, next) => {
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

  writeFileAsync('logs', 'blockchain.json', JSON.stringify(blockchain.chain));

  blockchain.memberNodes.forEach(async (url) => {
    const body = block;
    await fetch(`${url}/api/v1/blockchain/block/broadcast`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  res.status(201).json({
    success: true,
    data: { message: 'Block skapat och distribuerat', block },
  });
};

const broadcast = (req, res, next) => {
  const block = req.body;
  const lastBlock = blockchain.getLastBlock();
  // Kontrollera så att hash värdet i föregående stämmer överens
  // med aktuellt blocks föregående blockhash
  // Om så är fallet returnera true annars false
  const hash = lastBlock.currentBlockHash === block.previousBlockHash;
  // Räkna upp föregående block index värde med 1 och jämför
  // det med aktuellt block index.
  const index = lastBlock.blockIndex + 1 === block.blockIndex;

  if (hash && index) {
    blockchain.chain.push(block);
    res.status(201).json({
      success: true,
      statusCode: 201,
      data: { message: 'Blocket är tillagt och skickat' },
    });
  } else {
    res.status(500).json({
      success: false,
      statusCode: 500,
      data: { message: 'Blocket avvisades' },
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

export { createBlock, getBlockchain, synchronizeChain, broadcast };

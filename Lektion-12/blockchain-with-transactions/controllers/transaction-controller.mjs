import { blockchain } from '../startup.mjs';

export const createTransaction = (req, res, next) => {
  const transaction = req.body;

  const blockIndex = blockchain.addTransaction(transaction);

  res.status(201).json({
    success: true,
    statusCode: 201,
    data: { message: 'Transaktion skapad', transaction, blockIndex },
  });
};

export const broadcastTransaction = (req, res, next) => {
  const transaction = blockchain.createTransaction(
    req.body.amount,
    req.body.sender,
    req.body.recipient
  );

  const blockIndex = blockchain.addTransaction(transaction);

  blockchain.memberNodes.forEach(async (url) => {
    await fetch(`${url}/api/v1/transactions/transaction`, {
      method: 'POST',
      body: JSON.stringify(transaction),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  res.status(201).json({
    success: true,
    statusCode: 201,
    data: {
      message: 'Transaktion skapad och distribuerad',
      transaction,
      blockIndex,
    },
  });
};

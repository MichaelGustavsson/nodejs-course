import { blockchain } from '../startup.mjs';

export const createTransaction = (req, res, next) => {
  const transaction = req.body;

  const blockId = blockchain.addTransaction(
    transaction.amount,
    transaction.sender,
    transaction.recipient
  );

  res
    .status(201)
    .json({
      success: true,
      statusCode: 201,
      data: { message: 'Transaktion skapad', transaction, blockId },
    });
};

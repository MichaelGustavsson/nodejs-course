import { blockchain } from '../server.mjs';

export const listBlock = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, statusCode: 200, data: blockchain.chain });
};

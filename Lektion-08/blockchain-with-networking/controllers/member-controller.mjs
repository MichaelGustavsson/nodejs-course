import { blockchain } from '../startup.mjs';

export const listMembers = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, statusCode: 200, data: blockchain.memberNodes });
};

export const registerNode = (req, res, next) => {
  // Ta ut ur req.body adressen till servern som vill bli medlem...
  const node = req.body;

  if (
    blockchain.memberNodes.indexOf(node.nodeUrl) === -1 &&
    blockchain.nodeUrl !== node.nodeUrl
  ) {
    blockchain.memberNodes.push(node.nodeUrl);

    res.status(201).json({
      success: true,
      statusCode: 201,
      data: { message: `Noden ${node.nodeUrl} är registrerad` },
    });
  } else {
    res.status(400).json({
      success: false,
      statusCode: 400,
      data: { message: `Node ${node.nodeUrl} är redan registrerad` },
    });
  }
};

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
    // Synkronisering, skicka till den nya medlemmen/noden samma medlemmar/noder som jag har
    syncMembers(node.nodeUrl);

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

const syncMembers = (url) => {
  // Skapa en array av alla mina medlemmar/noder samt lägga till mig själv...
  const members = [...blockchain.memberNodes, blockchain.nodeUrl];
  // Gå igenom varje medlem som finnns i members arrayen
  // Sedan skicka till varje medlem listan av medlemmar
  try {
    members.forEach(async (member) => {
      const body = { nodeUrl: member };
      await fetch(`${url}/api/v1/members/register-node`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });
  } catch (error) {
    console.log(error);
  }
};

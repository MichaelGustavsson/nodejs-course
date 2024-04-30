const getBlockchain = (req, res, next) => {
  res.status(200).json({ success: true, data: 'Get Blockchain funkar!' });
};

const createBlock = (req, res, next) => {
  res.status(201).json({ success: true, data: 'Create Block fungerar!' });
};

export { createBlock, getBlockchain };

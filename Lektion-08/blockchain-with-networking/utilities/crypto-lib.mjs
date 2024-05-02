import crypto from 'crypto';

export const createHash = (stringToHash) => {
  return crypto.createHash('sha256').update(stringToHash).digest('hex');
};

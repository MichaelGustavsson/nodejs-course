import crypto from 'crypto';

export const createHash = (...args) => {
  return crypto.createHash('sha256').update(args.sort().join('')).digest('hex');
};

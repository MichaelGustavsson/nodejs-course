import crypto from 'crypto';
import { ec } from 'elliptic';

export const createHash = (...args) => {
  return crypto.createHash('sha256').update(args.sort().join('')).digest('hex');
};

export const ellipticHash = new ec('secp256k1');

export const verifySignature = ({ publicKey, data, signature }) => {
  const key = ellipticHash.keyFromPublic(publicKey, 'hex');

  return key.verify(createHash(data), signature);
};

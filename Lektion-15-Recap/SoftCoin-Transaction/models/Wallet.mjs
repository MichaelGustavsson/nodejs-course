import { INITIAL_BALANCE } from '../config/settings.mjs';
import { ellipticHash, createHash } from '../utilities/crypto-lib.mjs';

export default class Wallet {
  constructor() {
    this.balance = INITIAL_BALANCE;
    this.keyPair = ellipticHash.genKeyPair();
    // Vår adress
    this.publicKey = this.keyPair.getPublic().encode('hex');
  }

  sign(data) {
    return this.keyPair.sign(createHash(data));
  }
}

import { describe, it, expect } from 'vitest';
import { createHash } from '../utilities/crypto-lib.mjs';

describe('Hashing', () => {
  it('should produce a hash with supplied arguments', () => {
    expect(createHash('kalle', 'anka')).toEqual(createHash('kalle', 'anka'));
  });

  it('should produce a hash with supplied arguments in any order', () => {
    expect(createHash('kalle', 'anka')).toEqual(createHash('anka', 'kalle'));
  });

  it('should create a unique hash when any property have changed', () => {
    const obj = {};
    const orginalHash = createHash(obj);
    obj['name'] = 'Kalle Anka';

    expect(createHash(obj)).not.toEqual(orginalHash);
  });
});

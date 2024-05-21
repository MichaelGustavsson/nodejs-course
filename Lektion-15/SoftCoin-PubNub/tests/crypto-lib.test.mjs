import { describe, it, expect } from 'vitest';
import { createHash } from '../utilities/crypto-lib.mjs';

describe('Hashing', () => {
  it('should produce a hash with supplied arguments', () => {
    expect(createHash('kalle', 'anka')).toEqual(createHash('kalle', 'anka'));
  });

  it('should produce a hash with supplied arguments in any order', () => {
    expect(createHash('kalle', 'anka')).toEqual(createHash('anka', 'kalle'));
  });
});

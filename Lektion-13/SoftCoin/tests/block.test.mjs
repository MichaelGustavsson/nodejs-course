import { it, describe, expect, beforeEach } from 'vitest';
import Block from '../models/Block.mjs';

describe('Block', () => {
  const timestamp = Date.now();
  const lastHash = '0';
  const hash = '0';
  const data = { amount: 4, sender: 'Michael', recipient: 'Olle' };

  const block = new Block({
    timestamp: timestamp,
    lastHash: lastHash,
    hash: hash,
    data: data,
  });

  it('should have the properties timestamp, lastHash,hash,data', () => {
    expect(block).toHaveProperty('timestamp');
    expect(block).toHaveProperty('lastHash');
    expect(block).toHaveProperty('hash');
    expect(block).toHaveProperty('data');
  });

  it('should have values for each property', () => {
    expect(block.timestamp).toEqual(timestamp);
    expect(block.lastHash).toEqual(lastHash);
    expect(block.hash).toEqual(hash);
    expect(block.data).toEqual(data);
  });

  describe('Genesis Block', () => {
    const genesis = Block.genesis;

    it('should return an instance of the Block class', () => {
      expect(genesis).toBeInstanceOf(Block);
    });
  });
});

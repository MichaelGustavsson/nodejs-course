import { it, describe, expect, beforeEach } from 'vitest';
import { createHash } from '../utilities/crypto-lib.mjs';
import Block from '../models/Block.mjs';
import { GENESIS_DATA } from '../config/settings.mjs';

describe('Block', () => {
  describe('Properties', () => {
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
  });

  describe('Genesis Block', () => {
    const genesis = Block.genesis;

    it('should return an instance of the Block class', () => {
      expect(genesis).toBeInstanceOf(Block);
    });

    it('should return the genesis data', () => {
      expect(genesis).toEqual(GENESIS_DATA);
    });
  });

  describe('mineBlock() function', () => {
    let lastBlock, data, minedBlock;

    beforeEach(() => {
      lastBlock = Block.genesis;
      data = { message: 'Demo' };
      minedBlock = Block.mineBlock({ lastBlock, data });
    });

    it('should return an instance of the Block class', () => {
      expect(minedBlock).toBeInstanceOf(Block);
    });

    it('should add a timestamp', () => {
      expect(minedBlock.timestamp).not.toBeUndefined();
    });

    it('should set the lastHash to match the lastBlock hash', () => {
      expect(minedBlock.lastHash).toEqual(lastBlock.hash);
    });

    it('should set the data', () => {
      expect(minedBlock.data).toEqual(data);
    });

    it('should produce a hash based on correct input', () => {
      expect(minedBlock.hash).toEqual(
        createHash(minedBlock.timestamp, minedBlock.lastHash, data)
      );
    });
  });
});

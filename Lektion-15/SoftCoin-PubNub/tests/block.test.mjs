import hexToBinary from 'hex-to-binary';
import { it, describe, expect, beforeEach } from 'vitest';
import { createHash } from '../utilities/crypto-lib.mjs';
import Block from '../models/Block.mjs';
import { GENESIS_DATA, MINE_RATE } from '../config/settings.mjs';

describe('Block', () => {
  const timestamp = Date.now();
  const lastHash = '0';
  const hash = '0';
  const nonce = 1;
  const difficulty = 1;
  const data = { amount: 4, sender: 'Michael', recipient: 'Olle' };

  const block = new Block({
    timestamp: timestamp,
    lastHash: lastHash,
    hash: hash,
    data: data,
    nonce: nonce,
    difficulty: difficulty,
  });

  describe('Properties', () => {
    it('should have the properties timestamp, lastHash,hash,data, nonce, difficulty', () => {
      expect(block).toHaveProperty('timestamp');
      expect(block).toHaveProperty('lastHash');
      expect(block).toHaveProperty('hash');
      expect(block).toHaveProperty('data');
      expect(block).toHaveProperty('nonce');
      expect(block).toHaveProperty('difficulty');
    });

    it('should have values for each property', () => {
      expect(block.timestamp).toEqual(timestamp);
      expect(block.lastHash).toEqual(lastHash);
      expect(block.hash).toEqual(hash);
      expect(block.data).toEqual(data);
      expect(block.nonce).toEqual(nonce);
      expect(block.difficulty).toEqual(difficulty);
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

    it('should produce a hash that meets the difficulty level', () => {
      expect(
        hexToBinary(minedBlock.hash).substring(0, minedBlock.difficulty)
      ).toEqual('0'.repeat(minedBlock.difficulty));
    });

    it('should produce a hash based on correct input', () => {
      console.log(minedBlock);
      expect(minedBlock.hash).toEqual(
        createHash(
          minedBlock.timestamp,
          minedBlock.lastHash,
          minedBlock.nonce,
          minedBlock.difficulty,
          data
        )
      );
    });
  });

  describe('adjustDifficulty', () => {
    it('should raise the difficulty level for quickly mined blocks', () => {
      console.log(block);
      expect(
        Block.adjustDifficultyLevel({
          block: block,
          timestamp: block.timestamp + MINE_RATE - 100,
        })
      ).toEqual(block.difficulty + 1);
    });

    it('should lower the difficulty level for slow mined block', () => {
      expect(
        Block.adjustDifficultyLevel({
          block: block,
          timestamp: block.timestamp + MINE_RATE + 100,
        })
      ).toEqual(block.difficulty - 1);
    });
  });
});

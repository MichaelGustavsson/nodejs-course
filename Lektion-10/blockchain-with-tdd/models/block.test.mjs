import { describe, it, expect, beforeEach } from 'vitest';
import { GENESIS_DATA } from '../utilities/config.mjs';
import Block from './Block.mjs';

describe('Block', () => {
  const timestamp = Date.now();
  const hash = 'current-hash';
  const lastHash = 'previous-hash';
  const data = 'Råglimpa';
  const nonce = 1;
  const difficulty = 1;

  const block = new Block(timestamp, hash, lastHash, nonce, difficulty, data);

  describe('Properties', () => {
    it('should have a timestamp property', () => {
      expect(block).toHaveProperty('timestamp');
    });

    it('should have a hash property', () => {
      expect(block).toHaveProperty('hash');
    });

    it('should have a lastHash property', () => {
      expect(block).toHaveProperty('lastHash');
    });

    it('should have a nonce property', () => {
      expect(block).toHaveProperty('nonce');
    });

    it('should have a difficulty property', () => {
      expect(block).toHaveProperty('difficulty');
    });

    it('should have a data property', () => {
      expect(block).toHaveProperty('data');
    });

    describe('Property values', () => {
      it('should set a timestamp', () => {
        expect(block.timestamp).not.toEqual(undefined);
      });

      it('should have data', () => {
        expect(block.data).toEqual(data);
      });

      it('should have a hash value', () => {
        expect(block.hash).toEqual(hash);
      });

      it('should set the lastHash to the hash of the previous block', () => {
        expect(block.lastHash).toEqual(lastHash);
      });

      it('should have a nonce value', () => {
        expect(block.nonce).toEqual(nonce);
      });

      it('should have a difficulty value', () => {
        expect(block.difficulty).toEqual(difficulty);
      });
    });
  });

  it('should return an instance of Block class', () => {
    expect(block instanceof Block).toBe(true);
  });

  describe('Methods', () => {
    describe('createGenesis() function', () => {
      const genesisBlock = Block.createGenesis();
      it('should return an instance of Block class', () => {
        expect(genesisBlock instanceof Block).toBeTruthy();
      });
    });
  });
});

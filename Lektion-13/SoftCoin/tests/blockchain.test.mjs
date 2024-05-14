import { describe, it, expect, beforeEach } from 'vitest';
import Block from '../models/Block.mjs';
import Blockchain from '../models/Blockchain.mjs';

describe('Blockchain', () => {
  let blockchain;

  beforeEach(() => {
    blockchain = new Blockchain();
  });

  // test 1 kolla så att blockkedjan har eller inte har egenskapen "chain"
  it('should have a property named "chain"', () => {
    expect(blockchain).toHaveProperty('chain');
  });
  // test 2 kolla så att "chain" är av typen Array
  it('should have a property "chain" of type Array', () => {
    expect(blockchain.chain).toBeInstanceOf(Array);
  });
  // test 3 ska kontrollera så att första blocket i kedjan är ett genesis block...
  it('should have the genesis block as the first block in the chain', () => {
    expect(blockchain.chain.at(0)).toEqual(Block.genesis);
  });

  it('should add a new block to the chain', () => {
    const data = 'demo block';
    blockchain.addBlock({ data: data });

    expect(blockchain.chain.at(-1).data).toEqual(data);
  });

  describe('Validate chain', () => {
    // Steg 1. Validera genesis blocket
    describe('when the chain does not start with the correct genesis block', () => {
      it('should return false', () => {
        blockchain.chain[0] = { data: 'faulty genesis' };
        expect(Blockchain.validateChain(blockchain.chain)).toBe(false);
      });
    });
  });
});

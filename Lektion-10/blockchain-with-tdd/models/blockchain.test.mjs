import Blockchain from './Blockchain.mjs';
import Block from './Block.mjs';
import { beforeEach, describe, it, expect } from 'vitest';

describe('Blockchain', () => {
  let blockchain_1, blockchain_2, originalChain;

  beforeEach(() => {
    blockchain_1 = new Blockchain();
    blockchain_2 = new Blockchain();
    originalChain = [...blockchain_1.chain];
  });

  describe('Properties', () => {
    it('should have a property named chain', () => {
      expect(blockchain_1).toHaveProperty('chain');
    });

    it('should contain an Array', () => {
      expect(blockchain_1.chain instanceof Array).toBe(true);
    });

    it('should start with the genesis block', () => {
      expect(blockchain_1.chain.at(0)).toEqual(Block.createGenesis());
    });
  });

  describe('Methods', () => {
    describe('createBlock() function', () => {
      it('should add a new block to the chain', () => {
        const data = 'Finska pinnar';
        blockchain_1.createBlock(data);

        expect(blockchain_1.chain.at(-1).data).toEqual(data);
      });
    });

    describe('validateChain() function', () => {
      describe('The genesis block is missing or not the first block in the chain', () => {
        it('should return false', () => {
          blockchain_1.chain[0] = 'Wrong information';
          expect(Blockchain.isValid(blockchain_1.chain)).toBe(false);
        });
      });

      describe('When the chain starts with the genesis block and consists of multiple blocks', () => {
        beforeEach(() => {
          blockchain_1.createBlock({ data: 'Råglimpa' });
          blockchain_1.createBlock({ data: 'Surdegsbröd' });
          blockchain_1.createBlock({ data: 'Wienerbröd' });
          blockchain_1.createBlock({ data: 'Kanelbulle' });
          blockchain_1.createBlock({ data: 'Bondkaka' });
        });

        describe('and the lasthash has changed', () => {
          it('should return false', () => {
            blockchain_1.chain[2].lastHash = 'Hoopsaan!';
            expect(Blockchain.isValid(blockchain_1.chain)).toBe(false);
          });
        });

        describe('and the chain contains a block with invalid information/data', () => {
          it('should return false', () => {
            blockchain_1.chain.at(1).data = 'Surgubbe';
            expect(Blockchain.isValid(blockchain_1.chain)).toBe(false);
          });
        });
      });
    });

    describe('Replace chain', () => {
      describe('when the new chain is smaller', () => {
        it('should not replace the chain', () => {
          blockchain_2.chain[1] = { data: 'Hönökaka' };
          blockchain_1.replaceChain(blockchain_2.chain);
        });
      });

      describe('when the new chain is larget', () => {
        beforeEach(() => {
          blockchain_2.createBlock({ data: 'Råglimpa' });
          blockchain_2.createBlock({ data: 'Surdegsbröd' });
          blockchain_2.createBlock({ data: 'Wienerbröd' });
          blockchain_2.createBlock({ data: 'Kanelbulle' });
          blockchain_2.createBlock({ data: 'Bondkaka' });
          blockchain_2.createBlock({ data: 'Finska pinnar' });
          blockchain_2.createBlock({ data: 'Sport fralla' });
        });

        describe('but is invalid', () => {
          it('should not replace the chain', () => {
            blockchain_2.chain[2].hash = 'Nisse';
            expect(blockchain_1.chain).toEqual(originalChain);
          });
        });

        describe('and when it is valid', () => {
          beforeEach(() => {
            blockchain_1.replaceChain(blockchain_2.chain);
          });
          it('should replace the chain', () => {
            console.log(blockchain_1);
            expect(blockchain_1.chain).toEqual(blockchain_2.chain);
          });
        });
      });
    });
  });
});

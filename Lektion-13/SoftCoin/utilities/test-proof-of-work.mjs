import hexToBinary from 'hex-to-binary';
import Blockchain from '../models/Blockchain.mjs';

const blockchain = new Blockchain();

blockchain.addBlock({ data: 'test' });
let hash = blockchain.chain.at(-1).hash;
console.log('first block binary', hexToBinary(hash));
console.log('first block:', blockchain.chain.at(-1).hash);
let prevTime, nextTime, nextBlock, timeDiff, average;

const times = [];

for (let i = 0; i < 10000; i++) {
  prevTime = blockchain.chain.at(-1).timestamp;
  blockchain.addBlock({ data: `block: ${i}` });

  nextBlock = blockchain.chain.at(-1);
  nextTime = nextBlock.timestamp;
  timeDiff = nextTime - prevTime;
  times.push(timeDiff);

  average = times.reduce((acc, value) => acc + value) / times.length;

  console.log(
    `Time to mine: ${timeDiff}ms. Difficulty: ${nextBlock.difficulty}. Average time: ${average}ms`
  );
}

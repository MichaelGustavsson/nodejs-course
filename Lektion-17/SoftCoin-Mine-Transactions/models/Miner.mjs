import Transaction from './Transaction.mjs';

export default class Miner {
  constructor({ blockchain, wallet, transactionPool, pubsub }) {
    this.blockchain = blockchain;
    this.wallet = wallet;
    this.transactionPool = transactionPool;
    this.pubsub = pubsub;
  }

  mineTransaction() {
    // 1. Hämta ut alla giltiga transaktioner ifrån transaktions pool...
    const validTransactions = this.transactionPool.validTransactions();
    // 2. Skapa en belöningstransaktion (reward)... INTE HELT OK ÄNNU!!!
    validTransactions.push(
      Transaction.transactionReward({ miner: this.wallet })
    );
    // 3. Skapa ett block med giltiga transaktioner och placera detta i blockkedjan...
    // 4. Distribuera blockkedjan till alla noder...
    // 5. Rensa transaktionspoolen...
  }
}

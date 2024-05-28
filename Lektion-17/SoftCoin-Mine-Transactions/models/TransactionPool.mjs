import Transaction from './Transaction.mjs';

export default class TransactionPool {
  constructor() {
    this.transactionMap = {};
  }

  addTransaction(transaction) {
    this.transactionMap[transaction.id] = transaction;
  }

  clearBlockTransactions({ chain }) {
    // Iterera igenom blockkedjan...
    for (let i = 1; i < chain.length; i++) {
      // Hämta ut ett block för varje iteration...
      const block = chain[i];

      // Gå igenom varje transaktion som finns i blocket...
      for (let transaction of block.data) {
        // Om transaktion finns kvar i transactionMap...
        if (this.transactionMap[transaction.id]) {
          // Ta bort transaktion ifrån transactionMap...
          delete this.transactionMap[transaction.id];
        }
      }
    }
  }

  clearTransactions() {
    this.transactionMap = {};
  }

  replaceTransactionMap(transactionMap) {
    this.transactionMap = transactionMap;
  }

  transactionExist({ address }) {
    const transactions = Object.values(this.transactionMap);

    return transactions.find(
      (transaction) => transaction.input.address === address
    );
  }

  validateTransactions() {
    const validTransactions = Object.values(this.transactionMap).filter(
      (transaction) => Transaction.validate(transaction)
    );
    return validTransactions;
  }
}

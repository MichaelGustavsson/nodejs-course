export default class TransactionPool {
  constructor() {
    this.transactionMap = {};
  }

  addTransaction(transaction) {
    this.transactionMap[transaction.id] = transaction;
  }

  transactionExist({ address }) {
    const transactions = Object.values(this.transactionMap);

    // console.log(transactions)
    return transactions.find(
      (transaction) => transaction.input.address === address
    );
  }
}

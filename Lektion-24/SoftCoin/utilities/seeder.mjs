/********************************************************************/
// Seed dummy data...
import Miner from './models/Miner.mjs';
const walletOne = new Wallet();
const walletTwo = new Wallet();

const createWalletTransaction = ({ wallet, recipient, amount }) => {
  const transaction = wallet.createTransaction({
    recipient,
    amount,
    chain: blockchain.chain,
  });

  transactionPool.addTransaction(transaction);
};

const actionDefaultWallet = () =>
  createWalletTransaction({
    wallet,
    recipient: walletOne.publicKey,
    amount: 10,
  });

const actionWalletOne = () => {
  createWalletTransaction({
    wallet: walletOne,
    recipient: walletTwo.publicKey,
    amount: 5,
  });
};

const actionWalletTwo = () => {
  createWalletTransaction({
    wallet: walletTwo,
    recipient: actionDefaultWallet.publicKey,
    amount: 20,
  });
};

for (let i = 0; i < 10; i++) {
  if (i % 3 === 0) {
    actionDefaultWallet();
    actionWalletOne();
  } else if (i % 3 === 1) {
    actionDefaultWallet();
    actionWalletTwo();
  } else {
    actionWalletOne();
    actionWalletTwo();
  }

  Miner.mineTransactions();
}

/********************************************************************/

import { useEffect, useState } from 'react';

function Wallet() {
  const [walletInfo, setWalletInfo] = useState({});

  useEffect(() => {
    getWalletInfo();
  }, []);

  const getWalletInfo = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/v1/wallet/info');

      if (response.ok) {
        const result = await response.json();
        setWalletInfo(result.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='wallet-info'>
      <div>Address: {walletInfo.address}</div>
      <div>Balance: {walletInfo.balance}</div>
    </div>
  );
}
export default Wallet;

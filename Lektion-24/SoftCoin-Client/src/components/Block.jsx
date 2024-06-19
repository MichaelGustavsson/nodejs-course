import { useState } from 'react';
import Transaction from './Transaction';

/* eslint-disable react/prop-types */
function Block({ block }) {
  const [displayDetails, setDisplayDetails] = useState(false);
  const shortHash = `${block.hash.substring(0, 15)}...`;
  const shortHandData =
    JSON.stringify(block.data).length > 40
      ? `${JSON.stringify(block.data).substring(1, 40)}...`
      : JSON.stringify(block.data);

  const renderDetails = () => {
    if (displayDetails) {
      return (
        <section>
          <div className='btn-container'>
            <button
              className='btn'
              onClick={() => setDisplayDetails(!displayDetails)}>
              Show less
            </button>
          </div>
          <div>
            {block.data.map((transaction) => (
              <div key={transaction.id}>
                <Transaction transaction={transaction} />
              </div>
            ))}
          </div>
        </section>
      );
    } else {
      return (
        <section>
          <div className='btn-container'>
            <button
              className='btn'
              onClick={() => setDisplayDetails(!displayDetails)}>
              Show details
            </button>
          </div>
          <div>{shortHandData}</div>
        </section>
      );
    }
  };

  return (
    <div className='block'>
      <div>Hash: {shortHash}</div>
      <div>
        Timestamp: {new Date(block.timestamp).toLocaleDateString('sv-SE')}
      </div>
      {renderDetails()}
    </div>
  );
}
export default Block;

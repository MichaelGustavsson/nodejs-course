/* eslint-disable react/prop-types */
function Transaction({ transaction }) {
  const { inputMap, outputMap } = transaction;
  const recipients = Object.keys(outputMap);
  const fromAddress =
    JSON.stringify(inputMap.address).length > 20
      ? `${JSON.stringify(inputMap.address).substring(1, 20)}...`
      : JSON.stringify(inputMap.address);

  return (
    <section>
      <div className='transaction-info'>
        <span>From: {fromAddress}</span>
        <span>Balance: {inputMap.amount}</span>
      </div>

      {recipients.map((recipient) => (
        <div key={recipient} className='transaction-info'>
          <span>
            To:{' '}
            {JSON.stringify(recipient).length > 20
              ? `${JSON.stringify(recipient).substring(1, 20)}...`
              : JSON.stringify(recipient)}
          </span>
          <span>Sent: {outputMap[recipient]}</span>
        </div>
      ))}
    </section>
  );
}
export default Transaction;

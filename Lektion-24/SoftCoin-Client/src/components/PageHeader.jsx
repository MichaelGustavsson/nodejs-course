import logo from '../assets/images/softcoin.jpg';

function PageHeader() {
  return (
    <div className='page-header'>
      <h1 className='page-title'>SoftCoin Block Explorer</h1>
      <img src={logo} alt='' width={600} />
    </div>
  );
}
export default PageHeader;

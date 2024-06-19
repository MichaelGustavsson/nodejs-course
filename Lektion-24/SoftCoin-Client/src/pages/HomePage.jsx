import Blocks from '../components/Blocks';
import PageHeader from '../components/PageHeader';
import Wallet from '../components/Wallet';

function HomePage() {
  return (
    <section className='page'>
      <PageHeader />
      <Wallet />
      <Blocks />
    </section>
  );
}
export default HomePage;

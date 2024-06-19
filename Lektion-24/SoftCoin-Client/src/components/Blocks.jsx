import { useState, useEffect } from 'react';
import Block from './Block';

function Blocks() {
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    loadBlocks();
  }, []);

  const loadBlocks = async () => {
    try {
      const response = await fetch(
        'https://blooming-sierra-23034-f4e8f9d25142.herokuapp.com/api/v1/blockchain'
      );

      if (response.ok) {
        const result = await response.json();
        setBlocks(result.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className='blocks'>
      <h2 className='title'>Blocks</h2>
      {blocks.map((block) => (
        <Block className='block' key={block.hash} block={block} />
      ))}
    </div>
  );
}
export default Blocks;

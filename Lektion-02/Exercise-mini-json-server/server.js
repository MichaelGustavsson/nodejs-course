const fs = require('fs');
const path = require('path');
const uuid = require('uuid');

const filePath = path.join(__dirname, 'data', 'products.json');

// console.log(uuid.v4());

try {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const products = JSON.parse(fileContent);

  // Skapa en ny produkt...
  const cookie = {
    id: uuid.v4().replaceAll('-', ''),
    name: 'Finska pinnar',
    price: 34.75,
    weight: '240g',
  };

  products.push(cookie);

  fs.writeFileSync(filePath, JSON.stringify(products), 'utf8');
} catch (error) {
  console.log(error);
}

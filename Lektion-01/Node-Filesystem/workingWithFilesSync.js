const path = require('path');
const fs = require('fs');

const products = [];

const product = {
  id: 1,
  name: 'Wienerbröd',
  price: 19.95,
};

products.push(product);
// try {
//   fs.mkdirSync(path.join(__dirname, 'data'));
// } catch (error) {
//   console.log(error);
// }

try {
  // Skapa filer...
  fs.writeFileSync(path.join(__dirname, 'data', 'products.json'), JSON.stringify(products));
} catch (error) {
  console.log(error);
}
// try {
//   // Skapa filer...
//   fs.writeFileSync(path.join(__dirname, 'data', 'products.json'), 'Kanelbullar');
// } catch (error) {
//   console.log(error);
// }

// fs.appendFileSync(path.join(__dirname, 'data', 'products.json'), '\nKanelkaka');

const content = fs.readFileSync(path.join(__dirname, 'data', 'products.json'), 'utf-8');

const myProduct = JSON.parse(content);
console.log(myProduct);
console.log(myProduct.name);

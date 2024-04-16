// Importera en CommonJS modul med require...
const { getProducts: get, findProduct } = require('./products');
const Product = require('./product');
// const displayInfo = require('./product');
// Importera en ES6 modul...
// import getProducts from './products.mjs';

const cookie = new Product('Kanelkaka', 34.95);

console.log('Node is awesome!!!!');

get();
findProduct(4);
// displayInfo();
cookie.productInfo();
console.log(cookie.name);
console.log(cookie.price);

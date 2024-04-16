// const getProducts = () => {
//   console.log('Hello from products');
// };

// Exportera enlig CommonJS...
// module.exports = getProducts;

// Exportera som ES6 module...
// export default getProducts;

// exports.getProducts = function () {
//   console.log('Hello from products');
// };

// exports.findProduct = function (id) {
//   console.log('Söker efter produkt med id:' + id);
// };

getProducts = function () {
  console.log('Hello from products');
};

findProduct = function (id) {
  console.log('Söker efter produkt med id:' + id);
};

module.exports = { getProducts, findProduct };

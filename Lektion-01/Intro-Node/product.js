// const cookies = {
//   name: 'Bondkaka',
//   price: 39.95,
// };

// const displayProductInfo = () => {
//   console.log(cookies);
// };

// // Liknar ES6 modulers export default...
// module.exports = displayProductInfo;

class Product {
  constructor(name, price) {
    this.name = name;
    this.price = price;
  }

  productInfo() {
    console.log(`Produkten ${this.name} kostar ${this.price}`);
  }
}

module.exports = Product;

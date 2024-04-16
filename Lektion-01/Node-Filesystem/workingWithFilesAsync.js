const path = require('path');
const fs = require('fs');

// Skapa mapp asynkront...
/*
fs.mkdir(path.join(__dirname, 'docs'), {}, (err) => {
  if (err) {
    throw err;
  }
});
*/
// Skapa filer...
// fs.writeFile(path.join(__dirname, 'docs', 'products.txt'), 'Wienerbröd', (err) => {
//   if (err) throw err;

//   fs.appendFile(path.join(__dirname, 'docs', 'products.txt'), '\nKanelbullar', (err) => {
//     if (err) throw err;
//   });

//   fs.appendFile(path.join(__dirname, 'docs', 'products.txt'), '\nBondkaka', (err) => {
//     if (err) throw err;
//   });
// });

fs.readFile(path.join(__dirname, 'docs', 'products.txt'), 'utf8', (err, content) => {
  if (err) throw err;

  console.log(content);
});

const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  // GAMMALT SKRÄP!!!!
  // Logga ut inkommande trafik...
  // const { headers, method, url } = req;
  // console.log(url, method, headers);

  // res.writeHead(200, { 'Content-Type': 'text/html' });
  // res.end('<h1>Node är fantastiskt</h1>');

  let filePath = path.join(__dirname, 'static', req.url === '/' ? 'index.html' : req.url);
  let extension = path.extname(filePath);
  let contentType = 'text/html';

  switch (extension) {
    case '.css':
      contentType = 'text/css';
      break;
    case '.js':
      contentType = 'text/javascript';
      break;
  }

  if (contentType === 'text/html' && extension === '') filePath += '.html';
  console.log(filePath);

  fs.readFile(path.join(filePath), (err, content) => {
    if (err) throw err;

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content, 'utf8');
  });
  // res.end('<h1>Start Page</h1>');

  // if (req.url === '/') {
  //   fs.readFile(path.join(__dirname, 'static', 'index.html'), (err, content) => {
  //     if (err) throw err;

  //     res.writeHead(200, { 'Content-Type': 'text/html' });
  //     res.end(content);
  //   });
  // res.end('<h1>Start Page</h1>');
});

// if (req.url === '/products') {
//   res.writeHead(200, { 'Content-Type': 'text/html' });
//   res.end('<h1>Products Page</h1>');
// }

// if (req.url === '/customers') {
//   const customers = [
//     {
//       name: 'Nisses lanthandel',
//     },
//     {
//       name: 'Åsas fisk',
//     },
//   ];

//   res.writeHead(200, { 'Content-Type': 'application/json' });
//   res.end(JSON.stringify(customers));
// }
// });

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log('Server is running'));

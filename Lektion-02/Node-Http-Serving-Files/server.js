const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  // Om anropet är till roten av applikationen ('/')
  // Då skapas en variabel som pekar på /static/index.html
  // Om inte så tar vi url värdet ur request objektet.
  let filePath = path.join(__dirname, 'static', req.url === '/' ? 'index.html' : req.url);
  // Hämta ut vad filen har för ändelse
  let extension = path.extname(filePath);
  // Vi sätter typen av innehåll till text/html som standard
  let contentType = 'text/html';

  // Vi behöver nu titta på vad för typ av fil är det som efterfrågars om inte html
  // Är det en css eller javascript fil som behöver laddas
  switch (extension) {
    case '.css':
      contentType = 'text/css';
      break;
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.jpg':
      contentType = 'image/jpg';
      break;
  }

  // Läs in filen med hjälp av filepath variabeln
  // content parametern kommer att ge oss innehållet i filen
  fs.readFile(path.join(filePath), (err, content) => {
    if (err) throw err;

    // Sätt header egenskapen Content-Type till vad som vi kommit fram till ovan
    res.writeHead(200, { 'Content-Type': contentType });
    // Returnera filen till klienten och tala om att encoding är utf8(standard inom webb världen)
    res.end(content, 'utf8');
  });
});

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

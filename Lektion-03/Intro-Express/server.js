const express = require('express');
const path = require('path');
// Skapa en server instans...
const app = express();

// Middleware...
app.use(express.static(path.join(__dirname, 'static')));

const PORT = process.env.PORT || 5001;
// Starta upp servern...
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

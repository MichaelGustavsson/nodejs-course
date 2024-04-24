# Server programmering med JavaScript och Node.js

Här finns kod för alla genomgångar under lektionerna
Under varje Lektion-## hittas den kod som jag använt för genomgångarna

I data katalogen hittas test data som vi använder i REST API genomgångarna.

I Postman katalogen finns en json fil som kan importeras i Postman med färdiga REST anrop.

För att köra varje kod exempel så måste npm install köras för varje projekt.

Från om med Lektion 4 så använder vi environment variabler som inte hittas i git repot som laddas ner. För att använda dem så måste en katalog config skapas i roten och i den behöver ni skapa en fil config.env och i den lägga till 2 variabler
NODE_ENV=development
PORT=portnummer som ni vill använda

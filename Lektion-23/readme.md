# Lektion 23

### Säkerhet, Dokumentation och Publicering

> Jag har skapat ett starter projekt som ni kan använda Er av under lektionen.
> Vi kommer att använda projektet för att lägga på säkerhet för diverse angrepp.
> Vi kommer även att skapa dokumentation för vårt api. Dessutom kommer vi att använda
> projektet för att publicera det till DigitalOcean.com.

#### Användning

Glöm inte att köra kommandot `npm install` för att installera alla beroenden.
Glöm inte heller att lägga till en config.env fil i katalogen config och lägga till följande inställningar:

```
NODE_ENV=development
PORT=<Port som ni vill använda>

JWT_SECRET=<Er egen hemlighet(secret)>
JWT_TTL=90d
JWT_COOKIE_TTL=90

MONGO_URI=<Anslutning till mongodb databasen>
```

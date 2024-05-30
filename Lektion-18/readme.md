# Start projekt inför sista stegen i backend Blockchain

Glöm inte att köra `npm i` för att installera alla beroenden i _package.json_.

Glöm sedan inte att lägga till en fil i **config** katalogen _config.env_

I konfigurations filen måste
följande inställningar finnas för PubNub

PUBLISH*KEY=*'Publiseringnyckeln'\_

SUBSCRIBE*KEY=*'Prenumerationsnyckeln'\_

SECRET*KEY=*'Privata nyckeln'\_

USER*ID=*'Valfritt id kan vara ett namn'\_

För att bekräfta att allt fungerar, öppna upp ett nytt terminalfönster och kör kommandot `npm test`för att köra vitest tester i projektet.

Om allt går bra så bör alla tester visa grönt.

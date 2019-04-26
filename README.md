# BasicUse

Det här är en applikation som ger dig ett webbgränssnitt som kan användas i två olika syften. Anting används  

## Kom igång på 5 minuter

Genomför nedanstående steg så kan du komma

1. Installera [Node.js](https://nodejs.org/en/download/)
2. Ladda ner applikationens källkod till din dator, antingen med `git` eller genom att [ladda ner en zip-fil](https://github.com/umea-kommun/BasicUse/archive/master.zip)
3. Öppna en kommandotolk och ställ dig i källkodsmappen och anropa följande kommando `npm install`
4. Du kan nu starta applikationen lokalt genom att köra följande kommando `npm run serve`

Efter detta har du en demo-installation av applikation tillgänglig på din dator. Öppna en webbläsare och gå till http://localhost:8080/ för att testa att använda e-tjänster. Du kan även gå till http://localhost:8080/admin för att som administratör skapa och redigera e-tjänster. 

**Notera** att applikationen är inställd att vara en demo-applikation, vilket innebär att all data sparas tillfälligt lokalt och att inloggning sker automatiskt med påhittade användarkonton.

## Nästa steg

För att kunna använda den här applikationen i ett produktions-scenario måste nedanstånde system tillföras.

### Autentisering

Applikationen kommer med inbyggt stöd för inloggning genom `Oauth2` och flödet `authorization_code`. Man kan använda sig av kommersiella saas-tjänster för detta ändamål men man har också möjligheten tillhandahålla en egen autentiseringsserver byggd på öppen mjukvara. På Umeå kommun använder vi oss av [IdentityServer4](http://docs.identityserver.io/en/latest/).

1. I applikationens [env-fil](https://github.com/umea-kommun/BasicUse/blob/master/.env) anger du `Oauth` som värde på konfigurationsvariabeln `VUE_APP_AUTH_CLASS`
2. Registrera två klienter på autentiseringsservern. Den ena klienten representerar den publika delen i applikationen, där medborgare loggar in. Den andra klienten representerar applikationens administrationsdel. Det är viktigt att dessa klienter använder sig av olika `scopes`, då det är dessa `scopes` applikationen använder för särskilja administratörer från medborgare. 
3. Ange den nya konfigurationen för autentisering i env-filen, under avsnittet "Authentication".

Applikationen förväntar sig att båda dessa inloggningar hanteras av samma autentiseringsserver. Ett tänkbart scenario vore att man hade två olika autentiseringsservrar, t.ex. Azure Active Directory för att logga in som administratör och en annan server för medborgare. För att möjliggöra detta måste man justera applikationens källkod så att den använder olika webbadresser till autentiseringsservern beroende på typ av inloggning. Ett annat förslag på alternativ vore att lägga en proxy framför autentiseringsservrarna som vidarebefordrar användaren till rätt server beroende på angivet klient-id eller scope. 

### Webbtjänster för att ta emot inskickade ärenden

Lorem te ipsum

### Webbtjänster för att lagra och exponera e-tjänster

Lorem te ipsum

## Övrigt

### Gå i produktion

Lorem te ipsum

### Azure, application insight

Lorem te ipsum

### Alternativ till autentisering

Lorem te ipsum

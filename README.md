![umea](https://umea.se/images/18.65771eb14bfe25fed29810/1426436622111/Umea_kommun.png)

# BasicUse

Umeå kommun har sedan en tid tillbaka arbetat med att ta fram en e-tjänstplattform byggd på dom senaste teknikerna på klient- och serversidan med Azure som hostingplattform. Den här applikationen, BasicUse, är en central del i denna plattform som används av medborgare för att via sin telefon eller dator initiera ärenden hos Umeå kommun. 

## Kom igång på 5 minuter

Genomför följande steg så har du på några minuter fått en applikation du kan använda för att skapa och publicera e-tjänster.

1. Installera [Node.js](https://nodejs.org/en/download/)
2. Ladda ner applikationens källkod till din dator, antingen med `git` eller genom att [ladda ner en zip-fil](https://github.com/umea-kommun/BasicUse/archive/master.zip)
3. Öppna en kommandotolk och ställ dig i källkodsmappen och anropa följande kommando `npm install`
4. Du kan nu starta applikationen lokalt genom att köra följande kommando `npm run serve`

Efter detta har du en demo-installation av applikation tillgänglig på din dator. Öppna en webbläsare och gå till http://localhost:8080/ för att testa att använda e-tjänster. Du kan även gå till http://localhost:8080/admin för att som administratör skapa och redigera e-tjänster. 

**Notera!** Den här applikationen är inställd att ge en demonstration av de funktioner som erbjuds, vilket innebär att all data sparas tillfälligt lokalt och att inloggning sker automatiskt med påhittade användarkonton.

---

### Nästa steg

För att kunna använda den här applikationen i ett produktions-scenario måste nedanstånde system tillföras.

#### Autentisering

1. Sätt upp en autentiseringsserver med stöd för `Oauth2` och flödet `authorization_code`. Man kan använda sig av kommersiella saas-tjänster för detta ändamål men man har också möjligheten tillhandahålla en egen autentiseringsserver byggd på öppen mjukvara. På Umeå kommun använder vi oss av [IdentityServer4](http://docs.identityserver.io/en/latest/).
1. I applikationens [env-fil](https://github.com/umea-kommun/BasicUse/blob/master/.env) anger du `Oauth` som värde på konfigurationsvariabeln `VUE_APP_AUTH_CLASS`
2. Registrera två klienter på autentiseringsservern. Den ena klienten representerar den publika delen i applikationen, där medborgare loggar in. Den andra klienten representerar applikationens administrationsdel. Det är viktigt att dessa klienter använder sig av olika `scopes`, då det är dessa `scopes` applikationen använder för särskilja administratörer från medborgare. 
3. Ange den nya konfigurationen för autentisering i env-filen, under avsnittet "Authentication".

Applikationen förväntar sig att båda dessa inloggningar hanteras av samma autentiseringsserver. Ett tänkbart scenario vore att man hade två olika autentiseringsservrar, t.ex. Azure Active Directory för att logga in som administratör och en annan server för medborgare. För att möjliggöra detta måste man justera applikationens källkod så att den använder olika webbadresser till autentiseringsservern beroende på typ av inloggning. Ett annat alternativ vore att lägga en proxy framför autentiseringsservrarna som vidarebefordrar användaren till rätt server beroende på angivet klient-id eller scope. 

#### API för att ta emot inskickade ärenden

När formulären i e-tjänsterna fyllts i och skickas in av medborgaren måste det finnas ett API som tar emot och sparar denna information på önskat sätt. När man bygger en e-tjänst har man möjlighet att konfigurera hur man vill att e-tjänsten ska integreras med bakomliggande system. Applikationen kommer förberedd med integrationskomponenter för e-post, sharepoint och Navet färdtjänst.

1. Sätt upp ett Rest-API som svarar på anropet som avfyras från applikationen när medborgaren skickar in ett formulär i en e-tjänst. Detta API ansvarar sedan för att skjuta vidare informationen till det system där informationen ska lagras. På Umeå kommun har vi byggt en .netcore-app som lägger upp varje inskickat formulär som ett meddelande i en Azure ServiceBus, som i sin tur vittjas av "serverlösa" funktioner (Azure Functions) direkt integrerade med systemen som är slutliga mottagare av informationen. 
2. Uppdatera konfigurationsvariabeln `VUE_APP_SEND_FORM_API_URL` med adressen till webbtjänsten. Man måste även implementera en API-rutt som kan ta emot test-inskick som görs av administratörer, adressen anges i variabeln `VUE_APP_TEST_SEND_FORM_API_URL`.

Vi har för avsikt att framöver släppa våran webbtjänst för att ta emot inskick, och tillhörande integrations-funktioner, som egna git-projekt.

#### Webbtjänster för att lagra och exponera e-tjänster

Lorem te ipsum

### Övrigt

#### Gå i produktion

Lorem te ipsum

#### Azure, application insight

Lorem te ipsum

### Alternativ till autentisering

Lorem te ipsum

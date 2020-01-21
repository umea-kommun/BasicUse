![umea](https://umea.se/images/18.65771eb14bfe25fed29810/1426436622111/Umea_kommun.png)

# BasicUse

Umeå kommun har sedan en tid tillbaka arbetat med att ta fram en **e-tjänstplattform** byggd på de senaste teknikerna på klient- och serversidan med Azure som hostingplattform. Den här applikationen, BasicUse, är en central del i denna plattform som används av medborgare för att från sin telefon eller dator initiera ärenden hos Umeå kommun. 

#### Innehållsförteckning

- [Kom igång på 5 minuter](#kom-igång-på-5-minuter)
- [Använda BasicUse i produktion](#använda-basicuse-i-produktion)
  - [Autentisering](#Autentisering)
  - [API för att ta emot inskickade ärenden](#API-för-att-ta-emot-inskickade-ärenden)
  - [API för att lagra och exponera e-tjänster](#API-för-att-lagra-och-exponera-e-tjänster)
- [Övrigt](#Övrigt)
  - [Ändra gränssnittets textdialoger](#Ändra-gränssnittets-textdialoger)
  - [Utveckla egen autentisering](#Utveckla-egen-autentisering)
  
  
  
## Kom igång på 5 minuter

Genomför följande steg så har du på några minuter fått upp en applikation som du kan använda för att skapa och publicera e-tjänster.

1. Installera [Node.js](https://nodejs.org/en/download/).
2. Ladda ner applikationens källkod till din dator, antingen med `git` eller genom att [ladda ner en zip-fil](https://github.com/umea-kommun/BasicUse/archive/master.zip).
3. Öppna en kommandotolk och ställ dig i källkodsmappen. Anropa därefter följande kommando `npm install`.
4. Starta applikationen lokalt genom att anropa kommandot `npm run serve` i kommandotolken.

Nu kan du öppna en webbläsare och gå till http://localhost:8080/ för att testa att använda e-tjänster. Du kan även gå till http://localhost:8080/admin för att som administratör testa att skapa och redigera e-tjänster. 

**Notera!** Den här applikationen är inställd att ge en **demonstration av de funktioner som erbjuds**, vilket innebär att all data sparas tillfälligt lokalt och att inloggning sker automatiskt med påhittade användarkonton.


## Använda BasicUse i produktion

Läs mer på [wikin](https://github.com/umea-kommun/BasicUse/wiki) om hur du använder BasicUse i ett produktionscenario.


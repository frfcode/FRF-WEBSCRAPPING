# FRF-WEBSCRAPPING - WEB SCRAPING GENERATOR

## TECHNOLOGY

- Nodejs v18.14
- Express
- Javascript
- HTML
- CSS
- Puppeteer
- Cheerio

## COMMANDS

init dev server

```
npm run dev
```

run scraping news with wthr

```
npm run news
```

run scraping indeed

```
npm run indeed
```

run scraping airbnb

```
npm run airbnb
```

run scraping google-events

```
npm run google-events
```

```
npm run espn-sports
```

## INSTRUCTIONS

Download project and use the next command:

<!-- prettier-ignore -->
``` 
npm i 
```

in the folder src/utils have a file with the name **kit.js**, this file have all functions for web scraping.
in the folder src/scraping have all code for generate results of scraping.
in the folder src/router have all code for manager the routes of the project.

when finish of execute the code of scraping, this generate output folder in the project in format .json.

**NOTE**

in the folder src/scraping check the code and modify for your region and your search, because by defaults the data it's configure for the region of indianapolis USA.

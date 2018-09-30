# This is *GLOB* 

## It's a scraping framework

It has a built in **plugin** for the geman KBA (Kraftfahrt - Bundesamt) <br/>
because, why not? That is what I needed in form of structured data. <br/>
This you can use as a template for your own plugins.

---
## Under the hood

GLOB uses `express` to provide the endpoints of the structured data <br/>
and `cheerio` to scrape whatewer you request with the `request` module.

---
## How it works - now.

This version of the framework still reelies on your natural intelligence <br/>
for understanding how the website you try to scrape is structured and then <br/>
use `cheerio` to parse that structure: https://github.com/cheeriojs/cheerio <br/>

You should encapsulate your `cheerio` logic into its own module like the <br/>
one provided for the KBA website: **_./plugins/kba.js_**

After your module is done, expose the methods throu a new `express` endpoint.

---
## Using the framework

1. clone this project
2. run `npm install`
3. run `npm start`

---
## The near future

> **Machine learning**

---
## The far future

> **Artificial intelligence**

---
## Here is what it looks like

### Rendered Website, no public API:
![Image](media/kba_was.png) 

### Machine consumable version, JSON:
![Image](media/kba_as_json.png)

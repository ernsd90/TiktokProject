//Get all json data

const { exit } = require('process');
const puppeteer = require('puppeteer');
const fs = require('fs').promises; //for working with files
const fetch = require('node-fetch');


const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve,milliseconds));
};


let browser;


(async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  const baseURL = "https://www.tiktok.com/@englishwithroop";

  const startId = 1;
  const qty = 1;

  page.setViewport({width: 1380, height: 868});
  //await loadCookie(page); //load cookie

  await page.goto(baseURL, { 
		waitUntil: 'networkidle0',
        timeout: 300000, 
	}); 

  sleep(1000);
  const json = await page.content(); 

  await fs.mkdir('json', { recursive: true });
  await fs.writeFile('json/apnacollage_fullcourse.json', json);

  console.log(json)
 
  //await browser.close();
})()
  .catch(err => console.error(err))
  .finally(() => browser?.close());


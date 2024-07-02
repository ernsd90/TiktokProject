const { exit } = require('process');
const puppeteer = require('puppeteer');
const fs = require('fs').promises; //for working with files

const { saveJson,sleep } = require('./myfunction.js');


const website = 'https://www.tiktok.com/';


(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    page.setViewport({ width: 1080, height: 768 });
    //await loadCookie(page); //load cookie

 
    await page.goto(website, {
        waitUntil: 'load',
        timeout: 300000,
    });

    sleep(1000);

    const Script_Selector = "#__UNIVERSAL_DATA_FOR_REHYDRATION__";
    const new_data = await page.$eval(Script_Selector, el => el.innerText);
    console.log(new_data);



    await saveJson(new_data,'homepage'); //save cookie

   // await browser.close();
})();
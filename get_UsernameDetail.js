const { exit } = require('process');
const puppeteer = require('puppeteer');
const fs = require('fs').promises; //for working with files

const { saveJson,loadJson } = require('./myfunction.js');





(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    page.setViewport({ width: 1080, height: 768 });
    //await loadCookie(page); //load cookie


    loadJson('tiktok_usernames').then(async (Jsondata) => {

        for (const username of Jsondata) {
            const website = `https://www.tiktok.com/@${username}`;
            await page.goto(website, {
                waitUntil: 'load',
                timeout: 300000,
            });
            const Script_Selector = "#__UNIVERSAL_DATA_FOR_REHYDRATION__";
            const new_data = await page.$eval(Script_Selector, el => el.innerText);

            // Parse the JSON string before saving
            let parsedData;
            try {
                parsedData = JSON.parse(new_data);
            } catch (error) {
                console.error(`Failed to parse JSON for username ${username}:`, error);
                continue; // Skip this username if JSON parsing fails
            }
            
            console.log(parsedData);
            await saveJson(parsedData, `username/${username}`); //save cookie
            await browser.close();
        }

    }).catch(error => {
        console.error('Error processing courses:', error);
    });




   // await browser.close();
})();
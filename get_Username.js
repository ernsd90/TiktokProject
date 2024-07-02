const { exit } = require('process');
const puppeteer = require('puppeteer');
const fs = require('fs').promises; //for working with files

const { saveJson,sleep } = require('./myfunction.js');


const website = 'https://www.tiktok.com/foryou';


const username_container_sel = ".css-1so7d0a-DivItemContainer";
const username_sel = ".css-fz9tz3-StyledLink-StyledAuthorAnchor";

// Function to extract usernames
async function extractUsernames(page, containerSelector, usernameSelector) {
    await page.waitForSelector(containerSelector);

    const parentElements = await page.$$(containerSelector);
    if (parentElements.length === 0) {
        throw new Error('No parent elements found with the selector: ' + containerSelector);
    }

    const usernames = await page.$$eval(containerSelector, (parentElements, usernameSelector) => {
        return parentElements.map(parent => {
            const usernameElement = parent.querySelector(usernameSelector);
            return usernameElement ? usernameElement.innerText : null;
        }).filter(text => text !== null);
    }, usernameSelector);

    return usernames;
}

// Function to scroll the page
async function scrollPage(page) {
    await page.evaluate(() => {
        window.scrollBy(0, window.innerHeight);
    });
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for new content to load
}


// Main function
(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({ width: 1380, height: 768 });

    // Replace with the URL you want to scrape
    await page.goto(website, { waitUntil: 'load', timeout: 300000 });

    let allUsernames = [];
    let newUsernames = [];

    do {
        newUsernames = await extractUsernames(page, username_container_sel, username_sel);
        console.log('Extracted usernames:', newUsernames);

        allUsernames = [...new Set([...allUsernames, ...newUsernames])];
        
        // Save new usernames after each extraction cycle
        await saveJson(allUsernames, 'tiktok_usernames');

        await scrollPage(page);
    } while (newUsernames.length > 0);

    console.log('All usernames:', allUsernames);

    await browser.close();


})();
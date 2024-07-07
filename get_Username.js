const { exit } = require('process');
const puppeteer = require('puppeteer');
const fs = require('fs').promises; // for working with files

const { saveJson, sleep } = require('./myfunction.js');

const website = 'https://www.tiktok.com/foryou';

const username_container_sel = '[data-e2e="recommend-list-item-container"]';
const username_sel = '[data-e2e="video-author-uniqueid"]';

// Function to extract usernames
async function extractUsernames(page, containerSelector, usernameSelector) {
    console.log('Waiting for container selector:', containerSelector);
    await page.waitForSelector(containerSelector);

    const parentElements = await page.$$(containerSelector);
    console.log('Found parent elements:', parentElements.length);

    if (parentElements.length === 0) {
        throw new Error('No parent elements found with the selector: ' + containerSelector);
    }

    const usernames = await page.$$eval(containerSelector, (parentElements, usernameSelector) => {
        return parentElements.map(parent => {
            const usernameElement = parent.querySelector(usernameSelector);
            return usernameElement ? usernameElement.innerText : null;
        }).filter(text => text !== null);
    }, usernameSelector);

    console.log('Extracted usernames in function:', usernames);
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
    await page.setViewport({ width: 1300, height: 768 });

    console.log('Navigating to:', website);
    await page.goto(website, { waitUntil: 'load', timeout: 30000 });
    console.log('Page loaded');

    let allUsernames = [];
    let newUsernames = [];

    do {
        console.log('Starting username extraction cycle');
        newUsernames = await extractUsernames(page, username_container_sel, username_sel);
        console.log('Extracted usernames:', newUsernames);

        allUsernames = [...new Set([...allUsernames, ...newUsernames])];
        
        // Save new usernames after each extraction cycle
        await saveJson(allUsernames, 'tiktok_usernames');
        console.log('Saved usernames to file');

        await scrollPage(page);
        console.log('Page scrolled');
    } while (newUsernames.length > 0);

    console.log('All usernames:', allUsernames);

    await browser.close();
})();

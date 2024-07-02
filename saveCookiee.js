const { exit } = require('process');
const puppeteer = require('puppeteer');
const fs = require('fs').promises; //for working with files

const website = 'https://www.apnacollege.in/';



//save cookie function
const saveCookie = async (page) => {
    const cookies = await page.cookies();
    const cookieJson = JSON.stringify(cookies, null, 2);
    await fs.mkdir('cookie', { recursive: true });
    await fs.writeFile('cookie/cookies.json', cookieJson);
}

//load cookie function
const loadCookie = async (page) => {
    const cookieJson = await fs.readFile('cookie/cookies.json');
    const cookies = JSON.parse(cookieJson);
    await page.setCookie(...cookies);
}

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    page.setViewport({ width: 1080, height: 768 });
    //await loadCookie(page); //load cookie

 

    await page.goto(website, {
        waitUntil: 'load',
        timeout: 300000,
    });

    const user_login = await page.waitForSelector("#menuItem5");
    user_login.click();
    await page.waitForTimeout(1000); // 1000 milliseconds = 1 second


    await page.type('.-pass-input', 'Navjot@2011');
    await page.type('.-email-input', 'ernsd90@gmail.com');

    await Promise.all([
        page.click('#submitLogin'),
        page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 300000 }),
    ]);
    await saveCookie(page); //save cookie

    await browser.close();
})();
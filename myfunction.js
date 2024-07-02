const fs = require('fs').promises; // for working with files


const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve,milliseconds));
};

// Save cookie function
const saveCookie = async (page) => {
    const cookies = await page.cookies();
    const cookieJson = JSON.stringify(cookies, null, 2);
    await fs.mkdir('cookie', { recursive: true });
    await fs.writeFile('cookie/cookies.json', cookieJson);
};

// Load cookie function
const loadCookie = async (page) => {
    const cookieJson = await fs.readFile('cookie/cookies.json');
    const cookies = JSON.parse(cookieJson);
    await page.setCookie(...cookies);
};

// Save cookie function
const saveJson = async (jsondata,filename) => {
    const dataJson = JSON.stringify(jsondata, null, 2);
    await fs.mkdir('json', { recursive: true });
    await fs.writeFile(`json/${filename}.json`, dataJson);
};

const loadJson = async (filename) => {
    const data = await fs.readFile(`json/${filename}.json`, 'utf8');
    return JSON.parse(data);
};

module.exports = {
    saveCookie,
    loadCookie,
    saveJson,
    loadJson,
    sleep,
};

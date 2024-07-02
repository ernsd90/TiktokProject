//


const { exit } = require('process');
const puppeteer = require('puppeteer');
const fs = require('fs').promises; //for working with files

const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve,milliseconds));
};


//load cookie function
const loadJson = async () => {
    // Load and parse the JSON file
    const courseJson = await fs.readFile('json/jimmy.json', 'utf8');
    const allData = JSON.parse(courseJson);

    const allSectionsData = allData.__DEFAULT_SCOPE__['webapp.user-detail']['userInfo'];
    const user = allSectionsData['user'];
    const usershareMeta = allSectionsData['shareMeta'];
    const stats = allSectionsData['stats'];
    const uniqueId = user['uniqueId'];
    console.log(uniqueId);
    


    //return allSectionsData; // Optional: return courses if needed elsewhere

}

loadJson().then(() => {
    console.log('Finished processing all courses.');
}).catch(error => {
    console.error('Error processing courses:', error);
});

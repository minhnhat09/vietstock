const puppeteer = require('puppeteer');

let scrape = async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    const urlSeloger = 'http://www.seloger.com/list.htm?tri=initial&idtypebien=2,1&pxmax=200000&idtt=2,5&naturebien=1,2,4&cp=75';
    await page.goto(urlSeloger);
    await page.waitFor(1000);

    const result = await page.evaluate(() => {
        // title_nbresult
        // let title = document.querySelector('.title_nbresult').innerText;
        let data = [];
        let elements = document.querySelectorAll('.c-pa-info');
        
        for (const element of elements) {
            let title = element.childNodes[2].children[0]; // Select the title

            data.push({title}); 
        }
        return data;
        return {
            title
        }

    });

    browser.close();
    return result;
};

scrape().then((value) => {
    console.log(value); // Success!
});
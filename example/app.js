/* const puppeteer = require('puppeteer');

async function getPic() {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto('https://google.com');
  await page.screenshot({path: 'google.png'});

  await browser.close();
}

getPic(); */
const puppeteer = require('puppeteer');

let scrape = async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    await page.goto('http://books.toscrape.com/');
    /* await page.click('#default > div > div > div > div > section > div:nth-child(2) > ol > li:nth-child(1) > article > div.image_container > a > img'); */
    await page.waitFor(1000);

    const result = await page.evaluate(() => {
        /* let title = document.querySelector('h1').innerText;
        let price = document.querySelector('.price_color').innerText;
 */
        let data = [];
        let elements = document.querySelectorAll('.product_pod');
        
        for (const element of elements) {
            let title = element.childNodes[5].innerText; // Select the title
            let price = element.childNodes[7].children[0].innerText; // Select the price

            data.push({title, price}); 
        }
        return data;
    });

    browser.close();
    return result;
};

scrape().then((value) => {
    console.log(value); // Success!
});
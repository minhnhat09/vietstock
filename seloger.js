const puppeteer = require("puppeteer");

let scrape = async () => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    page.on("console", msg => console.log("PAGE LOG:", msg.text()));

    const finalResult = [];
    for (let i = 1; i < 3; i++) {
      const urlSeloger = `https://www.seloger.com/list.htm?tri=initial&idtypebien=2,1&pxmax=200000&idtt=2,5&naturebien=1,2,4&cp=75&LISTING-LISTpg=${i}`;
      console.log("urlseloger", i);
      await page.goto(urlSeloger);
      await page.waitFor(1000);
      const result = await page.evaluate(() => {
        let resultData = [];
        let elements = document.querySelectorAll(".c-pa-info");
        for (const element of elements) {
          let data = {};
          for (let i = 0; i < element.children.length; i++) {
            const node = element.children[i];
            if (node) {
              data[i] = node.innerText;
            }
          }
          resultData.push(data);
        }
        return resultData;
      });
      finalResult.push(...result);
    }

    browser.close();
    return finalResult;
  } catch (error) {
    console.log(error);
  }
};

scrape()
  .then(value => {
    console.log(value);
  })
  .catch(e => {
    console.log(e);
  });

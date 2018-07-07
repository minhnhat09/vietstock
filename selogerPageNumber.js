const puppeteer = require("puppeteer");

let scrape = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const urlSeloger =
    "http://www.seloger.com/list.htm?tri=initial&idtypebien=2,1&pxmax=200000&idtt=2,5&naturebien=1,2,4&cp=75";
  let d1 = new Date();
  await page.goto(urlSeloger);
  let d2 = new Date();
  console.log("diff", d2 - d1);
  await page.waitFor(1000);
  
  page.on("console", msg => console.log("PAGE LOG:", msg.text()));
  try {
      const result = await page.evaluate(() => {
          let pageNumbers = document.querySelector(".pagination-number");
          console.log(pageNumbers.children[1].innerHTML);
          await page.click(pageNumbers.children[1]);
          await page.waitFor(1000);

    });

    browser.close();
    return result; 
  } catch (error) {
    console.log("error result", error);
  }
};

scrape()
  .then(value => {
    console.log(value);
  })
  .catch(e => {
    console.log("error scrape", e);
  });

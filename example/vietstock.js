let scrape = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  page.on('console', (log) => console[log._type](log._text));
  const url = 'http://finance.vietstock.vn/VNM/tai-chinh.htm';
  await page.goto(url);
  await page.waitFor(1000);
  await page.click('a#CDKT.Menu_BCTC_Link');
  const result = await page.evaluate(() => {
    let data = [];
    let elements = document.querySelectorAll('.BR_tBody_colName');
    
    for (const element of elements) {
      console.log(element.innerText);
      let title = element.innerText; // Select the title
      // let price = element.childNodes[7].children[0].innerText; // Select the price

      data.push({ title });
    }
    return data;
  });
  await browser.close();
  return result;
};

scrape().then((value) => {
  console.log(value); // Success!
});
const puppeteer = require("puppeteer");
const fs = require("fs");
let scrape = async () => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    page.on("console", msg => console.log("PAGE LOG:", msg.text()));
    const codePostal = "75";
    const price = 200000;
    const finalResult = [];
    for (let i = 1; i < 2; i++) {
      const urlSeloger = `https://www.seloger.com/list.htm?tri=initial&idtypebien=2,1&pxmax=${price}&idtt=2,5&naturebien=1,2,4&cp=${codePostal}&LISTING-LISTpg=${i}`;
      console.log(
        `crawl info for location: ${codePostal}, price: ${price}, page ${i}`
      );
      await page.goto(urlSeloger);
      await page.waitFor(1000);
      const result = await page.evaluate(() => {
        let resultData = [];
        let elements = document.querySelectorAll(".c-pa-info");
        for (const element of elements) {
          // TODO: lay toan bo anh trong phan (".c-pa-pic")
          let data = {};
          // for each element, travel their attribute: Name, price, description, location
          for (let i = 0; i < element.children.length; i++) {
            const node = element.children[i];
            if (node) {
              if (i === 0) {
                data["href"] = node.getAttribute("href");
                // 'Appartement en viager
                data["typeAppartement"] = node.innerText;
              } else if (i === 1) {
                // '3 p 1 ch 85 m²'
                data["description"] = node.innerText;
              } else if (i === 2) {
                // 'Bouquet 145 500 € '
                data["price"] = node.innerText;
              } else if (i === 3) {
                // 'ou 605€/mois*'
                data["pricePerMonth"] = node.innerText;
              } else if (i === 4) {
                //  'Paris 20ème'
                data["location"] = node.innerText;
              } else if (i === 6) {
                // Agence: urlSeloger, urlSiteWeb, name, logo
                let agence = {};

                // console.log('children', j , node.children[0].innerHTML);
                if (node.children[0] && node.children[0].children) {
                  console.log("children", node.children[0].children[0]);
                  let logoUrl =
                    node.children[0].children[0].attributes["data-lazy"].value;
                  let agenceName =
                    node.children[0].children[0].attributes["alt"].value;

                  agence = { logoUrl, agenceName };
                }

                data["agence"] = agence;
              } else if (i === 7) {
                // Contact: mail, tel
                let contact = {};
                data["contact"] = contact;
              }
              // data[i] = node.innerText;
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
    let result = JSON.stringify(value);
    /* fs.writeFile("result.json", result, function(err) {
      if (err) {
        return console.log(err);
      }

      console.log("The file was saved!");
    }); */
  })
  .catch(e => {
    console.log(e);
  });

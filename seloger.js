const puppeteer = require("puppeteer");
const fs = require("fs");

let wait = ms => {
  return new Promise(resolve => setTimeout(() => resolve(), ms));
};
let scrape = async () => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    page.on("console", msg => console.log("PAGE LOG:", msg.text()));
    const codePostal = "75";
    const price = 200000;
    const allPages = [];
    const urlSeloger = `https://www.seloger.com/list.htm?tri=initial&idtypebien=2,1&pxmax=${price}&idtt=2,5&naturebien=1,2,4&cp=${codePostal}`;
    await page.goto(urlSeloger);
    // all post for the criteria (paris, 200 000)
    const postsNumber = await page.evaluate(() => {
      let title = document.querySelector(".title_nbresult");
      if (title) {
        return title.innerText;
      }
    });
    console.log(postsNumber);
    // Convert string (1000 annonces) to number
    let numRegex = /\d+/g;
    let numberFormat = Number(postsNumber.match(numRegex).join(""));
    const postPerPage = 20;
    const numberOfPages = Math.ceil(numberFormat / postPerPage);
    for (let i = 1; i < 2; i++) {
      const urlSeloger = `https://www.seloger.com/list.htm?tri=initial&idtypebien=2,1&pxmax=${price}&idtt=2,5&naturebien=1,2,4&cp=${codePostal}&LISTING-LISTpg=${i}`;
      console.log(
        `crawl info for location: ${codePostal}, price: ${price}, page ${i}`
      );
      await page.goto(urlSeloger, { waitUntil: "load" });

      // Get the height of the rendered page
      const bodyHandle = await page.$("body");
      const { height } = await bodyHandle.boundingBox();
      await bodyHandle.dispose();

      // Scroll one viewport at a time, pausing to let content load
      const viewportHeight = page.viewport().height;
      let viewportIncr = 0;
      while (viewportIncr + viewportHeight < height) {
        await page.evaluate(_viewportHeight => {
          window.scrollBy(0, _viewportHeight);
        }, viewportHeight);
        await wait(500);
        viewportIncr = viewportIncr + viewportHeight;
      }

      // Scroll back to top
      await page.evaluate(_ => {
        window.scrollTo(0, 0);
      });

      // await page.waitFor(1000);
      const onePage = await page.evaluate(() => {
        let resultData = [];
        let annonceElement = document.querySelectorAll(".c-pa-list");
        for (const annonce of annonceElement) {
          let data = {};
          data["idAnnoucement"] = annonce.getAttribute("id");
          let classVisual = annonce.querySelectorAll(".c-pa-visual");
          for (const element of classVisual) {
            let images = [];
            let imagesElement = element.getElementsByTagName("img");
            for (const image of imagesElement) {
              let srcTag = image.getAttribute("src");
              images.push(srcTag);
            }
            data["images"] = images;
          }
          let classInfo = annonce.querySelectorAll(".c-pa-info");
          for (const element of classInfo) {
            // TODO: lay toan bo anh trong phan (".c-pa-pic")
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
                  if (
                    node.children[0] &&
                    node.children[0].children &&
                    node.children[0].children[0] &&
                    node.children[0].children[0].attributes &&
                    node.children[0].children[0].attributes["data-lazy"] &&
                    node.children[0].children[0].attributes["alt"]
                  ) {
                    let logoUrl =
                      node.children[0].children[0].attributes["data-lazy"]
                        .value;
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
        }

        return resultData;
      });

      allPages.push(...onePage);
    }

    browser.close();
    return allPages;
  } catch (error) {
    console.log("error all pages function", error);
  }
};

scrape()
  .then(value => {
    console.log(value.length);
    let result = JSON.stringify(value);
    fs.writeFile("result.json", result, function(err) {
      if (err) {
        return console.log(err);
      }

      console.log("The file was saved!");
    });
  })
  .catch(e => {
    console.log("error scrape function", e);
  });

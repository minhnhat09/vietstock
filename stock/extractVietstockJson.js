const axios = require("axios");
const $ = require("jquery");
const jsdom = require("jsdom");
const fs = require("fs");
const path = require("path");
const util = require('util');
fs.readFile = util.promisify(fs.readFile);
fs.writeFile = util.promisify(fs.writeFile);
const url =
  "http://finance.vietstock.vn/Controls/Report/Data/GetReport.ashx?rptType=CDKT&scode=VNM&bizType=1&rptUnit=1000000&rptTermTypeID=1&page=1";
let extractJson = async (option) => {
  // let response = await axios.get(url);
  try {
    let fileName = path.join(__dirname, "sample", `${option}.html`);
    console.log("start read file", fileName);
    let data = await fs.readFile(fileName);
    const html = data.toString("utf8");
    // const html = response.data;
    const { JSDOM } = jsdom;
    const dom = new JSDOM(html);
    const $ = require("jquery")(dom.window);
    let items = $("#idBR_thead .BR_colHeader_Time");
    let headers = [];
    let col0 = {};
    let col1 = {};
    let col2 = {};
    let col3 = {};

    for (var i = 0; i < items.length; i++) {
      let e = $(items[i])
        .text()
        .trim();
      headers.push(e);
    }
    let header0 = headers[0];
    let header1 = headers[1];
    let header2 = headers[2];
    let header3 = headers[3];
    // list of tr
    let ibody = $("#BR_tBody tr");
    // .not('.rpt_chart');
    let bodyJson = [];
    for (let i = 0; i < ibody.length; i++) {
      const element = $(ibody[i]);
      // tim td trong moi row
      let row = [];
      let rowSelected = $(element.children()).not(".FR_tBody_colUnit");
      for (let j = 1; j < rowSelected.length; j++) {
        const colSelected = $(rowSelected[j]).text();
        row.push(colSelected);
      }
      // Create a object ("loi nhuan":55)
      col0[$(rowSelected[0]).text()] = row[0];
      col1[$(rowSelected[0]).text()] = row[1];
      col2[$(rowSelected[0]).text()] = row[2];
      col3[$(rowSelected[0]).text()] = row[3];
    }
    let table = {};
    table[header0] = col0;
    table[header1] = col1;
    table[header2] = col2;
    table[header3] = col3;
    // console.log(table);
    let fileNameExport = path.join(__dirname, `${option}.json`);

    let result = await fs.writeFile(fileNameExport, JSON.stringify(table), encoding = "utf8");
    console.log("end of write file");
  } catch (error) {
    console.error(error);
  }
};
module.exports = {
  extractJson
}

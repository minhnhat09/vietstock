const axios = require('axios');
const $ = require('jquery');
const jsdom = require("jsdom");
const url = "http://finance.vietstock.vn/Controls/Report/Data/GetReport.ashx?rptType=CDKT&scode=VNM&bizType=1&rptUnit=1000000&rptTermTypeID=1&page=1'";
let extractJson = async () => {
    let response = await axios.get(url);
    const html = response.data;
    const { JSDOM } = jsdom;
    const dom = new JSDOM(html);
    const $ = (require('jquery'))(dom.window);
    let items = $("#idBR_thead .BR_colHeader_Time");
    let headers = []
    for (var i = 0; i < items.length; i++) {
        let e = $(items[i]).text();
        headers.push(e);
    }
    // list of tr
    let ibody = $('#BR_tBody tr');
    // .not('.rpt_chart');
    let bodyJson = [];
    for (let i = 0; i < ibody.length; i++) {
        const element = $(ibody[i]);
        // tim td trong moi row
        let row = [];
        let tdSelected = $(element.children()).not('.FR_tBody_colUnit');
        for (let j = 0; j < tdSelected.length; j++) {
            const td = $(tdSelected[j]).text();
            row.push(td);
        }
        bodyJson.push(row);
    }
    let table = {
        tHead: headers,
        tbody: bodyJson
    } 
    console.log(table);
}
extractJson()

(function () {
  const fs = require('fs');
  const seloger = JSON.parse(fs.readFileSync('./resultTest.json', 'utf8'));
  const cleanDataSeloger = () => {
    return result = seloger.map(sl => {
      sl.homeDetail = cleanDescription(sl.description);
      let priceInNumber = Number(sl.price.match(/\d+/g).join(""));
      // sl.moyenPrice = Number(sl.price.match(/\d+/g).join("")) / Number(sl.surface);
      let surfaceInNumber = Number(sl.homeDetail.surface.replace(',','.'));
      if(priceInNumber && surfaceInNumber){
        sl.moyenPrice = priceInNumber/surfaceInNumber;
      }
      console.log(sl.price, sl.homeDetail.surface, priceInNumber/Number(sl.homeDetail.surface.replace(',','.')));
      // console.log(priceNumber);
    });
  }
  const cleanDescription = (description) => {
    let arr = description.split(" ");
    let homeDetail = {};
    if (arr[3] && arr[3] === 'ch') {
      if (arr[0]) {
        homeDetail.piece = arr[0];
      }
      if (arr[2]) {
        homeDetail.chambre = arr[2];
      }
      if (arr[4]) {
        homeDetail.surface = arr[4];
      }
    } else if (arr[3] && arr[3] === 'm²') {
      if (arr[0]) {
        homeDetail.piece = arr[0];
      }
      if (arr[2]) {
        homeDetail.surface = arr[2];
      }
      if (arr[4]) {
        homeDetail.etage = arr[4];
      }
    }
    return homeDetail;
  }
  cleanDataSeloger();
})();

const { extractJson } = require('./extractVietstockJson');

let main = async () => {
  await extractJson("BCTT");
  await extractJson("CDKT");
  await extractJson("CSTC");
  await extractJson("CTKH");
  await extractJson("KQKD");
  await extractJson("LCTT");
  console.log("end of extracting");
}

main();
const fs = require("fs");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const nameFile = __dirname + "/acme_worksheet.csv";
let results = [];

function convertDate(object) {
  item = object.Date;
  let arrayDate = item.split(" ");
  let indexMonth =
    "JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(arrayDate[0]) / 3 + 1;
  if (indexMonth < 10) indexMonth = "0" + indexMonth;
  object.Date = arrayDate[2] + "-" + indexMonth + "-" + arrayDate[1];
  return object.Date;
}

fs.createReadStream(nameFile)
  .pipe(csv())
  .on("data", (data) => {
    results.push(data);
  })
  .on("end", () => {
    let strDate = results.map((object) => convertDate(object));
    let strName = results.map((object) => object["Employee Name"]);
    strName.forEach((item) => {
      if (!arrayName.includes(item)) arrayName.push(item);
    });
    strDate.forEach((item) => {
      if (!arrayDate.includes(item)) arrayDate.push(item);
    });
  });

const fs = require("fs");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const nameFile = __dirname + "/acme_worksheet.csv";
let results = [];
let arrayDate = [];
let arrayName = [];

function convertDate(object) {
  item = object.Date;
  let arrayDate = item.split(" ");
  let indexMonth =
    "JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(arrayDate[0]) / 3 + 1;
  if (indexMonth < 10) indexMonth = "0" + indexMonth;
  object.Date = arrayDate[2] + "-" + indexMonth + "-" + arrayDate[1];
  return object.Date;
}

function getHoursWork(date, objPerson) {
  let hours;
  objPerson.forEach((obj) => {
    if (obj.Date == date) hours = obj["Work Hours"];
  });
  return hours;
}

function getDataPerson(results, arrName, arrDate) {
  let objPersonHours = [];
  let resPerson = [];
  for (let i = 0; i < arrName.length; i++) {
    resPerson.push(arrName[i]);
    objPersonHours = results.filter((item) => {
      return item["Employee Name"] == resPerson[i].nameDate ? true : false;
    });
    let arrayDatePerson = objPersonHours.map((obj) => obj.Date);
    for (let j = 0; j < arrDate.length; j++) {
      let datePerson = arrDate[j].id;
      let workHours;
      if (!arrayDatePerson.includes(arrDate[j].title)) {
        workHours = 0;
      } else {
        workHours = getHoursWork(arrDate[j].title, objPersonHours);
      }
      resPerson[i][datePerson] = workHours;
    }
  }
  return resPerson;
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
    arrayDate = arrayDate.map((date, index) => {
      return { id: date, title: date };
    });
    arrayName = arrayName.map((item) => {
      return { nameDate: item };
    });
    arrayName = getDataPerson(results, arrayName, arrayDate);
    const csvWriter = createCsvWriter({
      path: "resultsData.csv",
      header: [{ id: "nameDate", title: "Name / Date" }, ...arrayDate],
    });
    csvWriter
      .writeRecords(arrayName)
      .then(() => console.log("The CSV file was written successfully"));
  });

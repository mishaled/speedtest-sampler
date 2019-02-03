const { testSpeed } = require("./testSpeed");
const { writeEntry } = require("./spreadsheets");

testSpeed()
  .then((speed) => {
    return writeEntry(speed);
  })
  .catch((err) => {
    console.error(err);
  });
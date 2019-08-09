var pafSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("PAF 2019");
var headersPAF = pafSheet
  .getRange(3, 1, 1, pafSheet.getLastColumn())
  .getDisplayValues(); //might need to be changed if header row is flexible
var phoneRegex = /\d+/g;
var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// write something that gets mad if a header has a space at the end.

function onEdit(e) {
  var range = e.range;
  var column = range.getColumn();
  var value = range.getValue();
  var emailColumn = headersPAF[0].indexOf("Email") + 1;
  var phoneColumn = headersPAF[0].indexOf("Phone") + 1;
  if (value === "") {
    //allows delete
    return;
  }
  if (column === emailColumn) {
    //validates Email
    if (!emailRegex.test(value)) {
      range.setBorder(true, true, true, true, false, false, "red", null);
    } else {
      range.setBorder(true, true, true, true, false, false, "black", null);
    }
  } else if (column === phoneColumn) {
    //validates and formats phone number
    formatPhone(JSON.stringify(value), range);
  }
}

function testFormatPhone() {
  var range = pafSheet.getRange("G62");
  var value = range.getDisplayValue();
  formatPhone(value, range);
}

function formatPhone(value, range) {
  var matches = value.match(phoneRegex);
  var phoneString = matches.join("");
  if (value.length < 10) {
    range.setValue(value + " is less than 10 digits. Please re-enter.");
    return;
  }
  if (value.indexOf("less") > -1) {
    return;
  }
  if (phoneString.length > 10) {
    var length = phoneString.length;
    var internationalFormat =
      "+" +
      phoneString.slice(0, length - 10) +
      " " +
      phoneString.slice(length - 10);
    range.setValue(internationalFormat);
    return;
  }
  range.setValue(phoneString);
}

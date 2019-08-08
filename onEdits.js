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
      Logger.log("not an email");
    }
  } else if (column === phoneColumn) {
    //validates and formats phone number
    formatPhone(JSON.stringify(value), range);
  }
}

function formatPhone(value, range) {
  var matches = value.match(phoneRegex);
  var phoneString = matches.join("");
  if (phoneString.length > 10) {
    var length = phoneString.length;
    var internationalFormat =
      "+" +
      phoneString.slice(0, length - 10) +
      " " +
      phoneString.slice(length - 10);
    range.setValue(internationalFormat);
  } else if (phoneString.length < 10) {
    range.setValue(phoneString + " is less than 10 digits. Please re-enter."); // for some reason inserts "10" after the phone number?
  } else {
    range.setValue(phoneString);
  }
}

function convertToISO(aDate) {
  var now = new Date(aDate); // Fri Feb 20 2015 19:29:31 GMT+0530 (India Standard Time) 
  var isoDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();
  //OUTPUT : 2015-02-20T19:29:31.238Z
  return isoDate;
}

function removeTimezone(aDate) {
  var now = new Date(aDate); // Fri Feb 20 2015 19:29:31 GMT+0530 (India Standard Time) 

  // Remove +1:00 from timestamp, because Rails returns the timestamp with the timezone.
  var isoDate = new Date(now.getTime()).toISOString();
  return isoDate;
}

export {
  convertToISO,
  removeTimezone
}

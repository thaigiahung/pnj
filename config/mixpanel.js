// grab the Mixpanel factory
var Mixpanel = require('mixpanel');

// create an instance of the mixpanel client
// real
var mixpanel = Mixpanel.init('800fa5ee188a162a972630120c754bf9'); 
// test
// var mixpanel = Mixpanel.init('09463e082379bf033038dd530b8c973b');

console.log('mixpanel running');

exports.mixpanel = mixpanel;
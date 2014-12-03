var soap = require('soap');
var VHT_URL = "http://bc.vht.com.vn:8440/vht/services/sms?wsdl";
var VHT_CODE = "InfOry@Sms2o14";
var VHT_ACCOUNT = "infory";
var VHT_FROM = "VHT";

exports.sendSMS = function(phone, sms, source) {
	soap.createClient(VHT_URL, function(err, client) {
		var args = {code: VHT_CODE, account: VHT_ACCOUNT, phone: phone, from: VHT_FROM, sms: sms};
		var data;
	    client.sendSms(args, function(err, result) {	 
	    console.log(err);  	
	      	if(err)
	      		data = {status: 0, message: "Cannot send SMS!"};
	      	else
	      		data = {status: 1, message: "Success"};      	
	    });
	    
	    return data;
	});
};
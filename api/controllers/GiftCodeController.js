/**
 * GiftCodeController
 *
 * @description :: Server-side logic for managing Giftcodes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	issue: function(req,res)
	{
		// Send SMS
        // var sms = 'Chao ban ' + user.fullName + ', ma uu dai cua ban la ' + code.code + '. Hay den cua hang Viettel ban da chon de nhan san pham ALCATEL ONETHOUCH FLASH va qua tang nhe!';
	       //  console.log(sms);
        var data = SMSService.sendSMS("841692571021", "1", "a");
        console.log(data);    
        res.json(data);
	},
};


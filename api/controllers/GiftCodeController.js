/**
 * GiftCodeController
 *
 * @description :: Server-side logic for managing Giftcodes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomCode(len) {
        var buf = [];
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        var charlen = chars.length;

        for (var i = 0; i < 6; ++i) {
                buf.push(chars[Math.floor(getRandomInt(0,charlen-1))]);
        }
        
        return buf.join('');
}

module.exports = {
	generatecode: function(req,res)
	{
		// Send SMS
        // var sms = 'Chao ban ' + user.fullName + ', ma uu dai cua ban la ' + code.code + '. Hay den cua hang Viettel ban da chon de nhan san pham ALCATEL ONETHOUCH FLASH va qua tang nhe!';
	       //  console.log(sms);
        // var data = SMSService.sendSMS("841692571021", "1", "a");
        for (var i = 29999; i >= 0; i--) {
                GiftCode.create({
                                code : randomCode(6)
                        }).exec(function(err,created){});
        };
	}

};


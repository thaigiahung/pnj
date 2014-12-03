/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	create: function(req, res){
		var name = req.param('name');
		var phone = req.param('phone');
		var gender = req.param('gender');
		var email = req.param('email');
		var fb_id = req.param('fb_id');
		var fb = req.param('fb');
		var gg_id = req.param('gg_id');
		var gg = req.param('gg');
		var source = req.param('source');
		var send_sms = req.param('send_sms');


		if (!name || !phone || !gender || !email) {
			res.json(
			 	{
			 		"message": "Missing Parameter(s)",
			 		"status": 0
			 	}
			 	);
	     	res.status(400);
  		}
  		else {
  			User.create({
  				name : name,
  				phone : phone,
  				gender : gender,
  				email : email
  			}).exec(function(err,created){
  				if(err) {
  					//Handle Error
  				}
  				else {
  					if(fb) {
  						User.update({phone:phone},{fb:fb}).exec(function(err,updated){});
  					}
  					if(fb_id) {
  						User.update({phone:phone},{fb_id:fb_id}).exec(function(err,updated){});
  					}
  					if(gg) {
  						User.update({phone:phone},{gg:gg}).exec(function(err,updated){});
  					}
  					if(gg_id) {
  						User.update({phone:phone},{gg_id:gg_id}).exec(function(err,updated){});
  					}
  				}
  			});
  			res.json(
			 	{
			 		"message": "Success",
			 		"status": 1
			 	}
			 	);
  		}
	}
};


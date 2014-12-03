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
        for (var i = 29999; i >= 0; i--) {
                GiftCode.create({
                                code : randomCode(6)
                        }).exec(function(err,created){
                        	console.log(created);
                        });
        };
	},

	issue: function(req,res) {
		var phone = req.param('phone');
		
		if (!phone) {
			res.json(
			 	{
			 		"message": "Missing Parameter(s)",
			 		"status": 0
			 	}
			 	);
	     	res.status(400);
  		}
  		else
  		{
			User.findOne({phone:phone}).exec(function(err, matchUser){
		        var mUser;
		        if(typeof matchUser == "undefined" || matchUser.length == 0) //Chưa có user này => tạo
		    	{
		  			var createdUser = User.create({phone : phone}).exec(function(err,createdUser){
						  				if(err) {
						  					//Handle Error
						  					res.json(
											 	{
											 		"message": "Cannot create user!",
											 		"status": 0
											 	}
										 	);
									     	res.status(400);
						  				}
						  				else {
						  					return createdUser;
						  				}
						  			});		
		  			mUser = createdUser;  			
		    	}
		    	else
		    	{
		    		mUser = matchUser;
		    	}
				//Lấy 1 Gift Code
				GiftCode.findOne({status: 0}).exec(function(err, code){
		            if(err) {
	  					//Handle Error
	  					res.json(
						 	{
						 		"message": "Cannot get Gift Code!",
						 		"status": 0
						 	}
					 	);
				     	res.status(400);
	  				}
	  				else
	  				{
	  					console.log(code.id);
	  					console.log(mUser.id);
	  					//Set user_id và source cho Gift Code
	  					GiftCode.update({id:code.id},{user:mUser.id, status:1, source:1}).exec(function(err,updatedCode){
				  			if(err)
				  			{
				  				res.json(
								 	{
								 		"message": "Cannot update Gift Code!",
								 		"status": 0
								 	}
							 	);
						     	res.status(400);
				  			}
				  			else
				  			{
		  						// Send SMS
		  				        var sms = 'Chao ban, ma uu dai cua ban la ' + code.code + '.';
		  					       
				  				SMSService.sendSMS(mUser.phone, sms, 1);
				  				res.json(
								 	{
								 		"message": "Success",
								 		"status": 1
								 	}
							 	);
				  			}
	  					});		  			
	  				}
			    });  
		    });   
  		}
	},	

	active: function(req,res) {
		var code = req.param('code');
		if (!code) {
			res.json(
			 	{
			 		"message": "Missing Parameter",
			 		"status": 0
			 	}
		 	);
	     	res.status(400);
  		}
		else
		{
			GiftCode.findOne({code : code}).exec(function (err, giftcode){
				if(typeof giftcode == "undefined" || err)
				{
					res.json(
					 	{
					 		"message": "Invalid Gift Code!",
					 		"status": 0
					 	}
				 	);
				 	res.status(400);
				}
				else if(giftcode.status == 0)
				{
						res.json(
						 	{
						 		"message": "Invalid Gift Code!",
						 		"status": 0
						 	}
					 	);
					 	res.status(400);
				}
				else if(giftcode.status == 2)
				{
						res.json(
						 	{
						 		"message": "Gift Code has already been activated!",
						 		"status": 0
						 	}
					 	);
					 	res.status(400);
				}
				else {
					//trả status 0 và message là "Gift code has already been activated"
					GiftCode.update({code : code},{status : 2}).exec(function (err2, giftcode2){
						res.json(
					 	{
					 		"message": "Success",
					 		"status": 1
					 	})				
					})
				}
			});
		}		
	}
};


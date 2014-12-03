/**
 * GiftCodeController
 *
 * @description :: Server-side logic for managing Giftcodes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	issue: function(req,res)
	{
		var phone = req.param('phone');
		// Send SMS
        // var sms = 'Chao ban ' + user.fullName + ', ma uu dai cua ban la ' + code.code + '. Hay den cua hang Viettel ban da chon de nhan san pham ALCATEL ONETHOUCH FLASH va qua tang nhe!';
	       //  console.log(sms);
        
		var sms = "1";
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
			User.findByPhone(phone).exec(function(err, matchUser){
		        var data;
		        if(matchUser.length == 0) //Chưa có user này => tạo
		    	{
		  			User.create({phone : phone}).exec(function(err,createdUser){
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
				  					//Set user_id và source cho Gift Code
				  					code.update({user:createdUser},{source:1}).exec(function(err,updatedCode){});
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
						  				res.json(
									 	{
									 		"message": updatedCode.code,
									 		"status": 1
									 	}
								 	);
						  			}
				  				}
					        });

					        
		  				}
		  			});		  			
		    	}
		    });   
  		}
        
    	    

        // SMSService.sendSMS(phone, sms, "a");
        // res.send("data");
	},

	active: function(req,res) {
		var code = req.param('code');
		GiftCode.findOne({code : code, status : 1}).exec(function (err, giftcode){
			if(giftcode) {
				//trả status 0 và message là "Gift code has already been activated"
				GiftCode.update({code : code},{status : 2}).exec(function (err2, giftcode2){
					res.json(
				 	{
				 		"message": "Success",
				 		"status": 1
				 	})				
				})
			}
			else {
				res.json(
			 	{
			 		"message": "Invalid Gift Code!",
			 		"status": 0
			 	})
			}
		});
	}
};


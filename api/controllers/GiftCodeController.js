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
	}
};


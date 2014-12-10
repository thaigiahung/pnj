/**
 * GiftCodeController
 *
 * @description :: Server-side logic for managing Giftcodes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var fs = require('fs');
var file_path = 'activated_code/';

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
			 		"message": "Missing Parameter",
			 		"status": 0
			 	}
			 	);
	     	res.status(400);
  		}
  		else
  		{
			Customer.findOne({phone:phone}).exec(function(err, matchUser){
		        if(typeof matchUser == "undefined" || matchUser.length == 0) //Chưa có user này => tạo
		    	{
		  			Customer.create({phone : phone}).exec(function(err,createdUser){
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
		  				else
		  				{
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
				  					GiftCode.update({id:code.id},{customer: createdUser.id, status:1, source:1}).exec(function(err,updatedCode){
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
					  					       
							  				SMSService.sendSMS(phone, sms, 1);
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
		  				}
		  			});	
		    	}
		    	else
		    	{
		    		res.json({
		    		  "message": "Phone number already exists",
		    		  "status": 0
		    		});
		    	}
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
		        	//Update field `check` 
	          		GiftCode.update({code : code},{status : 2}).exec(function (err2, giftcode2){
		          		if(err2)
	          			{
	          		    	res.json(
		          	    	{
		          	      		"message": "Cannot update Gift Code!",
		          	      		"status": 0
		          	    	})  
		         	   	}	 
		                else
		                {
		                	Customer.findOne({id : giftcode.customer}).exec(function (err, cus){
		                		if(err){
		                			res.json(
				          	    	{
				          	      		"message": "Cannot get user info!",
				          	      		"status": 0
				          	    	})
		                		}
		                		else
		                		{
			            			var data = cus.first_name + "\n" + cus.last_name + "\n" + cus.phone + "\n" + cus.email;
			        				var file_name = giftcode.code + ".txt";
			            			fs.writeFile(".tmp/public/"+file_name, data, function (err) {
			        					if(err){
				                			res.json(
						          	    	{
						          	      		"message": "Cannot write file!",
						          	      		"status": 0
						          	    	})
			        					}
			            			});
			            			res.send("pnj.infory.vn/"+file_name);	
		                		}
		                	})
		                }            
		         	})
				}
			});
		}		
	},

  	check: function(req,res)
  	{
	    var code = req.param('code');
	    if (!code) {
	      	res.json(
		        {
		          "message": "Missing Parameter",
		          "status": 0
		        }
	      	);
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
		        }
		        else if(giftcode.check == 1)
		        {
		            res.json(
						{
							"message": "Gift Code has already been checked!",
							"status": 0
						}
		            );
		        }
		        else {
		          	if(giftcode.customer === null)
			          	res.json(
			              	{
			                	"message": "Gift Code is not issued!",
			                	"status": 0
			              	}
			            );
			        else
			        {
			        	//Update field `check` 
		          		GiftCode.update({code : code},{check : 1}).exec(function (err2, giftcode2){
			          		if(err2)
		          			{
		          		    	res.json(
			          	    	{
			          	      		"message": "Cannot update Gift Code!",
			          	      		"status": 0
			          	    	})  
			         	   	}	 
			                else
			                {
			                	Customer.findOne({id : giftcode.customer}).exec(function (err, cus){
			                		if(err){
			                			res.json(
					          	    	{
					          	      		"message": "Cannot get user info!",
					          	      		"status": 0
					          	    	})
			                		}
			                		else
			                		{
			                			res.json({
			                				"message": "Success",
					          	      		"status": 1,
			                				"first_name": cus.first_name,
			                				"last_name": cus.last_name,
			                				"phone": cus.phone,
			                				"email": cus.email
			                			})
			                		}
			                	})
			                }            
			         	})
			        }		          	
		        }
	      	});
	    }
  	}
};


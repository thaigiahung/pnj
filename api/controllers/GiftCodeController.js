/**
 * GiftCodeController
 *
 * @description :: Server-side logic for managing Giftcodes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var fs = require('fs');
var file_path = 'activated_code/';
var mixpanel = sails.config.mixpanel;

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
					  				        var sms = "PNJSILVER: Code - "+ code.code +", uu dai 30% cho 1 san pham trang suc PNJSILVER tu 12/12/2014 - 04/01/2015. Hotline:1800 545457";
					  					       
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

	resend: function(req,res) {
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
  					res.json(
					 	{
					 		"message": "User not exist!",
					 		"status": 0
					 	}
				 	);
		    	}
		    	else
		    	{
					GiftCode.findOne({customer: matchUser.id}).exec(function(err, code){
			            if(err) {
		  					//Handle Error
		  					res.json(
							 	{
							 		"message": "Cannot get Gift Code!",
							 		"status": 0
							 	}
						 	);
		  				}
		  				else
		  				{
	  						// Send SMS
	  				        var sms = "PNJSILVER: Code - "+ code.code +", uu dai 30% cho 1 san pham trang suc PNJSILVER tu 12/12/2014 - 04/01/2015. Hotline:1800 545457";
	  					    SMSService.sendSMS(matchUser.id,matchUser.phone, sms, 9);
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
	},

	reissue: function(req,res) {
		var phone = req.param('phone');
		var source_id = req.param('source_id');
	  	if (!phone || !source_id) {
		    res.json(
		      {
		        "message": "Vui lòng nhập đầy đủ thông tin",
		        "status": 0
		      });
		  	}
	  	else {  
			Customer.findOne({phone:phone}).exec(function(err, matchUser){
		        if(typeof matchUser == "undefined" || matchUser.length == 0) //Chưa có user này => tạo
		    	{
  					res.json(
					 	{
					 		"message": "User not exist!",
					 		"status": 0
					 	}
				 	);
		    	}
		    	else
		    	{
		    		//Lấy 1 Gift Code
		    		GiftCode.findOne({status: 0}).exec(function(err, code){
		    		    if(err) {
			    		    //Handle Error
			    		    res.json(
				    		    {
				    		      "message": "Không thể lấy mã nhận thưởng!",
				    		      "status": 0
				    		    }
				    		);
		    		  	}
		    		  	else
		    		  	{
			    		    //Set user_id và source cho Gift Code
			    		    GiftCode.update({id:code.id},{customer: matchUser.id, status:1, source:source_id}).exec(function(err,updatedCode){
			    		      	if(err)
			    		      	{
				    		        res.json(
					    		        {
					    		          "message": "Không thể cập nhật mã nhận thưởng!",
					    		          "status": 0
					    		        }
				    		      	);
			    		      	}
			    		      	else
			    		      	{
				    		        // Send SMS
				    		        var sms = "PNJSILVER: Code - "+ code.code +", uu dai 30% cho 1 san pham trang suc PNJSILVER tu 12/12/2014 - 04/01/2015. Hotline:1800 545457";
				    		        
				    		        SMSService.sendSMS(matchUser.id,matchUser.phone, sms, source_id);                              
				    		        res.json(
				    		             {
				    		               "message": "Thành công",
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
		                			Source.findOne({id : giftcode.source}).exec(function (err, matchedSource){
		                			  var source_name;
		                			  if(typeof matchedSource == "undefined" || err || matchedSource.length == 0) {
		                			    source_name = "other";
		                			  }                       
		                			  else {
		                			    source_name = matchedSource.utm;
		                			  }

			                			//Track event Active Gift Code
			                			mixpanel.track('Active Gift Code',{
			                			  "id": cus.id,
			                			  "name": cus.last_name + " " + cus.first_name,
			                			  "email": cus.email,
			                			  "phone": cus.phone,
			                			  "Facebook id": cus.fb_id,
			                			  "Google id": cus.gg_id,
		                			      "utm source": source_name
			                			});
		                			});
		                			

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


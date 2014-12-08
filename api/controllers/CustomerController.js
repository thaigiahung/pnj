/**
 * CustomerController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  create: function(req, res){
    var first_name = req.param('first_name');
    var last_name = req.param('last_name');
    var phone = req.param('phone');
    var gender = req.param('gender');
    var email = req.param('email');
    var fb_id = req.param('fb_id');
    var fb = req.param('fb');
    var gg_id = req.param('gg_id');
    var gg = req.param('gg');
    var utm = req.param('utm_source');
    var send_sms = req.param('send_sms');

    if (!first_name || !last_name || !phone || !gender || !email) {
      res.json(
        {
          "message": "Missing Parameter(s)",
          "status": 0
        });
        res.status(400);
    }
    else {
       Customer.findOne({phone : phone}).exec(function (err, user){
           if(user) {
             res.json({
               "message": "Phone number already exists",
               "status": 0
             })
           }
           else {
             Customer.create({
               first_name : first_name,
               last_name : last_name,
               phone : phone,
               gender : gender,
               email : email
             }).exec(function(err,created){
               if(err) {
                 //Handle Error
               }
               else {
                 if(fb) {
                   Customer.update({phone:phone},{fb:fb}).exec(function(err,updated){});
                 }
                 if(fb_id) {
                   Customer.update({phone:phone},{fb_id:fb_id}).exec(function(err,updated){});
                 }
                 if(gg) {
                   Customer.update({phone:phone},{gg:gg}).exec(function(err,updated){});
                 }
                 if(gg_id) {
                   Customer.update({phone:phone},{gg_id:gg_id}).exec(function(err,updated){});
                 }
                 if(send_sms === "true")
                 {
                    Source.findOne({utm : utm}).exec(function (err, matchedSource){
                      var source_id;
                      if(err || matchedSource.length == 0) 
                        source_id = 2;
                      else
                        source_id = matchedSource.id;
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
                            GiftCode.update({id:code.id},{customer: created.id, status:1, source:source_id}).exec(function(err,updatedCode){
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
                                     
                                SMSService.sendSMS(created.phone, sms, source_id);
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
             });
             res.json({
               "message": "Success",
               "status": 1
             });
           }
         });
    }
  }
};


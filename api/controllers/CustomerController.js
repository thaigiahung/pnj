/**
 * CustomerController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var mixpanel = sails.config.mixpanel;
module.exports = {
  create: function(req, res){
    var first_name = req.param('first_name');
    var last_name = req.param('last_name');
    var phone = req.param('phone');
    var email = req.param('email');
    var fb_id = req.param('fb_id');
    var fb = req.param('fb');
    var gg_id = req.param('gg_id');
    var gg = req.param('gg');
    var utm = req.param('utm_source');
    var send_sms = req.param('send_sms');

    if (!first_name || !last_name || !phone || !email) {
      res.json(
        {
          "message": "Vui lòng nhập đầy đủ thông tin",
          "status": 0
        });
        res.status(400);
    }
    else {      
       Customer.find({phone : phone}).exec(function (err, user){ 
           if(user.length >= 3) {
             res.json({
               "message": "Mỗi số điện thoại chỉ được nhận thưởng 3 lần!",
               "status": 0
             })
           }
           else {            
             Customer.create({
               first_name : first_name,
               last_name : last_name,
               phone : phone,
               email : email
             }).exec(function(err,created){
               if(err) {
                 //Handle Error
                 res.json({
                   "message": "Không thể tạo tài khoản!",
                   "status": 0
                 })
               }
               else {
                  //Save user info in Mixpanel DB
                  mixpanel.people.set(created.id, {
                    $name: created.last_name + " " + created.first_name,
                    $created: new Date().toISOString(),
                    $email: created.email,
                    $phone: created.phone,
                    fbId: fb_id,
                    gId: gg_id
                  });

                  Source.findOne({utm : utm}).exec(function (err, matchedSource){
                    var source_name;
                    if(typeof matchedSource == "undefined" || err || matchedSource.length == 0) 
                      source_name = "Other";
                    else
                      source_name = matchedSource.name;

                    //Track event Register
                    mixpanel.track('Register',{
                      "id": created.id,
                      "name": created.last_name + " " + created.first_name,
                      "email": created.email,
                      "phone": created.phone,
                      "Facebook id": fb_id,
                      "Google id": gg_id,
                      "utm source": source_name
                    });
                  })

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


                  var bool_send_sms = false;
                 if(send_sms === "true")
                 {
                    bool_send_sms = true;
                    Source.findOne({utm : utm}).exec(function (err, matchedSource){
                      var source_id;
                      if(typeof matchedSource == "undefined" || err || matchedSource.length == 0) 
                        source_id = 2;
                      else
                        source_id = matchedSource.id;
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
                                  "message": "Không thể cập nhật mã nhận thưởng!",
                                  "status": 0
                                }
                              );
                                res.status(400);
                              }
                              else
                              {
                                // Send SMS
                                var sms = "PNJSILVER: Code - "+ code.code +", uu dai 30% cho 1 san pham trang suc PNJSILVER tu 12/12/2014 - 04/01/2015. Hotline:1800 545457";
                                
                                SMSService.sendSMS(created.phone, sms, source_id);
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
                    });
                 }
                 //Track event Issue Gift Code
                 mixpanel.track('Issue Gift Code',{
                  "send SMS": bool_send_sms
                 });
               }
             });
             res.json({
               "message": "Thành công",
               "status": 1
             });
           }
         });
    }
  }
};


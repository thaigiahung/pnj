/**
 * XxxController
 *
 * @description :: Server-side logic for managing xxxes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = { 
	testing: function(req, res){
		var test = req.param("xxx");
		if(test == undefined) {
			res.send("ASDASD");
		}
		res.send(test);
	}
};


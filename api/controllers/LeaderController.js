/**
 * LeaderController
 *
 * @description :: Server-side logic for managing leaders
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	get: function(req, res) {

		var myQuery = User.find();
		myQuery.sort('hira DESC');
		myQuery.limit(5);

		myQuery.exec(function callBack(err,results) {
	    	if (err) { return res.serverError(err); }
	    	var response = [];
	    	results.forEach(function(element) {
    			response.push({
    				name: element.name,
    				hira: element.hira
    			});
			});
			res.send(response);
	    });

	}

};


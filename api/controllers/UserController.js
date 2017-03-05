/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var _ = require('lodash');

module.exports = {
	
	hello: function(req, res) {
		res.send('hello', 200);
	},

	get: function(req, res) {
		var query = {
			username: req.body.username
		};

		User.findOne(query).exec(function (err, user) {
        	
        	if(_.isUndefined(user))
        		res.send('Unable to locate user', 400);
        	else{
        		res.send(user, 200);
        	}
		});
	},

	login: function(req, res) {
        var query = {
        	username: req.body.username
        };
        
        User.findOne(query).exec(function (err, user) {
        	
        	if(_.isUndefined(user))
        		res.send('failed', 200);
        	else{
        		if(user.password == req.body.password)
	        		res.send('success', 200);
	        	else
	        		res.send('failed', 200); 	
        	}
		});
    },

    register: function(req, res) {
    	var query = req.body;

    	User.create(query).exec(function (err, finn){
		  if (err) { return res.serverError(err); }
		  return res.ok();
		});
    }

};


/**
 * ImageController
 *
 * @description :: Server-side logic for managing images
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const RapidAPI = require('rapidapi-connect');
const rapid = new RapidAPI("UberCheap", "45f03695-a77a-469a-b5ab-35b424b874ef");

var imgur = require('imgur');
var _ = require('lodash');

module.exports = {

	push: function(req, res){
		imgur.setClientId('48cbd77a9d73c4c');

		imgur.setAPIUrl('https://api.imgur.com/3/');

		var imgurFavicon = req.body.img;

		imgur.uploadBase64(imgurFavicon)
		    .then(function (json) {
		        //console.log(json.data.link);

		        rapid.call('ClarifaiPublicModels', 'analyzeImageGeneral', { 
					'clientId': 'mLMVvSBFSq9MuwJD7LG1fqMhpkWdqMpun-83Q3R_',
					'clientSecret': 'q3VEcRiufk0wngwkHLqb_G5Cb-xa9kUXOtfYmSBD',
					'image': json.data.link
				 
				}).on('success', (payload)=>{
					 /*YOUR CODE GOES HERE*/
					 var content = payload.outputs[0].data.concepts;
					 var tags = [];
					 var type = "";
					 content.forEach(function(element){
					 	tags.push(element.name);
					 });
					 console.log(tags);

					 if(_.includes(tags, 'person') || _.includes(tags, 'people') || _.includes(tags, 'man')){
					 	type = 'hooman';
					 } else if(_.includes(tags, 'battery') || _.includes(tags, 'electronics')){
					 	type = 'non-biodegradable';
					 } else if(_.includes(tags, 'plastic') || _.includes(tags, 'drink')){
					 	type = 'recyclable';
					 } else if(_.includes(tags, 'paper') || _.includes(tags, 'banana')){
					 	type = 'biodegradable'
					 }

					 var query = {
					 	username: req.body.username,
					 	img: json.data.link,
					 	tags: tags,
					 	type: type
					 };

					Image.create(query).exec(function (err, img) {
						if (err) { return res.serverError(err); }
						smartContracts(query, function(err, hira) {
							if(err)
								res.send("Nobody likes errors", 400);
							var result = {
								type: type,
								hira: hira
							};
							res.send(result, 200);
						});			  
					});

				}).on('error', (payload)=>{
					 /*YOUR CODE GOES HERE*/ 
				});
		    })
		    .catch(function (err) {
		      //  console.error(err.message);
		        res.send(err.message, 400);
		    });

	}
	
};


function smartContracts(query, callback) {
	var hira = 0;
	if(query.type == 'hooman') {
		hira = 0;
	} else if(query.type == 'biodegradable' || query.type == 'recyclable') {
		hira = 2;
	} else if(query.type == 'non-biodegradable') {
		hira = 1;
	}

	var q = {
		"username": query.username
	};

	User.findOne(q).exec(function (err, user) {
		if(err){
			callback(err, null);
		}

		if(!_.isUndefined(user.hira)){
			user.hira = user.hira + hira;
		} else {
			user.hira = hira;
		}

		User.update(q, user).exec(function afterwards(err, updated) {

		  if (err) {
		    // handle error here- e.g. `res.serverError(err);`
		    return callback(err, null);
		  }

		  callback(null, hira);
		});
	});
};


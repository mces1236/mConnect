var mongoClient = require('mongodb').MongoClient,
	mongoose = require('mongoose'),
	mongoConfig = require('../configs/mongo_config'),
	logger = require('../utils/logger');
var mongo = module.exports;
// Makes connection asynchronously. Mongoose will queue up database
// operations and release them when the connection is complete.


mongo.init = function(url,callback){
	mongoClient.connect(url,
	{db: { bufferMaxEntries: 0 }},
	function(err,db){
		if(err){
			logger.error ('ERROR connecting to: ' + url + '. ' + err);
			callback(err,null);
		}
		logger.info ('Successfully connected to: ' + url );
		callback(null,db);
	});
}

mongo.exit = function(db){
	if(db){
	logger.info ('Succeeded closing ' + db.databaseName + "db connection");
	db.close();
	}
}


mongo.connect = function(url){
	return mongoose.connect(url,
  	function (err, res) {
	  if (err) {
	    logger.error ('ERROR connecting to: ' + url + '. ' + err);
	  } else {
	     logger.info ('Successfully connected to: ' + url + " from mongoose");
	  }
	});
}


mongo.createConnection = function(url){
	return mongoose.createConnection(url,
  	function (err, res) {
	  if (err) {
	    logger.error ('ERROR connecting to: ' + url + '. ' + err);
	  } else {
	    logger.info ('Successfully connected to: ' + url + " from mongoose");
	  }
	});
}

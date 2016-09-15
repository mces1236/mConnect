var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
  lib = require('../lib');

/*
Assuming most organizations will have their own user collection,
this will be a additional collection to just maintain token
*/
var User = new Schema({
      userId: {
        type: String,
        index: true,
    		unique : true
      },
      token: {
  			type: String
  		},
      created: {
  			type: Number
  		}
});

User.methods.generateCId = function(){
	var cid = generate.chatId(this.lastChatId());
	if(this.checkIfExists(cid))
	{
		cid = this.generateCId();
		return cid;
	}
	else
		return cid;
}

User.methods.checkIfExists = function(id){
	mongoose.connection.db.collection(lib.baseConfig.get("mongo:prefix")+'users').findOne({_id:id},function(err,docs){
		if(err)
			return false;
		if (docs && docs.length){
			return true;
		}
		else
			return false;
	})
}

User.methods.lastChatId = function(){
	mongoose.connection.db.collection(lib.baseConfig.get("mongo:prefix")+'users').findOne({}, {sort:{$natural:-1}},function(err,docs){
		if (docs && docs.length > 0){
			return docs[0]._id;
		}
		else
			return null;
	})
}

User.virtual('id').get(function() { return this.generateCId(); });

module.exports  = mongoose.model(lib.baseConfig.get("mongo:prefix")+'users', User);

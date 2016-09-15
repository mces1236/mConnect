import lib from '../lib/lib';
import lodash from 'lodash';

export default class UserService{
  constructor(){

  }

  findUser(id,callBack){
    this.model.findOne({ id: id },function (err, user) {
        if (err)
            console.error(err);
        if(callBack)
            callBack(err,user);
    });
  }

  findUsers(ids,callBack){

        var userIds = [];
        _.each(ids,)
        aryId.forEach(ids, (userId) => {

            userIds.push({
                _id : userId
            });

        });

        var query = this.model.find({
            $or : conditions
        }).sort({'created': 1});

        query.exec(function(err,data){

            if (err)
                console.error(err);

            if(callBack)
                callBack(err,data)

        });

    }

}

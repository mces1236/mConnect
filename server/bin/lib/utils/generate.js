import lib from '../lib';

/*
generate Chat Id
*/
exports.chatId = function(lastChatId){
   if(lastChatId)
      return lib.baseConfig.get("chatId:prefix") + lib.baseConfig.get("chatId:sequence");
   else {
     var lastChatIdNumber = lastChatId.replace(/\D/g, '');
     return lib.baseConfig.get("chatId:prefix") + (lastChatIdNumber+1);
   }
}

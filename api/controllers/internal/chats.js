module.exports = {
  friendlyName: 'Chats List',
  description: 'Chats List -> internal.',

  inputs: {
    unread: {
      description: 'unread',
      type: 'boolean',
      required: false
    },
    mobile: {
      description: 'mobile',
      type: 'string',
      required: false
    },
  },
  exits: {},

  fn: async function (inputs) {
    // All done.
    let queryParams = {  }
    let result = [];
    if(inputs.unread) {
      queryParams.unreadMessages={ '>' : 0 }
    }else{
      queryParams.unreadMessages= 0
    }
    if(inputs.mobile){
      let searchStr = inputs.mobile;
      let searchStrNum = searchStr.replace(/\s/g, "");
    console.log("rawCollection",searchStrNum);//new RegExp(searchStr,"gi")
    let contacts = await sails.getDatastore().manager.collection('chat')
    .aggregate([{$match:{ unreadMessages: queryParams.unreadMessages}},{'$lookup': {'from': "message", 'localField': '_id', 'foreignField': "chat", 'as': 'joinResult'}},{"$unwind":"$joinResult"},{$project:{"contactno":{$replaceAll: {input: "$name",find: " ",replacement: ""}},"bodyContent":"$joinResult.body",name:1,metadata:1,image:1,createdAt:1,updatedAt:1,unreadMessages:1,"id":"$_id"}},{$match: { $or: [{ contactno:new RegExp(searchStrNum,"i") }, {bodyContent:new RegExp(searchStr,"i") }] }},{$group:{_id:"$_id"}}]).toArray();
    // .aggregate([{ "$facet":{"q1":[{$match:{body:new RegExp(str,"gi")}}, {$project:{"chatid":"$chat",body:1}}],"q2":[{$project:{"name":{$replaceAll: {input: "$name",find: " ",replacement: ""}}}},{$match:{name:new RegExp(strNum,"gi")}},{$project:{"chatid":"$_id","body":"$name"}}]},},{ "$project": {"data": {"$concatArrays": [ "$q1", "$q2"]}}},{ "$unwind": "$data" },{'$lookup': {'from': "chat", 'localField': 'data.chatid', 'foreignField': "_id", 'as': 'numbers'}},{$project : {numbers:1}},{"$unwind":"$numbers"},{"$project":{"searchData":"$numbers"}}]).toArray();
    console.log(contacts);
    console.log("123");
      if(contacts!=null && contacts != undefined && contacts.length){
        let resObj = {$match: { $or: contacts.map(function(x) { return x } )}};
        console.log(resObj);
        result =  await sails.getDatastore().manager.collection('chat').aggregate([resObj,{$project:{name:1,metadata:1,image:1,createdAt:1,updatedAt:1,unreadMessages:1,"id":"$_id"}}]).toArray();
      }
    }else{
      result =  await Chat.find({ unreadMessages: queryParams.unreadMessages}).sort('updatedAt DESC');
    }
    return {
      chats: result,
      reqParam:inputs
    }
  }
};

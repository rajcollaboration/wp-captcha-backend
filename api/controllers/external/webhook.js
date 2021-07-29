const axios = require('axios').default;

module.exports = {
  friendlyName: 'Webhook',
  description: 'Webhook to receive requests from chat-api.',


  inputs: {
    messages: {
      description: 'Array of messages received by the instance',
      type: ['ref'],
      required: true
    },
    instanceId: {
      description: 'Instance ID',
      type: 'string',
      required: true
    }
  },

  exits: {

  },


  fn: async function (inputs) {
    for (let message of inputs.messages) {
      // get chat data (image) & update it
      const options = {};
      const apiUrl = await sails.config.custom.chatApiInstanceUrl;
      const token = await sails.config.custom.chatApiInstanceToken;
      const method = 'dialog'
      const url = `${apiUrl}${method}?token=${token}&chatId=${message.chatId}`;
      sails.log.debug(url);

      const dialog = await axios.get(url);
      // if this request fails with 401, it can mean:
      // * whatsapp is not authenticated
      // * token variable is not correctly loaded
      sails.log.debug(dialog.data);

      // find or create chat
      const chat = await Chat.findOrCreate(
        { id: message.chatId },
        {
          id: message.chatId,
          name: message.chatName,
          metadata: dialog.data.metadata,
          image: dialog.data.image,
        },
      );

      if(!message.fromMe) {
        // update unread_messages counter
        const newMessages = (chat.unreadMessages || 0) + 1
        await Chat.update({ id: message.chatId })
          .set({
            unreadMessages: newMessages,
            name: dialog.data.name,
            image: dialog.data.image,
          })
      }
      
      let str = message.senderName;
      if(str.length == 0 && str === ""){
			const sender = await Contact.findOrCreate(
			{ author: message.author },
			{
			  author: message.author,
			  senderName: "Auto"
			},
		  );
	  }else{
			const sender = await Contact.findOrCreate(
			{ author: message.author },
			{
			  author: message.author,
			  senderName: message.senderName
			},
		  );
	  }

      const messageAttributes = {
        id: message.id,
        body: message.body,
        fromMe: message.fromMe,
        self: message.self,
        isForwarded: message.isForwarded,
        time: message.time,
        messageNumber: message.messageNumber,
        type: message.type,
        caption: message.caption,
        quotedMsgBody: message.quotedMsgBody,
        quotedMsgId: message.quotedMsgId,
        quotedMsgType: message.quotedMsgType,

        chat: chat.id,
        sentBy: sender.id
      }

      let savedMessage = await Message.create(messageAttributes).fetch();
      sails.log.debug(savedMessage)

      const messages = await Message.find({
        chat: chat.id
      }).sort([ {time: 'ASC'} ])

      sails.sockets.blast(chat.id, messages);
      const chatList = await Chat.find().sort('updatedAt DESC');

      const newChat = await Chat.find({ id: chat.id })
      const broadCast = {
        chatId: chat.id,
        unreadMessages: newChat.unreadMessages
      };
      sails.sockets.blast('newMessages', newChat[0]);
    };

    sails.log.debug('Received webhook');
    return;
  }


};

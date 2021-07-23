module.exports = {
  friendlyName: 'Chat Detail',
  description: 'Chat Detail -> (internal).',


  inputs: {
    chatId: {
      description: 'ChatId',
      type: 'string',
      required: true
    }
  },

  exits: {},

  fn: async function (inputs) {

    // update unreadMessages
    await Chat.updateOne({ id: inputs.chatId })
      .set({ unreadMessages: 0 })

    // return messages list
    return {
      messages: await Message.find({
        chat: inputs.chatId
      }).sort([ {time: 'ASC'} ])
    }
  }
};

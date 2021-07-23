const axios = require('axios').default;

module.exports = {
  friendlyName: 'Send new message',
  description: 'Creates a new message and sends it through the api',

  inputs: {
    chatId: {
      description: 'ChatId',
      type: 'string',
      required: true
    },
    body: {
      description: 'Message body',
      type: 'string',
      required: true
    }
  },

  exits: {},


  fn: async function (inputs) {
    const options = {};
    const apiUrl = sails.config.custom.chatApiInstanceUrl;
    const token = sails.config.custom.chatApiInstanceToken;
    const method = 'sendFile';
    const url = `${apiUrl}/${method}?token=${token}`;

    const formData = {
      chatId: inputs.chatId,
      body: inputs.body,
    }
    sails.log.debug(formData)
    const dialog = await axios.post(url, formData);
    sails.log.debug(dialog.data);

    // All done.
    return;
  }


};

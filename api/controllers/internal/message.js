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
    },
    type: {
      description: 'Message type',
      type: 'string',
      required: false
    },
    filename: {
      description: 'File name',
      type: 'string',
      required: false
    },
    attachmentMsg: {
      description: 'message attached to file',
      type: 'string',
      required: false
    },
  },

  exits: {},


  fn: async function (inputs) {
    const options = {};
    const apiUrl = sails.config.custom.chatApiInstanceUrl;
    const token = sails.config.custom.chatApiInstanceToken;
    
    let method = 'sendMessage';
    let formData ={};
    let attachedFileMessage = inputs.attachmentMsg || ''; 
    if(inputs.type && inputs.type=='doc'){
      method = 'sendFile';
      formData = {
        chatId: inputs.chatId,
        body: inputs.body,
        filename:inputs.filename,
        caption:attachedFileMessage
      }
    }else{
      formData = {
        chatId: inputs.chatId,
        body: inputs.body,
      }
    }
    const url = `${apiUrl}/${method}?token=${token}`;

    
    sails.log.debug(formData)
    const dialog = await axios.post(url, formData);
    sails.log.debug(dialog.data);

    // All done.
    return;
  }


};

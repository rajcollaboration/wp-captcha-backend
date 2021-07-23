/**
 * Message.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  dontUseObjectIds: true,
  attributes: {
    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    id: { type: 'string', required: true, columnName: '_id' },
    body: { type: 'string', required: true },
    fromMe: { type: 'boolean', required: true },
    self: { type: 'number', required: true },
    isForwarded: { type: 'number', allowNull: true },
    time: { type: 'number', required: true },
    messageNumber: { type: 'number', required: true },
    type: { type: 'string', required: true, columnName: 'chatApiType' },
    caption: { type: 'string', allowNull: true },
    quotedMsgBody: { type: 'string', allowNull: true },
    quotedMsgId: { type: 'string', allowNull: true },
    quotedMsgType: { type: 'string', allowNull: true },
    unreadMessages: { type: 'number', defaultsTo: 0 },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    chat: {
      model: 'chat'
    },

    sentBy: {
      model: 'contact'
    },
  },

};


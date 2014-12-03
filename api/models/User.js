/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    name: {
      type : 'string',
      required: true
      },

    phone: {
      type : 'string',
      required: true,
      unique: true
      },

    email: {
      type : 'string',
      required: true
      },

    gender: {
      type : 'boolean',
      required: true
      },

    fb_id: {
      type : 'string'
      },

    fb: {
      type : 'json'
      },

    gg_id: {
      type : 'string'
      },

    gg: {
      type : 'json'
      }
  }
};


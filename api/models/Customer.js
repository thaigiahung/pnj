/**
* Customer.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    last_name: {
      type : 'string'
      },

    first_name: {
      type : 'string'
      },

    phone: {
      type : 'string',
      required: true
      },

    email: {
      type : 'string'
      },

    gender: {
      type : 'boolean'
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


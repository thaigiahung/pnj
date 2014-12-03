/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	name: { type: 'string', required: true},
  	email: {
            type: 'string',
            required: true,
            unique: true
        },
    gender: {
            type: 'boolean',
            required: true
        },
    fb_id: { type: 'integer'},
    fb: { type: 'text'},
    gg_id: { type: 'integer'},
    gg: { type: 'text'}
  }
};


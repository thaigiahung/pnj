/**
* TrackingSMS.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	customer: { model: 'customer' },
  	phone: { type: 'string'},
    response: { type: 'text'}
  }
};


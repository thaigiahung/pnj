/**
* GiftCode.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	code: { 
  		type: 'string', 
  		required: true, 
  		unique: true
  	},
  	customer: { model: 'customer' },
  	status: { type: 'integer', defaultsTo: 0},
    check: { type: 'integer', defaultsTo: 0},
  	source: { model: 'source' }
  }
};


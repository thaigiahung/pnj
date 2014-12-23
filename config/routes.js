/**
 * Routes
 *
 * Sails uses a number of different strategies to route requests.
 * Here they are top-to-bottom, in order of precedence.
 *
 * For more information on routes, check out:
 * http://sailsjs.org/#documentation
 */

module.exports.routes = {

  // Client authorization endPoints

  'get /index/:source?': 'IndexController.index',
  'get /login': {
    view: 'login'
  },
  'post /login': {
    controller: 'Auth',
    action: 'login'
  },
  'get /logout': {
    controller: 'Auth',
    action: 'logout'
  },

  // Resources endPoints

  '/info': {
    controller: 'InfoController',
    action: 'index'
  },

  'POST /user/create' : {
    controller: 'customer',
    action: 'create'
  },
  'POST /user/remind' : {
    controller: 'customer',
    action: 'remind'
  },

  'POST /gift_code/issue': {
    controller: 'GiftCodeController',
    action: 'issue'
  },
  'POST /gift_code/resend': {
    controller: 'GiftCodeController',
    action: 'resend'
  },
  'POST /gift_code/reissue': {
    controller: 'GiftCodeController',
    action: 'reissue'
  },
  'POST /gift_code/generate': {
    controller: 'GiftCodeController',
    action: 'generatecode'
  },
  'GET /gift_code/active': {
    controller: 'GiftCodeController',
    action: 'active'
  },
  'POST /gift_code/check': {
    controller: 'GiftCodeController',
    action: 'check'
  },
  'POST /user/get/all': 'Customer.find'
}

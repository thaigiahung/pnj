/**
 * Policy mappings (ACL)
 *
 * Policies are simply Express middleware functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect just one of its actions.
 *
 * Any policy file (e.g. `authenticated.js`) can be dropped into the `/policies` folder,
 * at which point it can be accessed below by its filename, minus the extension, (e.g. `authenticated`)
 *
 * For more information on policies, check out:
 * http://sailsjs.org/#documentation
 */


module.exports.policies = {

  // Default policy for all controllers and actions (`true` allows public access)
    '*': true,

    ProductController: 'oauthBearer', 
    CustomerController: 'oauthBearer', 
    CouponController: 'oauthBearer', 
    SaleController:  'oauthBearer', 
    InfoController: 'oauthBearer', 
    User: {
        '*': false
    },
    GiftCode: {
        '*': false,
        'generatecode' : 'oauthBearer',
        'issue' : 'oauthBearer',
        'active' : true,
        'resend' : true,
        'reissue' : true,
        'check' : true
    },
    Source: {
        '*': false
    },
    Client: {
        '*': false
    },
    Customer: {
        '*': false,
        'create': true,
        'remind': true,
        'find': true
    }

};


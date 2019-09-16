const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json');

const functions = {
    
     genetareToken (params = {}) {
          return jwt.sign(params, authConfig.secret, {
              expiresIn : 86400,
          });
      }

}

module.exports = functions;

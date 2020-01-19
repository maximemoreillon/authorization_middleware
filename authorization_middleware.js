const jwt = require('jsonwebtoken')

function get_token(authorization_header){
  return authorization_header.split(" ")[1]
}

exports.secret = undefined

exports.middleware = (req, res, next) => {

  // Authorization using a JWT
  if('authorization' in req.headers) {
    // Authorization header is set

    // check if the secret is defined
    if(exports.secret){
      let token = get_token(req.headers.authorization);

      jwt.verify(token, exports.secret, (err, decoded) => {
        if(decoded) {
          // Simply allow anyone with a valid token
          next();
        }
        else {
          res.status(401)
        }
      })
    }
    else {
      console.log(new Error("secret is not set"))
      res.status(500)

    }

  }

  // if using cookie-session
  else if('username' in req.session){
    next();
  }
  else {
    // The client is not providing anything to authenticate
    res.status(401)
  }


}

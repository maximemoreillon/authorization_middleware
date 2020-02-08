const jwt = require('jsonwebtoken')

function get_token(authorization_header){
  return authorization_header.split(" ")[1]
}

// secret set by the application
exports.secret = undefined

exports.middleware = (req, res, next) => {

  // Authorization using a JWT
  if('authorization' in req.headers) {
    // Authorization header is set

    // check if the secret is defined
    if(exports.secret){
      let token = get_token(req.headers.authorization);
      jwt.verify(token, exports.secret, (err, decoded) => {
        if(err) res.status(500).send('Error decoding token')
        if(decoded) next(); // Simply allow any user with a valid token
        else res.status(401).send('Token is invalid')
      })
    }
    else {
      console.log(new Error("JWT secret is not set"))
      res.status(500).send('JWT secret is not set in the server-side application')
    }
  }

  // Authorization using cookieSession
  else if('session' in req){
    if('username' in req.session) next();
    else res.status(401).('Appropriate session variable is not set')
  }

  else {
    // The client is not providing anything to authenticate
    res.status(403).send('This route requires authentication')
  }

}

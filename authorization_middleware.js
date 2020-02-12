const jwt = require('jsonwebtoken')


// secret set by the application
exports.secret = undefined

exports.middleware = (req, res, next) => {

  // Authorization using a JWT
  if(req.headers.authorization) {

    // check if the secret is defined
    if(!exports.secret){
      console.log(new Error("JWT secret is not set"))
      res.status(500).send('JWT secret is not set in the server-side application')
    }

    // parse the headers to get the token
    let token = req.headers.authorization.split(" ")[1];

    // verify the token
    jwt.verify(token, exports.secret, (err, decoded) => {
      if(err) res.status(500).send('Error decoding token')

      if(decoded) next(); // Simply allow any user with a valid token
      else res.status(401).send('Token is invalid')
    })

  }

  // Authorization using cookieSession
  else if(req.session){
    if(req.session.username) next()
    else res.status(401).send('Appropriate session variable is not set')
  }

  // The client is not providing anything to authenticate
  else res.status(403).send('This route requires authentication')

}

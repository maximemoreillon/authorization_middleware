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
      if(err) return res.status(400).send(err)

      next(); // Simply allow any user with a valid token
    })

  }

  // The client is not providing anything to authenticate
  else res.status(403).send('This route requires authentication')

}

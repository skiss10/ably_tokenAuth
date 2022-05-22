

var Ably = require("ably");

/* Instance the Ably REST server library */
var rest = new Ably.Rest({ key: "LZ8Jlw.aBAfJg:b0UKuPrq0GORDATFFDeEcf4d6JDnOVnHU3r61vS_gIE" });

/* Start the Express.js web server */
const express = require('express'),
      app = express();

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use('/', express.static(__dirname));

app.listen(3000, function () {
  console.log('Web server listening on port 3000');
});

/* Issue token requests to clients sending a request to the /auth endpoint */
app.get('/auth', function (req, res) {
  var tokenParams;
  /* Check if the user is logged in */
  if (req.cookies.username) {
    /* Issue a token request with pub & sub permissions on all channels +
      configure the token with an identity */
      tokenParams = {
      'capability': { '*': ['publish', 'subscribe'] },
      'clientId': req.cookies.username
    };
} 
else {
  /* Issue a token with subscribe privileges restricted to one channel
     and configure the token without an identity (anonymous) */
  tokenParams = {
    'capability': { 'notifications': ['subscribe'] }
  };
}
  rest.auth.createTokenRequest(tokenParams, function(err, tokenRequest) {
    if (err) {
      res.status(500).send('Error requesting token: ' + JSON.stringify(err));
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(tokenRequest));
    }
  });
});

/* Set a cookie when the user logs in */
app.get('/login', function (req, res) {
  /* Login the user without credentials.
     This is an over simplified authentication system
     to keep this tutorial simple */
  if (req.query['username']) {
    res.cookie('username', req.query['username']);
    res.redirect('/');
  } else {
    res.status(500).send('Username is required to login');
  }
});

/* Clear the cookie when the user logs outs */
app.get('/logout', function (req, res) {
  res.clearCookie('username');
  res.redirect('/');
});

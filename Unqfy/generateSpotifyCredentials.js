/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */
const fs = require('fs');
const express = require('express'); // Express web server framework
const request = require('request'); // "Request" library
const querystring = require('querystring');

const PORT = 3000;
const CREDENTIALS_FILENAME = 'spotifyCreds.json';

const CLIENT_ID = 'd38a0113ad3e429c9dbfe4ed483a2874'; // Your client id
const CLIENT_SECRET = 'a9176cac20db4393877e6a0ffb99bff3'; // Your secret
const REDIRECT_URI = `http://0.0.0.0:${PORT}/spotify_cb`; // Your redirect uri

let server = null;

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
function generateRandomString(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

let currentState = null;
const app = express();

function login() {

  currentState = generateRandomString(16);

  // your application requests authorization
  const scope = 'user-read-private user-read-email';
  const url = 'https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: scope,
      redirect_uri: REDIRECT_URI,
      state: currentState,
    });
  console.log('Ingrese a la siguiente URL e ingrese a su cuenta de spotify');
  console.log(url);
}

app.get('/spotify_cb', (req, res) => {

  // your application requests refresh and access tokens
  // after checking the state parameter

  const code = req.query.code || null;
  const state = req.query.state || null;

  if (state === null || state !== currentState) {
    console.error('Error: state_mismatch');
    res.end();
    server.close();
  } else {
    currentState = null;
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code'
      },
      headers: {
        //'Authorization': 'Basic ' + (new Buffer(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
        Authorization: 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')
      },
      json: true
    };

    request.post(authOptions, (error, response, body) => {
      if (!error && response.statusCode === 200) {

        const access_token = body.access_token;
        const refresh_token = body.refresh_token;

        fs.writeFileSync(CREDENTIALS_FILENAME, JSON.stringify(
          {access_token: access_token, refresh_token: refresh_token},
          null, 2
        ));
        console.log('-------------------------------------------');
        console.log(`Credenciales guardadas en ${CREDENTIALS_FILENAME}.`);
        console.log('access_token: ', access_token);
        console.log('refresh_token: ', refresh_token);

        const options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { Authorization: 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        console.log('-------------------------------------------');
        console.log('Haciendo un request de prueba con los tokens adquiridos ...');
        request.get(options, (error, response, body) => {
          if (!error && response.statusCode === 200) {
            console.log('Request de prueba funcionó OK');
          } else {
            console.error('Request de prueba NO FUNCIONÓ :(');
          }
          res.end(`Volve a mirar la terminal. Los tokens estan en ${CREDENTIALS_FILENAME}`);
          server.close();
        });
      } else {
        console.error('invalid token');
        res.end();
        server.close();
      }
    });
  }
});

app.get('/refresh_token', (req, res) => {

  // requesting access token from refresh token
  const refresh_token = req.query.refresh_token;
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { Authorization: 'Basic ' + (new Buffer(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const access_token = body.access_token;
      res.send({
        access_token: access_token
      });
    }
  });
});

console.log(`Listening on ${PORT}`);
server = app.listen(PORT);

login();

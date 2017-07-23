/*jslint node: true */
/*jslint esversion: 6*/
/*jslint eqeqeq: true */

var express = require('express');
var app = express();
var fs = require("fs");
var expressWs = require('express-ws')(app);
var http = require('http');

var bodyParser = require('body-parser');
var cors = require('cors');

var uuid = require('uuid');

var user;
var devices;
var invalid_tokens = [];

var system_start = new Date();
var failed_logins = 0;

// Request library
var request = require('request').defaults({ encoding: null });

// Exif library
var ExifImage = require('exif').ExifImage;

app.set('secret', "superSecret");
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

/**
 * Get image exif data
 */
app.get('/exif',
  function (req, res) {
    "use strict";
    // Always use json for the response
    res.type('json');

    request.get(req.query.uri, function (err, response, body) {
      if (body === null || body === undefined) {
        res.json({ status: 500, message: err });
        return;
      }
      try {
          new ExifImage({ image : body }, function (error, exifData) {
            if (error) {
              console.log('Error: ' + error.message);
              res.json( {status: 500, message: error.message });
            } else {
              console.log(exifData);
              res.json({ status: 404, exif: exifData });
            }
          });
      } catch (error) {
        console.log('Error: ' + error.message);
        res.json({ status: 500, message: error.message });
      }
    });
  }
);

/**
 * The server
 * @type {http.Server}
 */
var server = app.listen(8081, function () {
  "use strict";

  var host = server.address().address;
  var port = server.address().port;

  console.log("Exif API Server listening at http://%s:%s", host, port);
});

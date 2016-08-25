var express = require('express');
var File = require('../models/File');
var router = express.Router();
var Hashids = require('hashids');
var path = require('path');
var config = require('../config');

module.exports = function (upload) {

  var hashids = new Hashids("this is my salt", 8, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890");
  router.get('/', function(req, res, next) {
    res.send('Systems running in good health.');
  });

  router.post('/api/files', upload.single('file'), function (req, res) {
    if(! req.body.token || ! req.file) return res.sendStatus(412);
    if(req.body.token != "esscale") return res.send({message: "Token invalid"}, 403);

    var file = new File({
      uid: hashids.encode(Date.now()),
      url: req.file.path
    });

    file.save(function (err, file) {
      if(err) return res.send(err, 500);
      var fileObj = {
        url: config.baseUrl + '/f/' + file.uid,
        uid: file.uid
      };
      res.send(fileObj);
    });
  });

  router.get('/f/:id', function (req, res) {
    File.findOne({uid: req.params.id}, function (err, file) {
      if (err) res.send(err, 500);
      res.sendFile(path.join(__dirname, '../'+file.url));
    });
  });


  return router;
}

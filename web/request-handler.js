var helpers = require('./http-helpers.js');
var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var url = require('url');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  var parsedURL = url.parse(req.url);
  var filePath;

  if (parsedURL.pathname === '/') {
    filePath = path.join(archive.paths.siteAssets, '/index.html');
    helpers.getFile(filePath, res);
  } else {
    archive.isUrlArchived(parsedURL.pathname, function(isFile) {
      if (isFile) {
        filePath = path.join(archive.paths.archivedSites, parsedURL.pathname);
        console.log('constructed path: ', filePath);
        helpers.getFile(filePath, res);   
      } else {
        helpers.serveAssets(res, '', function() { console.log('404 error'); }, 404);
      }            
    });
  }
  

  // fs.readFile(filePath, 'utf8', function(err, data) {
  //   if (err) {
  //     throw err;
  //   }
  //   helpers.serveAssets(res, data, function() {
  //     console.log("success");
  //   });
  // });
  //was in original file...
  //res.end(archive.paths.list);
};

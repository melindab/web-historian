var helpers = require('./http-helpers.js');
var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var url = require('url');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  var parsedURL = url.parse(req.url);
  var filePath;

  if (req.method === 'POST') {
    var submittedURL = '';
    req.on('data', function(data) {
      
      //submittedURL += JSON.parse(data).url;
      submittedURL += data;
      console.log('form submission: ', submittedURL);
    });    
    req.on('end', function() {
      submittedURL = submittedURL.slice(4);
      archive.addUrlToList(submittedURL, function() {
        console.log("Successfully added to the list");
          helpers.sendResponse(res, 302);
      });
      archive.isUrlArchived(submittedURL, function(isFile) {
        if (isFile) {
          helpers.getFile(path.join(archive.paths.archivedSites, submittedURL), res);
        } else {
          helpers.getFile(path.join(archive.paths.siteAssets, '/loading.html'), res);
        }
      });
    });    
  } else if (req.method === 'GET') {
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
          //helpers.sendResponse(res, 404);
        }            
      });
    }    
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

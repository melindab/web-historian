var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var request = require('request');
/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, 'utf8', function(err, data) {
    if (err) {
      console.log(err); 
    } else {
      var sitesArray = data.split('\n');
      callback(sitesArray);
    }
  });
};

exports.isUrlInList = function(url, callback) {
  exports.readListOfUrls(function(urls) {
    callback(_.contains(urls, url));
  });
};

exports.addUrlToList = function(url, callback){
  exports.isUrlInList(url, function(isInList) {
    if (!isInList) {
      fs.appendFile(exports.paths.list, url + '\n', 'utf8', function(err) {
        if (err) {
          console.log('error adding url to list: ', err);
        } else {
          callback();    
        }
      });
    } else {
      console.log('already in list');
    }
  });   
};

exports.isUrlArchived = function(url, callback) {
  var filePath = path.join(exports.paths.archivedSites, url);

  fs.open(filePath, 'r', function(err, data) {
    var exists = true;
    if (err) {
      exists = false;
    }
    console.log('inside isUrl archived: ', url);
    callback(exists, url);
  });
  
  // fs.stat(filePath, function(err, stats) {
  //   if (err) {
  //     console.log(err);
  //     callback(false);
  //   } else {
  //   //problematic line
  //     callback(true);
  //   }
  // });
};

exports.archiveSite = function(url, callback) {
  request('http://' + url, function (error, response, body) {
    console.log('response.statusCode: ', response.statusCode);
    if (!error && response.statusCode == 200) {

      fs.writeFile(path.join(exports.paths.archivedSites, url), body, 'utf8', function(err) {
        if (err) {
          console.log('error archiving site: ', err);
        } else {
          callback();
        }
      }); 
    }
    console.log('request callback');
  });
};

exports.downloadUrls = function(array) {
  // if file archived, send to archived version
  // if not archived, redirect to loading page
  // and write file to archives/sites
 // console.log('passed in URLS: ', array);
  for (var i = 0; i < array.length; i++) {
    console.log('url to be requested (outside callback): ', array[i]);
    exports.isUrlArchived(array[i], function(exists, url) {
      if (!exists) {
        //no access to array[i] in this scope: maybe pass url into the callback in isURL archived
        console.log('url to be requested: ', url);
        exports.archiveSite(url, function() {
          console.log("Site archived");          
        });
      }
    });
  }


  // exports.readListOfUrls(function(urlArray) {
  //   for (var i = 0; i < urlArray.length; i++) {
  //     exports.isUrlArchived(urlArray[i], function(exists) {
  //       if (!exists) {
  //         exports.archiveSite(urlArray[i], function() {
  //           console.log("Site archived");          
  //         });
  //       }
  //     });
  //   }
  // });

};

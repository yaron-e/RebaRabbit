var http = require('http');
var path = require('path');
var fs = require('fs');
const url = require('url'); 


var verifyMimeType = true;
var port = 8080;

console.log("Starting web server: localhost" + ":" + port);

var server = http.createServer(function(req,res){
  // set to URL or default to index.html
  //var filename = "/index.html"
  var parsedUrl;
  if (req.url == '/')
	parsedUrl = url.parse('/index.html');
  else
	parsedUrl = url.parse(req.url);
  var filename = url.resolve('/', parsedUrl.pathname);
  
  console.log("Filename is: " + filename);
  // sets the extention of the filename
  var ext = path.extname(filename);
  var localPath = __dirname;
  console.log("Local path: "+ localPath);
  var validExtentions ={
    ".html" : "text/html",
    ".js": "application/javascript",
    ".css": "text/css",
    ".txt": "text/plain",
    ".jpg": "image/jpeg",
    ".gif": "image/gif",
    ".png": "image/png",
	".mp4": "video/mp4"
  };

  var validMimeType = true;
  var mimeType = validExtentions[ext];
  if(verifyMimeType){
    validMimeType = validExtentions[ext] != undefined;
  }

  if(validMimeType){
    localPath += filename;
    fs.exists(localPath, function(exists){
      if(exists){
        console.log("Serving file: " + localPath);
        getFile(localPath,res,mimeType);
      }
      else{
        console.log("File not found: " + localPath);
        res.writeHead(404);
        res.end();
      }
    });
  }
  else{
    console.log("Invalid file extention detected: " + ext);
    console.log("Invalid file name: " + filename);
  }
});

server.listen(port);

function getFile(localPath, res, mimeType){
  fs.readFile(localPath, function(err, data){
    if(err){
      console.log("Error with reading file: ("+ err + ")");
      res.writeHead(500);
      res.end();
    }
    else{
      res.setHeader("Content-Length", data.length);
      if(mimeType != undefined){
        res.setHeader("Content-Type", mimeType);
      }
      res.statusCode = 200;
      // the end does two things, it write to the response and
      // ends the response.
      res.end(data);
    }
  });
}

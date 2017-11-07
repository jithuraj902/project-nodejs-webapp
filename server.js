var http = require('http');
var port = process.env.port || 8092;
var fs = require("fs");
var url = require("url");
var path = require("path");

http.createServer(function (request, response) {
    var match = request.url.match(/^\/img\/.+/);
    if (match !== null) {
        var len = request.url.length;
        var filename = request.url.substr(1, len);        
        sendFileContent(response, filename, "image/svg+xml");

    }
    else
    {
        if (request.url === "/" || request.url === "/index") {            
            console.log(request.url);
            response.writeHead(200, { 'Content-Type': 'text/html' });
            sendFileContent(response, "index.html", "text/html");            
        }
        else if (/^\/[a-zA-Z0-9\/]*.js$/.test(request.url.toString())) {
            sendFileContent(response, request.url.toString().substring(1), "text/javascript");
        }
        else if (/^\/[a-zA-Z0-9\/]*.css$/.test(request.url.toString())) {
            sendFileContent(response, request.url.toString().substring(1), "text/css");
        }
        else if (/^\/[a-zA-Z0-9\/]*.ttf$/.test(request.url.toString())) {
            sendFileContent(response, request.url.toString().substring(1), "font/opentype");
        }
        else {
            console.log("Requested URL is: " + request.url);
            response.end();
        }
    }
}).listen(port);

function sendFileContent(response, fileName, contentType) {
    fs.readFile(fileName, function (err, data) {
        if (err) {
            response.writeHead(404);
            response.write("Not Found!");
        }
        else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.write(data);
        }
        response.end();
    });
}

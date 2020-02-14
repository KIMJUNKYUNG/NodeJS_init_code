var http = require('http');
var fs = require('fs');
var url = require('url');

var app = http.createServer(function(request,response){
    var _url = request.url;
    
    var queryString = url.parse(_url, true).query;
    var title = queryString.id;
    var pathName = url.parse(_url, true).pathname;

    console.log(url.parse(_url, true));
    if(pathName === '/'){
      fs.readdir("./data","utf8", function(err, dataList){
        var list = "<ul>";
        dataList.forEach(function(fileName){
            list += `<li><a href = /?id=${fileName}>`;
            list += fileName;
            list += `</a></li>`;
        })
        list += "</ul>";
        
        fs.readFile(`./data/${title}`,function(err, description){
        if(description === undefined){
          title = "welcome food";
          description = "welcome drink";
        }
        var template = `
              <!doctype html>
          <html>
          <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
          </head>
          <body>
            <h1><a href="/">WEB</a></h1>
            ${list}
            <h2>${title}</h2>
            <p>${description}</p>
          </body>
          </html>
          `

          response.writeHead(200);
          response.end(template);
        })
      })
    }else{
          response.writeHead(404);
          response.end('not found');
    }
 
});
app.listen(3000);
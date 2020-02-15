var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./templateModule.js');

var app = http.createServer(function(request,response){
    var _url = request.url;
    
    var queryString = url.parse(_url, true).query;
    var title = queryString.id;
    var pathName = url.parse(_url, true).pathname;

    if(pathName === '/'){
      fs.readdir("./data","utf8", function(err, dataList){
        var list = template.list(dataList);

        fs.readFile(`./data/${title}`,function(err, description){
        var control = `
        <a href="/create">create</a>
        <a href="/update?id=${title}">update</a>
        <form action ="/process_delete" method = "POST" >
          <input type = "hidden" name = "id" value = "${title}">
          <input type = "submit" value = "delete">
        </form>`;
        if(description === undefined){
          title = "welcome food";
          description = "welcome drink";
          control = `<a href="/create">create</a>`
        }

        var HTML = template.html(title, list,`<h2>${title}</h2><p>${description}</p>`, control);

          response.writeHead(200);
          response.end(HTML);
        })
      })
    }else if(pathName === "/create"){
      fs.readdir("./data","utf8", function(err, dataList){
        var list = template.list(dataList);

        var title = "create Page";

        var HTML = template.html(title, list,
          `
        <form action = "/process_create" method = "POST">
            <p><input type = "text" name = "title" placeholder="title"></p>
            <p><textarea name = "description" placeholder ="description"></textarea></p>
            <p><input type = "submit"></p>
        </form>
        `,'');

        response.writeHead(200);
        response.end(HTML);
        })
    }else if(pathName === "/process_create"){
        var body = "";
        request.on("data",function(data){
            body += data;
        })
        request.on("end", function(){
            var post = qs.parse(body);
            var title = post.title;
            var description = post.description;

            fs.writeFile(`./data/${title}`, description, "utf8", function(err){
              response.writeHead(302,{Location : `/?id=${title}`});
              response.end("success");
            })
        })
    }else if(pathName === "/update"){
      fs.readdir("./data",function(err, dataList){

        var list = template.list(dataList);
        fs.readFile(`./data/${title}`,function(err, description){
          var HTML = template.html(title, list,`
          <form action = "/process_update" method = "POST">
              <input type = "hidden" name = "idKey" value = ${title}>
              <p><input type = "text" name = "title" placeholder="title" value ="${title}"></p>
              <p><textarea name = "description" placeholder ="description"}>"${description}"</textarea></p>
              <p><input type = "submit"></p>
          </form>
          `, "");

            response.writeHead(200);
            response.end(HTML);
          })
      })
    }else if(pathName === "/process_update"){
      var body = "";
        request.on("data",function(data){
            body += data;
        })
        request.on("end", function(){
            var post = qs.parse(body);
            var id = post.idKey;
            var title = post.title;
            var description = post.description;

            fs.rename(`./data/${id}`,`./data/${title}`,function(err){
              fs.writeFile(`./data/${title}`,description,"utf8",function(){
                response.writeHead(302,{Location : `/?id=${title}`});
                response.end("success");
              })
            })
        })
    }else if(pathName === "/process_delete"){
      var body = "";
        request.on("data",function(data){
            body += data;
        })
        request.on("end", function(){
            var post = qs.parse(body);
            var id = post.id;
            
            fs.unlink(`./data/${id}`,function(err){
              response.writeHead(302,{Location : `/`});
              response.end("success");
            })
        })
    }else{
          response.writeHead(404);
          response.end('not found');
    }
 
});
app.listen(3000);
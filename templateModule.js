module.exports = {
    html : function (title, list, body, control){
      return `
            <!doctype html>
          <html>
          <head>
          <title>WEB1 - ${title}</title>
          <meta charset="utf-8">
          </head>
          <body>
          <h1><a href="/">WEB</a></h1>
          ${list}
          ${control}
          ${body}
          </body>
          </html>
          `
    },
    list : function makeList(dataList){
      var listTemplate = "<ul>";
      dataList.forEach(function(fileName){
          listTemplate += `<li><a href = /?id=${fileName}>`;
          listTemplate += fileName;
          listTemplate += `</a></li>`;
      })
      listTemplate += "</ul>";
    
      return listTemplate
    }  
  }
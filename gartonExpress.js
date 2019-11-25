const express = require('express');
const app = express();
app.use(express.static('public'));
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/description.txt');
});
app.listen(process.env.PORT, _ => console.log('Markdown Webserver is running!'));
setInterval(_=>{})

const express = require('express')
var favicon = require('serve-favicon')
var path = require('path')


const app = express()
const port = process.env.PORT || 3000


app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'public','index.html'));
  });

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
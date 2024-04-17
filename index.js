const express = require('express');
const app = express(); 

app.get('/', function (req, res) {
  res.send('Hello World');
});

app.get('/oi', function (req, res) {
   res.send('Olá Mundo');
});

// lista de itens
const lista = ['NextJS', 'NodeJS', 'Firebase'];

//endpoit Read All => GET /item
app.get('/item', function(req, res){
  res.send(lista)
})


app.listen(8000);
const express = require('express');
const app = express(); 
app.use(express.json());

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
});

//endpoint Read By ID => GET /item/:id
app.get('/item/:id', function(req, res){
  const id = req.params.id;
  const item = lista[id - 1];
  res.send(item);
});


//endpoint Create => POST /item
app.post('/item', function(req, res){
  const item = req.body.nome;
  lista.push(item);
  res.send("Item adicionado com sucesso " + item);
});

//endpoint Update => PUT /item/:id
app.put('/item/:id', function(req, res){
  const id = req.params.id;
  const novoItem = req.body.nome;
  lista[id - 1] = novoItem;
  res.send("Item atualizado com sucesso " + id + ". " + novoItem)
});

//endpoint DELETE => /item/:id
app.delete('/item/:id', function(req, res){
  const id = req.params.id;
  delete lista[id - 1]
  res.send("Item removido com sucesso " + id)
});

app.listen(8000);
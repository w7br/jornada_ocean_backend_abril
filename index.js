require('dotenv').config();
const express = require('express')
const { MongoClient, ObjectId } = require('mongodb')

const dbUrl = process.env.DATABASE_URL;
const dbName = 'ocean-jornada-backend'

async function main() {
  console.log('Conectando ao banco de dados...');
  const client = new MongoClient(dbUrl);
  await client.connect();
  console.log('Banco de dados conectado com sucesso!');

  const app = express();
  // Especificamos que o corpo da requisição será em JSON
  app.use(express.json());

  const db = client.db(dbName);
  const collection = db.collection('item');

  // Endpoint Read All -> [GET] /item
  app.get('/item', async function (req, res) {
    // Buscamos todos os documentos na collection
    const itens = await collection.find().toArray();

    // Enviamos como resposta
    res.send(itens);
  })


  // Endpoint Read By ID -> [GET] /item/:id
  app.get('/item/:id', async function (req, res) {
    // Acessamos o parâmetro de rota ID
    const id = req.params.id;

    // Acessamos o item na collection (usando o ObjectId)
    // e colocamos na variável item
    const item = await collection.findOne({ _id: new ObjectId(id) });

    if(!item){
      return res.status(404).send("Item não encontrado")
    }

    // Enviamos para a resposta o item acessado
    res.send(item);
  })

  

  // Endpoint Create -> [POST] /item
  app.post('/item', async function (req, res) {
    // Pegamos o item através do corpo da requisição
    const item = req.body;

    if(!item.nome){
      return res.status(400).send("campo de requisição sem o campo 'nome'")
    }

    // Adicionamos o item obtido na collection
    await collection.insertOne(item);

    // Exibimos o item adicionado
    res.status(201).send(item);
  })



  // Endpoint Update -> [PUT] /item/:id
  app.put('/item/:id', async function (req, res) {
    // Obtemos o ID do parâmetro de rota
    const id = req.params.id;

    // Obtemos o corpo da requisição para saber qual o novo valor
    const novoItem = req.body;

    // Atualizamos o item na collection
    const updateResult = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: novoItem }
    )
    
    if(updateResult.matchedCount === 0){
      return res.status(404).send("item não encontrado")
    }

    // Enviamos uma mensagem de sucesso
    res.send('Item atualizado com sucesso: ' + id);
  })

  //NOTA: 
// collection.updateOne({ _id: new ObjectId(id) }, { $set: novoItem }): Aqui, estamos atualizando o item na coleção MongoDB. Estamos dizendo ao MongoDB para encontrar um documento na coleção que tenha um ‘_id’ que corresponda ao ‘id’ que obtivemos dos parâmetros da rota e atualizar esse documento para ter o novo valor que obtivemos do corpo da solicitação.

// O new ObjectId(id) é usado para converter a string ‘id’ em um ObjectId do MongoDB, que é o tipo de dado usado pelo MongoDB para os IDs dos documentos. Isso é necessário porque o MongoDB não pode comparar diretamente strings com ObjectIds. 




  // Endpoint Delete -> [DELETE] /item/:id
  app.delete('/item/:id', async function (req, res) {
    // Obtemos o ID do parâmetro de rota
    const id = req.params.id;

    // Removemos o item da collection
    const deleteResult = await collection.deleteOne({ _id: new ObjectId(id) });

    if(deleteResult.deletedCount === 0){
      return res.status(404).send("Item não encontrado")
    }

    // Exibimos uma mensagem de sucesso
    res.send('Item removido com sucesso: ' + id);
  })



  app.listen(8000)
}

main()
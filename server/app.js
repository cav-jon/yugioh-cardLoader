import express from "express";
import { DeckDatabase } from "./db/DeckDb.js";
//Inicialização do Servidor via Express

const server = express();
const database = new DeckDatabase();

//Permite comunicação do frontend com o Serviço
server.use((req, res, next) => {
  res.header({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS, PUT, PATH, DELETE,POST",
  });
  next();
});

//Permite o servidor utilizar o corpo da requisição com JSON
server.use(express.json());

//Inicializa o servidor
server.listen(3333);

server.get("/", (req, res) => {
  res.send("200 OK");
});

//Função para retornar carta aleatória no sistema
server.get("/card", async function (req, res) {
  const resCard = await fetch(
    "https://db.ygoprodeck.com/api/v7/randomcard.php"
  ).then((card) => card.json());

  const resCardDetails = {
    id: resCard.id,
    name: resCard.name,
    card_img: resCard.card_images[0],
  };

  res.send(resCardDetails);
});

//Função para retornar carta selecionada pelo site
server.get("/card/:id", async function (req, res) {
  //tenta buscar a carta selecionada na API
  try {
    const resCard = await fetch(
      `https://db.ygoprodeck.com/api/v7/cardinfo.php?id=${req.params.id}&language=pt`
    ).then((card) => card.json());

    const resCardDetails = {
      name: resCard.data[0].name,
      type: resCard.data[0].type,
      desc: resCard.data[0].desc,
      atk: resCard.data[0].atk,
      def: resCard.data[0].def,
      card_img: {
        image_url: resCard.data[0].card_images[0].image_url,
        image_url_small: resCard.data[0].card_images[0].image_url_small,
      },
    };

    res.send(resCardDetails);
  } catch (error) {
    res.send("No Card Found");
  }
});

//Função para adicionar carta selecionada ao deck de draft
server.post("/card",(req,res) => {
    const { cardID, cardName } = req.body
    database.create({
      cardID,
      cardName
    }); 
   return res.status(201).send();
});


//Listar o deck com as cartas adicionadas
server.get("/deck", (req,res)=>{
    const deck = database.list();
    return res.send(deck);
})


/* 
export async function getCard(id) {
    const resCard = await fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?id=${id}`).then((res)=> res.json());
    const resCardDetails = {
        name: resCard.data[0].name,
        desc: resCard.data[0].desc,
        atk: resCard.data[0].atk,
        def: resCard.data[0].def,
};
    
    return(resCardDetails);
}
*/

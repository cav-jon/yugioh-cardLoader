//Instanciar Modal ao documento
document.addEventListener("DOMContentLoaded", () => {
  var elems = document.querySelectorAll(".modal");
  var instances = M.Modal.init(elems);
});

const url = "https://localhost:4000/";

let getCard = () => {
  // Limpa a seleção de cartas anteriores e remove a classe pulsar do botão
  card_pack.innerHTML = "";
  document.querySelector("#btn-abrir-pacote").classList.add("disabled");

  // Faz o sorteio das cartas aleatoriamente
  for (let index = 0; index <= 5; index++) {
    axios
      .get(url + "card/")
      .then((res) => {
        const card_pack = document.querySelector("#card_pack");

        var li = document.createElement("li");
        li.classList.add("col", "m2");

        li.innerHTML = `<a href="card_details.html?id=${res.data.id}"><img class="responsive-img" src='${res.data.card_img.image_url_small}' alt='${res.data.name}'>${res.data.name}</a>`;

        card_pack.appendChild(li);
      })
      .catch((error) => console.error(error));
  }

  //Adiciona a classe pulsar no botão e altera o texto para abrir novo pacote
  document.querySelector("#btn-abrir-pacote").classList.add("pulse");
  document.querySelector("#btn-abrir-pacote").innerHTML = "Abrir Novo Pacote";
};

//Função para carregar os detalhes da carta escolhida
let cardDetail = () => {
  //verifica se a carta já foi selecionada
  const isCardView = urlParams.get("v");

  //invalida o botão de Adicionar ao deck para carta já selecionada
  var btnAddToDeck = document.querySelector('#btn-adicionar');
  isCardView === "true" ? btnAddToDeck.remove() : false

  //Elementos do Frontend que serão editados
  var card_name = document.querySelector("#card_name");
  var card_type = document.querySelector("#card_type");
  var card_desc = document.querySelector("#card_desc");
  var card_atk = document.querySelector("#card_atk");
  var card_def = document.querySelector("#card_def");
  var card_img = document.querySelector("#card_img");

  //Captura o ID da carta passado na tela anterior
  const cardID = urlParams.get("id");

  //Realiza a busca da carta conforme a API do servidor
  axios
    .get(url + "card/" + cardID)
    .then((res) => {
      const cardDetails = res.data;

      card_name.innerHTML = `<b>Nome:</b> ${cardDetails.name}`;
      card_type.innerHTML = `<b>Tipo:</b> ${cardDetails.type}`;
      card_desc.innerHTML = `<b>Descrição:</b> ${cardDetails.desc}`;

      // Valida se é uma carta mágica/armadilha e remove as informações de ataque e defesa da carta
      cardDetails.atk === undefined
        ? card_atk.remove()
        : (card_atk.innerHTML = `<b>Ataque:</b> ${cardDetails.atk}`);

      cardDetails.def === undefined
        ? card_def.remove()
        : (card_def.innerHTML = `<b>Defesa:</b> ${cardDetails.def}`);

      // valida se a carta possui imagem de tamanho pequeno ou grande
      cardDetails.card_img.image_url_small === undefined
        ? (card_img.src = cardDetails.card_img.image_url)
        : (card_img.src = cardDetails.card_img.image_url_small);
    })
    .catch((error) => console.error(error));
};

let callList = () => {
  const deckList = axios.get(url + "deck").then((res) => res.data);
  return deckList;
};

//Constroi o modal do deck
let constructDeckModal = async () => {
  const previousDeckList = await callList();
  const cardID = +urlParams.get("id");
  let cardName = document.querySelector("#card_name").innerText.replace('Nome: ','');
  
  const deckUnList = document.querySelector('#deck-list');
  
  //Carrega a lista anterior de cartas selecionadas
  previousDeckList.forEach(card => {
    const itemList = document.createElement('li');
    itemList.innerHTML = `<a href="card_details.html?id=${card.cardID}">${card.cardName}</a>`;
    deckUnList.appendChild(itemList);
  });

  //Adiciona a carta a lista
    const newItemList = document.createElement('li')
    newItemList.innerHTML = `<a href="card_details.html?id=${cardID}&&v=true">${cardName}</a>`
    deckUnList.appendChild(newItemList);
}

let addToDeck = () => {
  //Captura id da carta passada por URL
  const cardID = +urlParams.get("id");
  let cardName = document.querySelector("#card_name").innerText.replace('Nome: ','');
  const options = {
    method: "POST",
    headers: { "content-type": "application/json" },
    data: { cardID: cardID, cardName : cardName },
    url: url + "card",
  };

  //Cria objeto que vai ser adcionado ao banco de dados
  axios(options)
    .then(constructDeckModal())
    .catch((error) => console.error(error));
};

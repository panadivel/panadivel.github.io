'use strict';

// *****MODEL*****

var model = {
  pairOfCards: 9, // we can set any number of pairs here
  pointsPerGuess: 42,
  cards: [],
  points: 0,
  cardsGuessed: 0,

  initDeckOfCards: function initDeckOfCards() {
    var allCards = ['2C', '2D', '2H', '2S', '3C', '3D', '3H', '3S', '4C', '4D', '4H', '4S', '5C', '5D', '5H', '5S', '6C', '6D', '6H', '6S', '7C', '7D', '7H', '7S', '8C', '8D', '8H', '8S', '9C', '9D', '9H', '9S', '0C', '0D', '0H', '0S', 'JC', 'JD', 'JH', 'JS', 'QC', 'QD', 'QH', 'QS', 'KC', 'KD', 'KH', 'KS', 'AC', 'AD', 'AH', 'AS'];
    var deckOfCards = [];
    for (var i = 0; i < this.pairOfCards; i++) {
      var card = Math.floor(Math.random() * allCards.length);
      deckOfCards.push({ name: allCards[card], src: 'img/Cards/' + allCards[card] + '.png' });
      deckOfCards.push({ name: allCards[card], src: 'img/Cards/' + allCards[card] + '.png' });
      allCards.splice(card, 1);
    }
    return deckOfCards;
  },

  shuffleCards: function shuffleCards() {
    var deckOfCards = this.initDeckOfCards();
    var copy = [];
    var n = deckOfCards.length;
    var i = void 0;

    while (n) {
      i = Math.floor(Math.random() * deckOfCards.length);
      // If not already shuffled, move it to the new array.
      if (i in deckOfCards) {
        copy.push(deckOfCards[i]);
        delete deckOfCards[i];
        n--;
      }
    }
    this.cards = copy;
    for (var _i = 0; _i < this.cards.length; _i++) {
      this.cards[_i].id = _i;
    }
  },

  isGuessed: function isGuessed(card1, card2) {
    if (card1.name == card2.name) {
      this.points += this.pointsPerGuess * (this.pairOfCards * 2 - this.cardsGuessed);
      this.cardsGuessed += 2;
      return true;
    } else {
      this.points -= this.pointsPerGuess * (this.pairOfCards * 2 - this.cardsGuessed);
      return false;
    }
  },

  isFinished: function isFinished() {
    if (this.cardsGuessed === this.pairOfCards * 2) {
      return true;
    } else {
      return false;
    }
  },

  init: function init() {
    this.shuffleCards();
  }
};

// *****VIEW*****

var view = {
  initDeck: function initDeck() {
    var output = '<div class="Deck__row">';
    for (var i = 0; i < model.pairOfCards * 2; i++) {
      output += '<div class="Deck__cell"><img data-tid="Card" src="' + model.cards[i].src + '" alt="card" class="Deck__img" id="' + model.cards[i].id + '"></div>';
      if ((i + 1) % 6 === 0) {
        output += '</div><div class="Deck__row">';
      }
    }
    output += '</div>';
    document.getElementById('Deck').innerHTML = output;
  },

  flipAllCards: function flipAllCards() {
    var allCards = document.getElementsByClassName('Deck__img');
    for (var i = 0; i < allCards.length; i++) {
      allCards[i].src = "img/Cards/back.png";
    }
  },

  endOfGame: function endOfGame() {
    var endOfGameHtml = '<div class="endGame">\n                            <img src="img/Group 2.png" alt="#" class="mainMenu__img">\n                            <h2 class="mainMenu__header endGame__header">\u041F\u043E\u0437\u0434\u0440\u0430\u0432\u043B\u044F\u0435\u043C!<br>\u0412\u0430\u0448 \u0438\u0442\u043E\u0433\u043E\u0432\u044B\u0439 \u0441\u0447\u0435\u0442: <span id="points">' + model.points + '</span></h2>\n                            <h2 class="mainMenu__header endGame__header"></h2>\n                            <a href="game.html" class="mainMenu__btn endGame__btn" data-tid="EndGame-retryGame">\u0415\u0449\u0435 \u0440\u0430\u0437</a>\n                          </div>';
    document.body.innerHTML = endOfGameHtml;
  },

  init: function init() {
    this.initDeck();
    setTimeout(this.flipAllCards, 5000);
  }
};

// *****CONTROLLER*****

var controller = {

  eventListenerAdder: function eventListenerAdder() {
    var flippedCardsId = new Array(); // array for control amount of flipped cards
    var allCards = document.querySelectorAll('.Deck__img'); // push all cards in deck to array

    var _loop = function _loop(i) {
      // add event listener on each card
      var currentCard = allCards[i];
      currentCard.onclick = function () {
        currentCard.src = model.cards[i].src; // change src from back.png to front.png (flip card)
        currentCard.setAttribute("data-tid", "Card-flipped"); // for tests
        flippedCardsId.push(currentCard.id);

        if (flippedCardsId.length == 2) {
          var cardId1 = flippedCardsId[0];
          var cardId2 = flippedCardsId[1];
          flippedCardsId = [];
          if (model.isGuessed(model.cards[cardId1], model.cards[cardId2])) {
            setTimeout(function () {
              document.getElementById(cardId1).src = "img/Cards/transparent.png";
              document.getElementById(cardId1).onclick = null;
              document.getElementById(cardId2).src = "img/Cards/transparent.png";
              document.getElementById(cardId2).onclick = null;
              document.getElementById('gameMenu__value').innerHTML = model.points;
            }, 600);
          } else {
            setTimeout(function () {
              document.getElementById(cardId1).src = "img/Cards/back.png";
              document.getElementById(cardId2).src = "img/Cards/back.png";
              document.getElementById(cardId1).setAttribute("data-tid", "Card");
              document.getElementById(cardId2).setAttribute("data-tid", "Card");
              document.getElementById('gameMenu__value').innerHTML = model.points;
            }, 600);
          }
        }
        if (model.isFinished()) {
          setTimeout(view.endOfGame, 1000);
        }
      };
    };

    for (var i = 0; i < allCards.length; i++) {
      _loop(i);
    }
  },

  startGame: function startGame() {
    model.init();
    view.init();
    this.eventListenerAdder();
  }

};

// *****START APPLICATION*****

controller.startGame();
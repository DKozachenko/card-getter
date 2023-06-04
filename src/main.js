'use strict'

import { getRussianSuit, getRussianValue } from './utils.js';
import { PlayingCard, createPlayingCard } from './playing-card.js';

const state = new Proxy({
  queryParams: {
    cardNumber: 1,
  },
  viewParams: {
    translate: false
  },
  cards: []
}, {
  set(state, property, value) {    
    if (property === 'cards') {
      const contentList = document.querySelector('.content__list');

      for (var i = contentList.children.length - 1; i >= 0; --i) {
        contentList.children[i].remove();
      }

      for (let card of value) {
        if (state.viewParams.translate) {
          card = {
            ...card,
            suit: getRussianSuit(card.suit),
            value: getRussianValue(card.value)
          }
        }
        contentList.append(createPlayingCard(card));
      }
    }

    return Reflect.set(state, property, value);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  customElements.define(
    'playing-card',
    PlayingCard 
  );

  const headerForm = document.querySelector('.header__form');
  const cardNumberRange = document.querySelector('.card__number-range');
  const cardTranslate = document.querySelector('.card__translate');

  headerForm.addEventListener('submit', (e) => {
    state.cards = [];
    e.preventDefault();

    fetch(`https://deckofcardsapi.com/api/deck/new/draw/?count=${state.queryParams.cardNumber}`)
      .then(resp => resp.json())
      .then(data => {
        state.cards = data.cards;
      });
  });

  cardNumberRange.addEventListener('change', (e) => {
    const value = +(e.target.value);
    state.queryParams.cardNumber = value;
  });

  cardTranslate.addEventListener('click', (e) => {
    const value = !e.target.previousElementSibling.checked;
    state.viewParams.translate = value;
  });
});

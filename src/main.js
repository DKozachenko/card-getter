'use strict'

import { getRussianSuit, getRussianValue } from './utils.js';
import { PlayingCard, createPlayingCard } from './playing-card.js';
import { RequestForm } from './request-form.js';

const state = new Proxy({
  cards: []
}, {
  set(state, property, value) {    
    if (property === 'cards') {
      const contentList = document.querySelector('.content__list');

      for (var i = contentList.children.length - 1; i >= 0; --i) {
        contentList.children[i].remove();
      }

      for (const card of value) {
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

  customElements.define(
    'request-form',
    RequestForm 
  );

  const requestForm = document.querySelector('request-form');
  const clearAllButton = document.querySelector('.clear__all');

  requestForm.addEventListener('get-cards', (e) => {
    state.cards = [];

    fetch(`https://deckofcardsapi.com/api/deck/new/draw/?count=${e.detail.queryParams.cardNumber}`)
      .then(resp => resp.json())
      .then(data => {
        const cardsForView = data.cards.map(card => {
          if (e.detail.viewParams.translate) {
            return {
              ...card,
              suit: getRussianSuit(card.suit),
              value: getRussianValue(card.value)
            }
          }
          return card;
        });
        state.cards = cardsForView;
      });
  });

  clearAllButton.addEventListener('click', () => {
    state.cards = [];
  });
});

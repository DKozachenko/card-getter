'use strict'

import { getRussianSuit, getRussianValue } from './utils.js';

const state = new Proxy({
  queryParams: {
    cardNumber: 1,
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
        const playingCard = document.createElement('playing-card');

        if (state.queryParams.translate) {
          card = {
            ...card,
            suit: getRussianSuit(card.suit),
            value: getRussianValue(card.value)
          }
        } 
        playingCard.setAttribute('card', JSON.stringify(card));
        contentList.append(playingCard);
      }
    }

    return Reflect.set(state, property, value);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const template = document.querySelector('template[name="playing-card"]');
  class PlayingCard extends HTMLElement {
    constructor() {
      super();
      const component = template.content.children[0].cloneNode(true);
      this.attachShadow({ mode: 'open' }).appendChild(component);

      const style = document.createElement("style");
      style.textContent = `.card {
        width: 100%;
        max-width: 300px;
        margin-bottom: 10px;
      }
      
      .card__image {
        display: flex;
        justify-content: center;
        align-items: center;
      
        max-height: 300px;
        overflow: hidden;
      }
      
      .card__image img {
        display: block;
        height: auto;
        width: 250%;
      }`;
      const linkElem = document.createElement('link');
      linkElem.setAttribute('rel', 'stylesheet');
      linkElem.setAttribute('href', 'https://unpkg.com/98.css');
      this.shadowRoot.append(style, linkElem);
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'card') {
        const card = JSON.parse(this.getAttribute(name));
        const title = this.shadowRoot.querySelector('.title-bar-text');
        const bodyP = this.shadowRoot.querySelector('.window-body p');
        const bodyImg = this.shadowRoot.querySelector('.window-body .card__image img');

        title.textContent = `Карта ${card.code}`;
        bodyP.textContent = `${card.value} ${card.suit}`;
        bodyImg.setAttribute('alt', card.code);
        bodyImg.setAttribute('src', card.images.svg);
      }
    }

    static get observedAttributes() {
      return ['card'];
    }
  }

  const componentName = template.getAttribute('name');
  customElements.define(
    componentName,
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
    state.queryParams.translate = value;
  });
});

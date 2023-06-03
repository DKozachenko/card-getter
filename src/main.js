'use strict'

const queryParams = {
  cardNumber: 1,
  translate: false
};

const cards = new Proxy([], {
  set(state, property, value) {
    console.log(property, value)
    const contentList = document.querySelector('.content__list');

    if (property === 'length' && value === 0) {
      for (const card of contentList.children) {
        contentList.removeChild(card);
      }
    } 
    if (property !== 'length') {
      const playingCard = document.createElement('playing-card');
      playingCard.setAttribute('card', JSON.stringify(value));
      contentList.append(playingCard);
    }


    return Reflect.set(state, property, value);
  }
});

const state = {
  queryParams,
  cards
};

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
    // state.cards = [];
    state.cards.splice(0, state.cards.length)
    e.preventDefault();

    fetch(`https://deckofcardsapi.com/api/deck/new/draw/?count=${state.queryParams.cardNumber}`)
      .then(resp => resp.json())
      .then(data => {
        // state.cards.push(...data.cards);
        state.cards.push(...data.cards.splice(0, 2));
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

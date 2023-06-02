'use strict'

const defaultHandler = {
  set(state, property, value) {
    console.log(state);
    console.log(`is being updated, value ${value}`);
    return Reflect.set(state, property, value);
  }
};

const createProxy = (data, handler = defaultHandler) => new Proxy(data, handler);

const queryParams = createProxy({
  cardNumber: 1,
  translate: false
});
const cards = createProxy([]);

const state = createProxy({
  queryParams,
  cards
});

const updateState = (state, propName, value) => state[propName] = value;

document.addEventListener('DOMContentLoaded', () => {
  const headerForm = document.querySelector('.header__form');
  const cardNumberRange = document.querySelector('.card__number-range');
  const cardTranslate = document.querySelector('.card__translate');

  headerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log(state)

    fetch(`https://deckofcardsapi.com/api/deck/new/draw/?count=${state.queryParams.cardNumber}`)
      .then(resp => resp.json())
      .then(data => state.cards = data.cards);
  });

  cardNumberRange.addEventListener('change', (e) => {
    const value = +(e.target.value);
    updateState(state.queryParams, 'cardNumber', value);
  });

  cardTranslate.addEventListener('click', (e) => {
    const value = !e.target.previousElementSibling.checked;
    updateState(state.queryParams, 'translate', value);
  });
});

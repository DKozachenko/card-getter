export class PlayingCard extends HTMLElement {
  constructor() {
    super();
    const template = document.querySelector('template[name="playing-card"]');
    const component = template.content.children[0].cloneNode(true);
    this.attachShadow({ mode: 'open' }).appendChild(component);
    
    const deleteButton = this.shadowRoot.querySelector('.remove');
    deleteButton.addEventListener('click', () => {
      const contentList = document.querySelector('.content__list');
      contentList.removeChild(this);
    });

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

export function createPlayingCard(card) {
  const playingCard = document.createElement('playing-card');
  playingCard.setAttribute('card', JSON.stringify(card));
  return playingCard;
}
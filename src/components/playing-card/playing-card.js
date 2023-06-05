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

    const linkElem = document.createElement('link');
    linkElem.setAttribute('rel', 'stylesheet');
    linkElem.setAttribute('href', 'components/playing-card/playing-card.css');
    this.shadowRoot.append(linkElem);

    const libLinkElem = document.createElement('link');
    libLinkElem.setAttribute('rel', 'stylesheet');
    libLinkElem.setAttribute('href', 'assets/98.css');
    this.shadowRoot.append(libLinkElem);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'card') {
      const card = JSON.parse(newValue);
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
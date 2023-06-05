export class RequestForm extends HTMLElement {
  constructor() {
    super();
    const template = document.querySelector('template[name="request-form"]');
    const component = template.content.children[0].cloneNode(true);
    this.attachShadow({ mode: 'open' }).appendChild(component);

    const linkElem = document.createElement('link');
    linkElem.setAttribute('rel', 'stylesheet');
    linkElem.setAttribute('href', 'components/request-form/request-form.css');
    this.shadowRoot.append(linkElem);

    const libLinkElem = document.createElement('link');
    libLinkElem.setAttribute('rel', 'stylesheet');
    libLinkElem.setAttribute('href', 'assets/98.css');
    this.shadowRoot.append(libLinkElem);

    this.queryParams = {
      cardNumber: 1
    };
    this.viewParams = {
      translate: false
    };

    const cardNumberRange = this.shadowRoot.querySelector('.card__number-range');
    const cardTranslate = this.shadowRoot.querySelector('.card__translate');

    cardNumberRange.addEventListener('change', (e) => {
      const value = +(e.target.value);
      this.queryParams.cardNumber = value;
    });
  
    cardTranslate.addEventListener('click', (e) => {
      const value = !e.target.previousElementSibling.checked;
      this.viewParams.translate = value;
    });

    const form = this.shadowRoot.querySelector('.request__form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const event = new CustomEvent('get-cards', {
        detail: {
          queryParams: this.queryParams,
          viewParams: this.viewParams
        } 
      });
      this.dispatchEvent(event);
    });
  }
}
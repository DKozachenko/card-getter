export class RequestForm extends HTMLElement {
  constructor() {
    super();
    const template = document.querySelector('template[name="request-form"]');
    const component = template.content.children[0].cloneNode(true);
    this.attachShadow({ mode: 'open' }).appendChild(component);

    const style = document.createElement("style");
    style.textContent = `.request__form {
      width: 100%;
      max-width: 300px;
    
      padding: 10px;
      border: 2px solid #0737a1;
      border-radius: 10px;
    }
    
    .field-row.button-row {
      display: flex;
      justify-content: center;
    }
    
    .field-row:not(:last-child) {
      margin-bottom: 15px;
    }
    
    .min {
      flex-basis: 65%;
    }`;
    const linkElem = document.createElement('link');
    linkElem.setAttribute('rel', 'stylesheet');
    linkElem.setAttribute('href', 'https://unpkg.com/98.css');
    this.shadowRoot.append(style, linkElem);

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
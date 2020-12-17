import { LitElement } from '../lit-element.js';
import { html } from '../lit-html.js';

export class WithSlot extends LitElement {
  render() {
    return html`<slot></slot>`;
  }
}

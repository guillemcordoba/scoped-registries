import { LitElement } from '../lit-element.js';
import { html } from '../lit-html.js';
import { Foo } from './Foo.js';
import { WithSlot } from './WithSlot.js';

export class WithLightDom extends LitElement {
  static get properties() {
    return {
      show: {
        type: Boolean,
      },
    };
  }

  createRenderRoot() {
    const registry = new CustomElementRegistry();
    registry.define('foo-foo', Foo);
    registry.define('with-slot', WithSlot);
    return this.attachShadow({ mode: 'open', customElements: registry });
  }

  firstUpdated() {
    setTimeout(() => (this.show = true), 300);
  }
  render() {
    return this.show
      ? html`<with-slot><foo-foo></foo-foo></with-slot>`
      : html``;
  }
}

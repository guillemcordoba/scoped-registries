/* eslint max-classes-per-file:0, no-global-assign:0 */
import { expect } from '@open-wc/testing';
import {
  getTestTagName,
  getTestElement,
  getScopedShadowRoot,
  createTemplateElement,
  wrapHTML,
} from './utils.js';

import '../index.js'; // loads the polyfill

describe('polyfillShadowRoot', () => {
  describe('global registry', () => {
    describe('createElement', () => {
      it('should create a scoped custom element', async () => {
        const tagName = getTestTagName();
        const shadowRoot = getScopedShadowRoot();

        const $el = shadowRoot.createElement(tagName);

        expect($el.tagName.toLowerCase()).to.be.equal(tagName);
        expect($el.outerHTML).to.equal(`<${tagName}></${tagName}>`);
      });

      it('should create a regular element', async () => {
        const tagName = 'div';
        const shadowRoot = getScopedShadowRoot();

        const $el = shadowRoot.createElement(tagName);

        expect($el.tagName.toLowerCase()).to.equal(tagName);
        expect($el.outerHTML).to.equal(`<div></div>`);
      });
    });
  });

  describe('scoped registry', () => {
    describe('createElement', () => {
      it('should create a scoped custom element', async () => {
        const tagName = getTestTagName();
        const shadowRoot = getScopedShadowRoot(new CustomElementRegistry());

        const $el = shadowRoot.createElement(tagName);

        expect($el.tagName.toLowerCase()).to.be.equal(tagName);
        expect($el.outerHTML).to.match(
          new RegExp(`<${tagName}-\\d{1,5}></${tagName}-\\d{1,5}>`)
        );
      });

      it('should create a regular element', async () => {
        const tagName = 'div';
        const shadowRoot = getScopedShadowRoot(new CustomElementRegistry());

        const $el = shadowRoot.createElement(tagName);

        expect($el.tagName.toLowerCase()).to.equal(tagName);
        expect($el.outerHTML).to.be.equal('<div></div>');
      });

      it('should set the shadowRoot as the scope of regular elements', async () => {
        const tagName = 'div';
        const shadowRoot = getScopedShadowRoot(new CustomElementRegistry());

        const $el = shadowRoot.createElement(tagName);

        expect($el.scope).to.equal(shadowRoot);
      });
    });

    describe('importNode', () => {
      describe('deep = false', () => {
        it('should import a basic node', async () => {
          const shadowRoot = getScopedShadowRoot();
          const $div = document.createElement('div');

          const $clone = shadowRoot.importNode($div, false);

          expect($clone.outerHTML).to.be.equal('<div></div>');
        });

        it('should import a basic template content', async () => {
          const shadowRoot = getScopedShadowRoot();
          const $template = createTemplateElement('<div></div>');

          const $clone = shadowRoot.importNode($template.content, false);

          expect($clone).to.be.instanceof(DocumentFragment);
          expect($clone.childNodes.length).to.be.equal(0);
        });
      });

      describe('deep = true', () => {
        it('should import a basic node', async () => {
          const shadowRoot = await getScopedShadowRoot();
          const $div = document.createElement('div');

          const $clone = shadowRoot.importNode($div, true);

          expect($clone.outerHTML).to.be.equal('<div></div>');
        });

        it('should import a node tree', async () => {
          const registry = new CustomElementRegistry();
          const shadowRoot = getScopedShadowRoot(registry);
          const html = '<span>sample</span>';
          const $div = wrapHTML(html);

          const $clone = shadowRoot.importNode($div, true);

          expect($clone.innerHTML).to.be.equal(html);
        });

        it('should import a node tree with an upgraded custom element', async () => {
          const { tagName, Element } = getTestElement();
          customElements.define(tagName, Element);

          const registry = new CustomElementRegistry();
          const shadowRoot = getScopedShadowRoot(registry);
          const $div = wrapHTML(
            `<${tagName}><span>data</span></${tagName}>`,
            document
          );

          const $clone = shadowRoot.importNode($div, true);

          expect($clone.innerHTML).to.be.equal(
            `<${tagName}><span>data</span></${tagName}>`
          );
        });

        it('should import a node tree with a non upgraded custom element', async () => {
          const tagName = getTestTagName();
          const registry = new CustomElementRegistry();
          const shadowRoot = getScopedShadowRoot(registry);
          const $div = wrapHTML(`<${tagName}><span>data</span></${tagName}>`);

          const $clone = shadowRoot.importNode($div, true);

          expect($clone.innerHTML).to.match(
            new RegExp(
              `<${tagName}-\\d{1,5}><span>data</span></${tagName}-\\d{1,5}>`
            )
          );
        });

        it('should import a basic template', async () => {
          const shadowRoot = getScopedShadowRoot();
          const $template = createTemplateElement('<div></div>');

          const $clone = shadowRoot.importNode($template.content, true);

          expect($clone).to.be.instanceof(DocumentFragment);
          expect($clone.childNodes.length).to.be.equal(1);
          expect($clone.firstElementChild.outerHTML).to.be.equal('<div></div>');
        });

        it('should import a complex template', async () => {
          const shadowRoot = getScopedShadowRoot();
          const html = '<div><span>sample</span></div><span></span>';
          const $template = createTemplateElement(html);

          const $clone = shadowRoot.importNode($template.content, true);

          expect($clone).to.be.instanceof(DocumentFragment);
          expect($clone.childNodes.length).to.be.equal(2);
          expect($clone.firstElementChild.outerHTML).to.be.equal(
            '<div><span>sample</span></div>'
          );
        });

        it('should import a template with an upgraded custom element', async () => {
          const { tagName, Element } = getTestElement();
          customElements.define(tagName, Element);

          const registry = new CustomElementRegistry();
          const shadowRoot = getScopedShadowRoot(registry);
          const $template = createTemplateElement(
            `<${tagName}><span>data</span></${tagName}>`
          );

          const $clone = shadowRoot.importNode($template.content, true);

          expect($clone).to.be.instanceof(DocumentFragment);
          expect($clone.childNodes.length).to.be.equal(1);
          expect($clone.firstElementChild.outerHTML).to.match(
            new RegExp(
              `<${tagName}-\\d{1,5}><span>data</span></${tagName}-\\d{1,5}>`
            )
          );
        });

        it('should import a template with a non upgraded custom element', async () => {
          const { tagName } = getTestElement();
          const registry = new CustomElementRegistry();
          const shadowRoot = getScopedShadowRoot(registry);
          const $template = createTemplateElement(
            `<${tagName}><span>data</span></${tagName}>`
          );

          const $clone = shadowRoot.importNode($template.content, true);

          expect($clone).to.be.instanceof(DocumentFragment);
          expect($clone.childNodes.length).to.be.equal(1);
          expect($clone.firstElementChild.outerHTML).to.match(
            new RegExp(
              `<${tagName}-\\d{1,5}><span>data</span></${tagName}-\\d{1,5}>`
            )
          );
        });
      });
    });

    describe('innerHTML', async () => {
      it('should not scope the custom elements if is using the global registry', async () => {
        const shadowRoot = getScopedShadowRoot();

        shadowRoot.innerHTML = '<my-tag><span>data</span></my-tag>';

        expect(shadowRoot.innerHTML).to.equal(
          '<my-tag><span>data</span></my-tag>'
        );
      });

      it('should scope the custom elements if is using a scoped registry', async () => {
        const registry = new CustomElementRegistry();
        const shadowRoot = getScopedShadowRoot(registry);

        shadowRoot.innerHTML = '<my-tag><span>data</span></my-tag>';

        expect(shadowRoot.innerHTML).to.match(
          new RegExp(`<my-tag-\\d{1,5}><span>data</span></my-tag-\\d{1,5}>`)
        );
      });
    });

    describe('querySelector', () => {
      it('should be able to find a normal element with the global registry', async () => {
        const shadowRoot = getScopedShadowRoot();
        shadowRoot.innerHTML = `<div></div>`;

        const $el = shadowRoot.querySelector('div');

        expect($el).to.not.be.null;
        expect($el.tagName.toLowerCase()).to.be.equal('div');
      });

      it('should be able to find a custom element in a shadow root with the global registry', async () => {
        const shadowRoot = getScopedShadowRoot();
        const tagName = getTestTagName();
        shadowRoot.innerHTML = `<${tagName}></${tagName}>`;

        const $el = shadowRoot.querySelector(tagName);

        expect($el).to.not.be.null;
        expect($el.tagName.toLowerCase()).to.be.equal(tagName);
      });

      it('should be able to find a custom element in a shadow root and a custom registry', async () => {
        const registry = new CustomElementRegistry();
        const shadowRoot = getScopedShadowRoot(registry);
        const tagName = getTestTagName();
        shadowRoot.innerHTML = `<div id="myDiv"><${tagName} class="sample"></${tagName}></div>`;

        const $el = shadowRoot.querySelector(`#myDiv ${tagName}.sample`);

        expect($el).to.not.be.null;
        expect($el.tagName.toLowerCase()).to.be.equal(tagName);
      });
    });

    describe('querySelectorAll', () => {
      it('should be able to find a list of normal elements', async () => {
        const shadowRoot = getScopedShadowRoot();

        shadowRoot.innerHTML = `
        <div>
          <span></span>
          <span></span>
        </div>
      `;

        const items = shadowRoot.querySelectorAll('span');

        expect(items.length).to.be.equal(2);
        expect(items[0].tagName.toLowerCase()).to.be.equal('span');
        expect(items[1].tagName.toLowerCase()).to.be.equal('span');
      });

      it('should be able to find a list of scoped elements with the global registry', async () => {
        const shadowRoot = getScopedShadowRoot();
        const tagName = getTestTagName();

        shadowRoot.innerHTML = `
        <div>
          <${tagName}></${tagName}>
          <${tagName}></${tagName}>
        </div>
      `;

        const items = shadowRoot.querySelectorAll(tagName);

        expect(items.length).to.be.equal(2);
        expect(items[0].tagName.toLowerCase()).to.be.equal(tagName);
        expect(items[1].tagName.toLowerCase()).to.be.equal(tagName);
      });

      it('should be able to find a list of custom elements with a custom registry', async () => {
        const registry = new CustomElementRegistry();
        const shadowRoot = getScopedShadowRoot(registry);
        const tagName = getTestTagName();

        shadowRoot.innerHTML = `
        <div>
          <${tagName}></${tagName}>
          <${tagName}></${tagName}>
        </div>
      `;

        const items = shadowRoot.querySelectorAll(tagName);

        expect(items.length).to.be.equal(2);
        expect(items[0].tagName.toLowerCase()).to.be.equal(tagName);
        expect(items[1].tagName.toLowerCase()).to.be.equal(tagName);
      });
    });
  });
});

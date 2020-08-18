# Scoped Custom Element Registries Polyfill

This is a polyfill for allowing Scoped Custom Element Registries. It has been tested in Chrome, Safari and WebKit. This polyfill works scoping the custom element tag names.

## Reference Documentation

- [w3c / webcomponents](https://github.com/w3c/webcomponents/issues/716)
- [Justin Fagnani explanation](https://github.com/w3c/webcomponents/pull/865/files/d724c39b6f0eb34e9c74eb6b94e1ede92ab212aa)
- [Scoped Elements - Proposal to align the API with CustomElementsRegistry](https://github.com/open-wc/open-wc/issues/1373)

## TODO

- [X] `CustomElementRegistry`
  - [X] `CustomElementRegistry()`
    - [X] CustomElementRegistry is constructable.
  - [X] `CustomElementRegistry.prototype.get(name: string)`: `get()` now returns the closest constructor defined for a tag name in a chain of registries.
  - [X] `CustomElementRegistry.prototype.getRegistry(name: string)`: Returns the closest registry in which a tag name is defined.
  - [X] `define()` returns a new class. The constructor returned by `define()` is from a trivial subclass of the registered class.

- [X] `ShadowRoot`
  - [X] `customElements: CustomElementRegistry`: The `CustomElementRegistry` the `ShadowRoot` uses, set on `attachShadowRoot()`.
  - [X] `createElement()`: create new elements using the `CustomElementRegistry` of the `ShadowRoot`.
  - [X] `createElementNS()`: create new elements using the `CustomElementRegistry` of the `ShadowRoot`.
  - [X] `importNode()`: Imports a node into the document that owns the `ShadowRoot`, using the `CustomElementRegistry` of the `ShadowRoot`. This enables cloning a template into multiple scopes to use different custom element definitions.
  - [X] `innerHTML`
  - [X] `querySelector()`: Must transform the tag selector to search by the scoped ones.
  - [X] `querySelectorAll()`: Must transform the tag selector to search by the scoped ones.
  - [X] Styles
    - [X] Styles inside the `style` tag name
    - [X] Styles using `CSSStyleSheet`

- [X] `Element`
  - [X] `Element.prototype.scope: Document | ShadowRoot`: Elements have DOM creation APIs, like `innerHTML`, so they need a reference to their scope. Elements expose this with a scope property. One difference between this and `getRootNode()` is that the scope for an element can never change.
  - [X] `Element.prototype.attachShadow(init: ShadowRootInit)`: `ShadowRootInit` adds a new property, `customElements`, in its options argument which is a `CustomElementRegistry`.
  - [X] `innerHTML`
  - [X] `tagName`
  - [X] `querySelector()`: Must transform the tag selector to search by the scoped ones.
  - [X] `querySelectorAll()`: Must transform the tag selector to search by the scoped ones.
  - [X] `getElementsByTagName()`: Must transform the tag name to search by the scoped one.
  - [X] `getElementsByTagNameNS()`: Must transform the tag name to search by the scoped one.

- [X] Limit custom elements constructors by default to only looking up registrations from the global registry.

## Limitations

There are some limitations on the use of this polyfill.

- Importing a Node tree with an upgraded custom-element and styles into a shadowRoot: The custom element is going to maintain the upgraded instance, but styles are going to be scoped, so it could cause a visual problem in the case styles are using the custom element tag name.

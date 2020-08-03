# Scoped Custom Element Registry Polyfill

## Reference Documentation

- [w3c / webcomponents](https://github.com/w3c/webcomponents/issues/716)
- [Justin Fagnani](https://github.com/w3c/webcomponents/pull/865/files/d724c39b6f0eb34e9c74eb6b94e1ede92ab212aa)
- [Scoped Elements - Proposal to align the API with CustomElementsRegistry](https://github.com/open-wc/open-wc/issues/1373)

## TODO

- [ ] `CustomElementRegistry`
    - [ ] `CustomElementRegistry(parent?: CustomElementRegistry)`
        - [X] CustomElementRegistry is constructable.
        - [ ] Able to inherit from a parent registry: `const registry = new CustomElementRegistry({parent});`
        - [X] New definitions added to a registry are not visible to the parent.
        - [X] Mask any registrations with the same name defined in the parent so that definitions can be overridden.
        - [ ] Add sugar for bulk registrations: `const registry = new CustomElementRegistry({definitions});`
    - [X] `CustomElementRegistry.prototype.get(name: string)`: `get()` now returns the closest constructor defined for a tag name in a chain of registries.
    - [X] `CustomElementRegistry.prototype.getRegistry(name: string)`: Returns the closest registry in which a tag name is defined.
    - [ ] `define()` returns a new class. The constructor returned by `define()` is from a trivial subclass of the registered class.


- [ ] `ShadowRoot`
    - [X] `customElements: CustomElementRegistry`: The `CustomElementRegistry` the `ShadowRoot` uses, set on `attachShadowRoot()`.
    - [X] `createElement()`: create new elements using the `CustomElementRegistry` of the `ShadowRoot`.
    - [X] `createElementNS()`: create new elements using the `CustomElementRegistry` of the `ShadowRoot`.
    - [ ] `importNode()`: Imports a node into the document that owns the `ShadowRoot`, using the `CustomElementRegistry` of the `ShadowRoot`. This enables cloning a template into multiple scopes to use different custom element definitions.
    - [ ] `querySelector()`: Must transform the tag selector to search by the scoped ones.
    - [ ] `querySelectorAll()`: Must transform the tag selector to search by the scoped ones.
    - [ ] `styles`: Needs more investigation about how to proceed.


- [ ] `Element`
    - [X] `Element.prototype.scope: Document | ShadowRoot`: Elements have DOM creation APIs, like `innerHTML`, so they need a reference to their scope. Elements expose this with a scope property. One difference between this and `getRootNode()` is that the scope for an element can never change.
    - [X] `Element.prototype.attachShadow(init: ShadowRootInit)`: `ShadowRootInit` adds a new property, `customElements`, in its options argument which is a `CustomElementRegistry`.
    - [ ] `innerHTML`


- [ ] Limit custom elements constructors by default to only looking up registrations from the global registry.

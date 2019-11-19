interface Component {
    getName(): string;
    new(): HTMLElement
}

export function define(component: Component) {
    if ('customElements' in window) {
        customElements.define(
            component.getName(),
            component,
        );
    }
}
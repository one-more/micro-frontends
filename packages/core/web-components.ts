import {Component} from "./component";

export function define(component: typeof Component) {
    if ('customElements' in window) {
        customElements.define(
            component.getName(),
            component,
        );
    }
}
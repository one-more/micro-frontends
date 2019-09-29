import {
  BaseComponent
} from './base-component';

export class Component extends BaseComponent {
  static getName(): string {
    throw new Error("Custom component should overload static getName method")
  }

  /** @fixme is it never used? */
  static get observedAttributes(): string[] {
    return [];
  }

  isShadow: boolean = false;
  root: HTMLDivElement;

  createRoot() {
    this.init()
    if (this.isShadow) {
      this.attachShadow({
        mode: 'open'
      })
    } else {
      this.root = document.createElement('div');
      this.root.style.display = 'contents';
      this.appendChild(this.root);
    }
  }

  callRender(): void {
    this.beforeRender();
    this.render(this.isShadow ? this.shadowRoot : this.root);
    this.afterRender();
  }

  connectedCallback() {
    this.createRoot();
    this.callRender();

    this.connected()
  }

  disconnectedCallback() {
    this.disconnected()
  }

  /** @fixme is it never used? */
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (typeof oldValue != "undefined" && typeof newValue != "undefined") {
      if (oldValue !== newValue) {
        this.propChanged(name, oldValue, newValue)
      }
    }
  }

  update(): void {
    this.callRender()
  }
}

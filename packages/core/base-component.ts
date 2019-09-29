export class BaseComponent extends HTMLElement {
  protected init() {}
  beforeRender() {}
  afterRender() {}
  connected() {}
  disconnected() {}
  render(root: ShadowRoot | HTMLDivElement) {}
  /** @fixme is it never used? */
  propChanged(name: string, oldValue: string, newValue: string) {}
}
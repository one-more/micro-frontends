export abstract class AbstractComponent extends HTMLElement {
  beforeRender: () => void
  afterRender: () => void
  connected: () => void
  disconnected: () => void
  /** @fixme never used */
  propChanged: (name: string, oldValue: string, newValue: string) => void
  render: (root: ShadowRoot | HTMLDivElement) => void
}

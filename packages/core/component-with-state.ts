import { Component } from './component'

export type SelectorType = () => void
export type StoreDataType = { [key: string]: any }
export type ActionType = { [key: string]: () => StoreDataType }

export interface ComponentStateData {
  store: StoreDataType
  selector: SelectorType
  actions?: ActionType
}

export class ComponentWithState extends Component {
  store: StoreDataType
  selector: SelectorType
  actions?: ActionType

  constructor() {
    super()

    const { store, selector, actions } = ComponentWithState.getState()

    this.store = store
    this.selector = selector
    this.actions = actions
  }

  static getState(): ComponentStateData {
    throw new Error("ComponentWithState must overload static getState method")
  }

  public onStoreDataChange(currentData: StoreDataType, nextDate: StoreDataType): void {
    /** @todo shallow equals algorithm must be here, probably.. */
    if (currentData !== nextDate) {
      this.update()
    }
  }
}
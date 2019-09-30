import { props } from 'ramda'

import { Component } from './component'

/** @mark draft of types */
export type StoreDataType = { [key: string]: any }
export type SelectorType = Array<string>
export type ActionsType = { [key: string]: () => void }

export interface ComponentStateData {
  store: StoreDataType
  selector: SelectorType
  onStoreDataChangeCallback: (storeNext: StoreDataType) => void
  actions?: ActionsType
}

export class ComponentWithState extends Component {
  private selector: SelectorType
  state: StoreDataType
  actions?: ActionsType

  protected init() {
    const { store, selector, actions, onStoreDataChangeCallback } = this.stateData
    this.selector = selector
    this.state = props(selector, store)
    this.actions = actions

    onStoreDataChangeCallback(this.onStoreDataChange)
  }

  get stateData(): ComponentStateData {
    throw new Error("ComponentWithState must containt overloaded stateData getter!")
  }

  /**
   * @mark possible path for injection 
   * @param storeNext 
   */
  public onStoreDataChange(storeNext: StoreDataType): void {
    const stateNext = props(this.selector, storeNext)

    if (this.shouldComponentUpdate(this.state, stateNext)) {
      this.state = stateNext
      this.update()
    }
  }

  /**
   * Shallow equals by default
   * @param stateNext next state data injected from the store
   */
  public shouldComponentUpdate(currentState: StoreDataType, stateNext: StoreDataType): boolean {
    for (let stateItemKey in currentState) {
      const stateItem = currentState[stateItemKey]
      const stateItemNext = stateNext[stateItemKey]

      if (stateItem !== stateItemNext) {
        return true
      }
    }
  }
}

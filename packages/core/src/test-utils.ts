import {Store, Unsubscribe} from "./model";

export interface TestStore<S> extends Store<S> {
    setState(nextState: S): void
    _state: S
    callbacks: Function[]
}

export const createEmptyStore = <S>(state: S): TestStore<S> => {
    return {
        _state: state,
        callbacks: [],
        getState(): S {
            return this._state
        },
        subscribe(cb: Function): Unsubscribe {
            this.callbacks.push(cb)
            return () => {
                this.callbacks = this.callbacks.filter((el: Function) => el !== cb)
            }
        },
        dispatch() {},
        setState(nextState: S) {
            this._state = nextState
            this.callbacks.forEach((cb: Function) => cb())
        }
    }
}
export const identity = (state: unknown) => state;
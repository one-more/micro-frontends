export interface Action {
    type: string
}

export interface Unsubscribe {
    (): void
}

export interface Store<S> {
    getState(): S
    subscribe(cb: Function): Unsubscribe
    dispatch(action: Action): unknown
}

export interface Selector<S,D> {
    (state: S): D
}
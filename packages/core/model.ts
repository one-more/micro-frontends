export interface Action {
    type: string
}

export interface Unsubscribe {
    (): void
}

export interface Dispatch {
    (action: Action): unknown
}

export interface Store<S> {
    getState(): S
    subscribe(cb: Function): Unsubscribe
    dispatch: Dispatch
}

export interface Selector<S,D> {
    (state: S): D
}

export interface ActionCreators {
    [action: string]: (...args: unknown[]) => Action
}

export interface Actions {
    [action: string]: (...args: unknown[]) => ReturnType<Dispatch>
}
import {Selector, Store, Unsubscribe} from "./model";

export function subscribeWithSelector<S,K>(
    store: Store<S>,
    selector: Selector<S,K>,
    cb: (state: K) => void,
    stateEquals: StateEquals<K>,
): Unsubscribe {
    let prevState = selector(
        store.getState()
    );
    return store.subscribe(() => {
        const curState = selector(
            store.getState()
        );
        if (!stateEquals(prevState, curState)) {
            prevState = curState;
            cb(
                curState,
            )
        }
    })
}

export interface StateEquals<K> {
    (prevState: K, curState: K): boolean
}

export function shallowEquals<K>(obj1: K, obj2: K): boolean {
    if (obj1 === obj2) {
        return true
    }

    const obj1Keys = Object.keys(obj1);
    const obj2Keys = Object.keys(obj2);
    if (obj1Keys.length != obj2Keys.length) {
        return false
    }
    for (const key in obj1) {
        if (obj1[key] !== obj2[key]) {
            return false
        }
    }
    return true
}
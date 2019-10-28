import {Selector, Store, Unsubscribe} from "./model";

export function subscribeWithSelector<S,K>(
    store: Store<S>,
    selector: Selector<S,K>,
    cb: (state: K) => void
): Unsubscribe {
    let prevValue = selector(
        store.getState()
    );
    return store.subscribe(() => {
        const newValue = selector(
            store.getState()
        );
        if (newValue != prevValue) {
            prevValue = newValue;
            cb(
                newValue,
            )
        }
    })
}
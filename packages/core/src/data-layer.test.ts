import {Store, Unsubscribe} from "./model";
import {shallowEquals, subscribeWithSelector} from "./data-layer";
import {createEmptyStore, identity, TestStore} from "./test-utils";

describe("data-layer", () => {
    describe("subscribeWithSelector", () => {
        it("returns unsubscribe function", () => {
            const store: Store<unknown> = createEmptyStore({})
            const unsubscribe = jest.fn()
            store.subscribe = jest.fn(() => unsubscribe)

            expect(subscribeWithSelector(
                store,
                () => {},
                () => {},
                () => false
            )).toBe(unsubscribe)
        })
        it("calls selector to get derived state", () => {
            const state = {}, nextState = {a: 1}
            const store: TestStore<unknown> = createEmptyStore(state)
            const selector = jest.fn()

            subscribeWithSelector(
                store,
                selector,
                () => {},
                () => false,
            )
            expect(selector).toHaveBeenCalledWith(state)
            store.setState(nextState)
            expect(selector).toHaveBeenCalledWith(nextState)
            expect(selector).toHaveBeenCalledTimes(2)
        })
        it("calls stateEquals to compare states", () => {
            const state = {}, nextState = {a: 1}
            const store: TestStore<unknown> = createEmptyStore(state)
            const stateEquals = jest.fn()

            subscribeWithSelector(
                store,
                identity,
                () => {},
                stateEquals
            )
            store.setState(nextState)
            expect(stateEquals).toHaveBeenCalledWith(state, nextState)
        })
        it("calls callback when store data is changed", () => {
            const store: TestStore<unknown> = createEmptyStore({})
            const cb = jest.fn()

            subscribeWithSelector(
                store,
                identity,
                cb,
                () => false
            )
            const nextState = {a: 1}
            store.setState(nextState)
            expect(cb).toHaveBeenCalledWith(nextState)
        })
        it("does not call cb when stateEquals returned true", () => {
            const store: TestStore<unknown> = createEmptyStore({})
            const cb = jest.fn()

            subscribeWithSelector(
                store,
                identity,
                cb,
                () => true
            )
            const nextState = {a: 1}
            store.setState(nextState)
            expect(cb).toHaveBeenCalledTimes(0)
        })
    })
    describe("shallow equals", () => {
        it("returns true for the same object", () => {
            const obj1 = {a: 1}
            expect(shallowEquals(obj1, obj1)).toBe(true)
        })
        it("returns false when objects have different number of keys", () => {
            const obj1 = {a: 1}, obj2 = {a: 1, b: 2}
            expect(shallowEquals(obj1, obj2)).toBe(false)
        })
        it("returns false when key data differs", () => {
            const obj1: object = {a: 1, b: 1},
                obj2: object = {a: 1, b: 2},
                obj3: object = {a: 1, b: []},
                obj4: object = {a: 1, b: []},
                obj5: object = {a: 1, b: 1.0},
                obj6: object = {a: 1, b: 1.5},
                obj7: object = {a: 1, b: {}},
                obj8: object = {a: 1, b: {}},
                obj9: object = {a: 1, b: new Function},
                obj10: object = {a: 1, b: new Function}

            expect(shallowEquals(obj1, obj2)).toBe(false)
            expect(shallowEquals(obj3, obj4)).toBe(false)
            expect(shallowEquals(obj5, obj6)).toBe(false)
            expect(shallowEquals(obj7, obj8)).toBe(false)
            expect(shallowEquals(obj9, obj10)).toBe(false)
        })
        it("returns true when objects are shallow equal", () => {
            const obj1 = {a: 1, b: 2}, obj2 = {a: 1, b: 2}
            expect(shallowEquals(obj1, obj2)).toBe(true)
        })
    })
})
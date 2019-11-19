import {createEmptyStore, identity} from "./test-utils";
import {shallowEquals, subscribeWithSelector} from "./data-layer";
import {Component} from "./component";

jest.mock("./data-layer", () => ({
    shallowEquals: jest.fn(),
    subscribeWithSelector: jest.fn()
}))

describe("Component", () => {
    const resetDataLayer = (
        shallowEqualsMock: (...args: any) => any = () => {},
        subscribeWithSelectorMock: (...args: any) => any = () => {},
    ) => {
        (shallowEquals as jest.Mock).mockImplementation(jest.fn(shallowEqualsMock)).mockReset();
        (subscribeWithSelector as jest.Mock).mockImplementation(jest.fn(subscribeWithSelectorMock)).mockReset();
    };

    describe("lifecycle methods", () => {
        beforeEach(resetDataLayer)

        it("calls createRoot in connectedCallback", () => {
            class TestComponent extends Component {
                createRoot = jest.fn()
            }
            const component = new TestComponent()
            component.connectedCallback()
            expect(component.createRoot).toHaveBeenCalledTimes(1)
        })
        it("calls attachShadow when isShadow is true", () => {
            class ShadowComponent extends Component {
                isShadow = true
                attachShadow = jest.fn()
            }

            const component = new ShadowComponent()
            component.connectedCallback()
            expect(component.attachShadow).toHaveBeenCalledWith({mode: 'open'})
        })
        it("creates root field initialized with HTMLElement when isShadow is false", () => {
            class TestComponent extends Component {
                isShadow = false
                appendChild = jest.fn();
                getRoot = () => this.root
            }
            const component = new TestComponent()
            component.connectedCallback()
            const root = document.createElement("div")
            const createElementSpy = jest.spyOn(document, "createElement")
                .mockImplementation(() => root)
            root.style.display = 'contents';

            expect(component.getRoot()).toStrictEqual(root)
            expect(component.appendChild).toHaveBeenCalledWith(root)

            createElementSpy.mockRestore()
        })
        it("does not call selector and bindActionCreators when store is not provided", () => {
            class TestComponent extends Component {
                selector = jest.fn();
                bindActionCreators = jest.fn();
            }
            const component = new TestComponent()
            component.connectedCallback()

            expect(component.selector).toHaveBeenCalledTimes(0)
            expect(component.bindActionCreators).toHaveBeenCalledTimes(0)
        })
        it("calls selector when store is provided", () => {
            const state = { a: 1}
            const store = createEmptyStore(state)
            class TestComponent extends Component {
                getState() {
                    return this.state
                }
                store = store
                selector = jest.fn(identity)
            }
            const component = new TestComponent()
            component.connectedCallback()

            expect(component.getState()).toStrictEqual(state)
            expect(component.selector).toHaveBeenCalledWith(state)
            expect(subscribeWithSelector).toHaveBeenCalledTimes(1)
        })
        it("calls bindActionCreators when actionCreators are provided", () => {
            const actionCreators = {
                a: () => ({type: "a"})
            }
            const store = createEmptyStore(null)
            store.getState = jest.fn()
            class TestComponent extends Component {
                store = store
                actionCreators = actionCreators
                bindActionCreators = jest.fn()
            }
            const component = new TestComponent()
            component.connectedCallback()

            expect(subscribeWithSelector).toHaveBeenCalledTimes(0)
            expect(store.getState).toHaveBeenCalledTimes(0)
            expect(component.bindActionCreators).toHaveBeenCalledTimes(1)
        })
        it("calls callRender and connected in connectedCallback", () => {
            class TestComponent extends Component {
                callRender = jest.fn()
                connected = jest.fn()
            }
            const component = new TestComponent()
            component.connectedCallback()

            expect(component.callRender).toHaveBeenCalledTimes(1)
            expect(component.connected).toHaveBeenCalledTimes(1)
        })
        it("does not call unsubscribe if not set", () => {
            class TestComponent extends Component {
                disconnected = jest.fn()
            }
            const component = new TestComponent()
            component.disconnectedCallback()

            expect(component.disconnected).toHaveBeenCalledTimes(1)
        })
        it("does calls unsubscribe if is set", () => {
            const store = createEmptyStore(null)
            class TestComponent extends Component {
                disconnected = jest.fn()
                unsubscribe = jest.fn(store.subscribe(null))
            }
            const component = new TestComponent()
            component.disconnectedCallback()

            expect(component.disconnected).toHaveBeenCalledTimes(1)
            expect(component.unsubscribe).toHaveBeenCalledTimes(1)
        })
        it("does not call attributeChangedCallback when values are undefined or equal", () => {
            class TestComponent extends Component {
                propChanged = jest.fn()

                attributeChangedCallback(name: string, oldValue: string, newValue: string) {
                    super.attributeChangedCallback(name, oldValue, newValue)
                }
            }
            const component = new TestComponent()
            const value = "value1"
            const name = "name1"

            component.attributeChangedCallback(name, undefined, undefined)
            component.attributeChangedCallback(name, undefined, "undefined")
            component.attributeChangedCallback(name, "undefined", undefined)
            component.attributeChangedCallback(name, value, value)

            expect(component.propChanged).toHaveBeenCalledTimes(0)
        })
        it("does not call attributeChangedCallback when values are not undefined & are not equal", () => {
            class TestComponent extends Component {
                propChanged = jest.fn()

                attributeChangedCallback(name: string, oldValue: string, newValue: string) {
                    super.attributeChangedCallback(name, oldValue, newValue)
                }
            }
            const component = new TestComponent()

            const name = "name1", value1 = "value1", value2 = "value2"
            component.attributeChangedCallback(name, value1, value2)
            expect(component.propChanged).toHaveBeenCalledWith(name, value1, value2)
        })
    })
    describe("data layer", () => {
        it("creates actions in bindActionCreators", () => {
            const action = {type: "a"}
            const actionCreators = {
                a: jest.fn(() => action)
            }
            const store = createEmptyStore(null)
            store.dispatch = jest.fn()
            class TestComponent extends Component {
                actionCreators = actionCreators
                store = store
                bindActionCreators() {
                    super.bindActionCreators()
                }
                getActions() {
                    return this.actions
                }
            }
            const component = new TestComponent()

            component.bindActionCreators()
            const actionData = {b: 2}
            component.getActions().a(actionData)

            expect(store.dispatch).toHaveBeenCalledWith(action)
            expect(actionCreators.a).toHaveBeenCalledWith(actionData)
        })
        it("updates state and calls callRender in update method", () => {
            class TestComponent extends Component {
                callRender = jest.fn()

                callUpdate(state?: unknown) {
                    this.update(state)
                }
                getState() {
                    return this.state;
                }
            }
            const component = new TestComponent()

            component.callUpdate()
            expect(component.getState()).toBe(undefined)

            const newState = {a: 1}
            component.callUpdate(newState)
            expect(component.getState()).toBe(newState)

            expect(component.callRender).toHaveBeenCalledTimes(2)
        })
        it("pass correct params to the subscribeWithSelector", () => {
            resetDataLayer();

            const selector = identity
            const store = createEmptyStore(null)

            class TestComponent extends Component {
                selector = selector
                store = store
                getUpdate() {
                    return this.update
                }
                getStatesAreEqual() {
                    return this.statesAreEqual
                }
            }
            const component = new TestComponent()
            component.connectedCallback()

            expect(subscribeWithSelector).toHaveBeenCalledWith(
                component.store,
                component.selector,
                component.getUpdate(),
                component.getStatesAreEqual()
            )
        })
    })
    describe("render", () => {
        it("calls beforeRender and afterRender in callRender", () => {
            class TestComponent extends Component {
                beforeRender = jest.fn()
                afterRender = jest.fn()

                callRender() {
                    super.callRender()
                }
            }
            const component = new TestComponent()
            component.callRender()

            expect(component.beforeRender).toHaveBeenCalledTimes(1)
            expect(component.afterRender).toHaveBeenCalledTimes(1)
        })
        it("calls render with root or shadowRoot depends on the isShadow prop", () => {
            const shadowRoot = {}
            const root = {}

            class TestComponent extends Component {
                render = jest.fn()
                shadowRoot = shadowRoot as any
                root = root as any

                callRender() {
                    super.callRender()
                }
            }
            class ShadowComponent extends TestComponent {
                isShadow = true
            }
            const shadowComponent = new ShadowComponent()
            shadowComponent.callRender()

            expect(shadowComponent.render).toHaveBeenCalledWith(shadowRoot)

            class NonShadowComponent extends TestComponent {
                isShadow = false
            }
            const component = new NonShadowComponent()
            component.callRender()

            expect(component.render).toHaveBeenCalledWith(root)
        })
    })

    it("throws error in default getName", () => {
        expect(
            Component.getName
        ).toThrow()
    })
    it("returns empty array from observedAttributes be default", () => {
        expect(Component.observedAttributes).toStrictEqual([])
    })
})
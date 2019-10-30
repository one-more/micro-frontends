import {ActionCreators, Actions, Selector, Store, Unsubscribe} from "./model";
import {subscribeWithSelector} from "./data-layer";

export class Component<State> extends HTMLElement {
    public static getName(): string {
        throw new Error("Custom component should overload static getName method")
    }

    public static get observedAttributes(): string[] {
        return [];
    }

    protected isShadow: boolean = false;
    protected root: HTMLDivElement;

    protected store: Store<unknown> = null;
    protected selector: Selector<unknown, State> = null;
    protected unsubscribe: Unsubscribe = null;
    protected state: State = null;
    protected actionCreators: ActionCreators = null;
    protected actions: Actions = {};

    private createRoot() {
        if (this.isShadow) {
            this.attachShadow({mode: 'open'})
        } else {
            this.root = document.createElement('div');
            this.root.style.display = 'contents';
            this.appendChild(this.root);
        }
    }

    protected beforeRender() {}

    protected afterRender() {}

    protected connected() {}

    protected disconnected() {}

    protected propChanged(name: string, oldValue: string, newValue: string) {}

    protected render(root: ShadowRoot | HTMLDivElement) {}

    private callRender(): void {
        this.beforeRender();
        this.render(this.isShadow ? this.shadowRoot : this.root);
        this.afterRender();
    }

    connectedCallback() {
        this.createRoot();

        if(this.store) {
            if (this.selector) {
                this.state = this.selector(this.store.getState());

                this.unsubscribe = subscribeWithSelector(
                    this.store,
                    this.selector,
                    this.update
                );
            }

            if (this.actionCreators) {
                this.bindActionCreators()
            }
        }

        this.callRender();
        this.connected()
    }

    disconnectedCallback() {
        if (this.unsubscribe) {
            this.unsubscribe()
        }

        this.disconnected();
    }

    private bindActionCreators() {
        for (const key in this.actionCreators) {
            if (this.actionCreators.hasOwnProperty(key)) {
                const actionCreator = this.actionCreators[key];
                this.actions[key] = (...args) => this.store.dispatch(
                    actionCreator(...args)
                )
            }
        }
    }

    protected attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (typeof oldValue != "undefined" && typeof newValue != "undefined") {
            if (oldValue !== newValue) {
                this.propChanged(name, oldValue, newValue)
            }
        }
    }

    protected update = (state?: State): void => {
        this.state = state;
        this.callRender()
    }
}
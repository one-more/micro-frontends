import {Component} from "@micro-frontends/core";
import {addHistoryChangeListener, pushState} from "./history";
import {Subscription} from "./models";

export class XLink extends Component {
    static getName(): string {
        return 'x-link'
    }

    get href(): string {
        return this.getAttribute("href")
    }

    get text(): string {
        return this.getAttribute("text")
    }

    subscription: Subscription;

    render(root: HTMLDivElement) {
        const link = document.createElement("a");
        link.className = "x-link";
        link.href = this.href;
        link.textContent = this.text;
        link.addEventListener("click", this.onClick);
        root.appendChild(link);
    }

    onClick = (event: MouseEvent) => {
        event.preventDefault();

        pushState(
            null,
            "",
            this.href
        )
    };

    connected() {
        this.subscription = addHistoryChangeListener(
            () => this.update()
        )
    }
}
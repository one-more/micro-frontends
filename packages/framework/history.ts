import {Subscription} from "./models";

const listeners: Function[] = [];

window.onpopstate = function () {
    callListeners()
};

function callListeners(data?: any, title?: string, url?: string | null) {
    listeners.forEach(listener => {
        listener(data, title, url)
    })
}

export function pushState(data: any, title: string, url?: string | null): void {
    history.pushState(
        data,
        title,
        url,
    );
    callListeners(data, title, url)
}

export function addHistoryChangeListener(cb: Function): Subscription {
    listeners.push(cb);

    return {
        unsubscribe(): void {
            listeners.splice(
                listeners.indexOf(cb),
                1
            )
        }
    }
}
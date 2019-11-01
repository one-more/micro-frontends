interface SvelteComponent {
    new(options: {
        target: HTMLElement,
        props: Props
    }): SvelteComponent;
}

interface Props {
    [index: string]: unknown
}

export function renderSvelte(target: HTMLElement, Component: SvelteComponent, props: Props) {
    new Component({
        target,
        props
    })
}
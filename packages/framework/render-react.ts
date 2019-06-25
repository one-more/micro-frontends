import {ReactElement} from "react";
import {render} from "react-dom";

export function renderReact(
    element: ReactElement,
    container: Element,
) {
    render(
        element,
        container,
    )
}
import * as React from "react"
import {Component} from "~/core";
import styled from "styled-components"
import {SyntheticEvent} from "react";
import {addHistoryChangeListener, pushState} from "./history";
import {renderReact} from "~/framework/render-react";
import {Subscription} from "~/framework/models";

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
        renderReact(
            <Link
                href={this.href}
                className={
                    this.href == location.pathname ? "active" : ""
                }
            >
                {this.text}
            </Link>,
            root,
        )
    }

    connected() {
        this.subscription = addHistoryChangeListener(
            () => this.update()
        )
    }
}

class Link extends React.Component {
    props: {
        href: string,
        children: string,
        className: string,
    };

    onClick = (event: SyntheticEvent) =>  {
        event.preventDefault();

        pushState(
            null,
            "",
            this.props.href
        )
    };

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <StyledLink
                onClick={this.onClick}
                href={this.props.href}
                className={this.props.className}
            >
                {this.props.children}
            </StyledLink>
        )
    }
}

const StyledLink = styled.a`
    color: blue;
    &:visited {
        color: blue;
    }
    &.active, &.active:visited, &.active:hover {
        color: #414141;
        cursor: default;
        text-decoration: none;
    }
`;
# micro-frontends

Micro-frontends help you to use multiple frameworks on your application.
You can apply several frameworks on one page, per each component.

index.ts

```ts
import {define} from "@micro-frontends/core";
import {XLink} from "@micro-frontends/framework";
import {XContent} from "@micro-frontends/framework";

// define web-components 
define(XLink);
define(XContent);

```

index.html

```html
<main>
  <navigation>
    <ul class="margin-top-1em nav flex-column" >
      <li class="nav-item">
        <x-link
            class="nav-link"
            href="/clock"
            text="clock (react & svelte)" >
        </x-link>
      </li>
      <li class="nav-item">
        <x-link
            class="nav-link"
            href="/chat"
            text="chat (svelte + react + vue)" >
        </x-link>
      </li>
      <li class="nav-item">
        <x-link
            class="nav-link"
            href="/todo"
            text="todo (imba)" >
        </x-link>
      </li>
    </ul>
  </navigation>

  <section>
    <x-content id="main" default="main" ></x-content>
  </section>
</main>

```

`x-link` router link provide access for `src/pages/` where you can build SPA pages
`x-content` pages render content

```ts
// Web component defenition
import {Component} from "@micro-frontends/core";

// For React and Vue render
import {renderReact, renderVue} from "@micro-frontends/framework";
```

Example of the component

React

```ts
export class XClockReact extends Component {
    static getName(): string {
        return 'x-clock-react'
    }

    render(root: HTMLDivElement) {
        renderReact(
            <Clock />,
            root,
        )
    }
}

class Clock extends React.Component {
    state = {
        time: new Date(),
    };
    interval: number;

    componentDidMount(): void {
        this.interval = setInterval(() => {
            this.setState({
                time: new Date()
            })
        }, 1000)
    }

    componentWillMount(): void {
        clearInterval(this.interval)
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <div>{this.state.time.toLocaleString()}</div>
        )
    }
}
```

Vue

```ts
import {Component} from "@micro-frontends/core";
import ChatClient from "./chat-client.vue"
import {renderVue} from "@micro-frontends/framework";

export class XChatClientVue extends Component {
    static getName(): string {
        return 'x-chat-client-vue'
    }

    render(root: HTMLDivElement) {
        renderVue(
            ChatClient,
            root,
        )
    }
}
```

chat-client.vue

```html
<template>
    <form class="chat-form" v-on:submit="onSubmit" >
        <div class="form-group">
            <label for="name">name:</label>
            <input
                id="name"
                type="text"
                class="form-control"
                required
                v-model="name"
            >
        </div>
        <div class="form-group" >
            <label for="text">text</label>
            <textarea
                name="text"
                id="text"
                cols="30"
                rows="10"
                class="form-control"
                required
                v-model="text"
            ></textarea>
        </div>
        <button type="submit" class="btn btn-primary">Submit</button>
    </form>
</template>

<script>
    import {store} from "~/store";
    import {xChatActions} from "~/modules/x-chat";

    export default {
        data() {
            return {
                name: "",
                text: ""
            }
        },
        methods: {
            onSubmit(event) {
                event.preventDefault();

                store.dispatch(
                    xChatActions.sendMessage(
                        this.name + "(vue)",
                        this.text,
                        "right",
                    ),
                );

                this.text = "";
            }
        }
    }
</script>
```

Component with the standart render way

```ts
import {Component} from "@micro-frontends/core";
import Clock from "./clock.svelte";

export class XClockSvelte extends Component {
    static getName() {
        return 'x-clock-svelte'
    }

    render(root) {
        new Clock({
            target: root,
        })
    }
}
```

clock.svelte

```html
<script>
    import { onMount } from 'svelte';

    let time = new Date();

    // these automatically update when `time`
    // changes, because of the `$:` prefix
    $: hours = time.getHours();
    $: minutes = time.getMinutes();
    $: seconds = time.getSeconds();

    onMount(() => {
        const interval = setInterval(() => {
            time = new Date();
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    });
</script>

<style>
 /* styles here */
</style>

<svg viewBox='-50 -50 100 100'>
    <circle class='clock-face' r='48'/>

	<!-- markers -->
    {#each [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55] as minute}
        <line
                class='major'
                y1='35'
                y2='45'
                transform='rotate({30 * minute})'
        />

        {#each [1, 2, 3, 4] as offset}
            <line
                    class='minor'
                    y1='42'
                    y2='45'
                    transform='rotate({6 * (minute + offset)})'
            />
        {/each}
    {/each}

    <!-- hour hand -->
    <line
            class='hour'
            y1='2'
            y2='-20'
            transform='rotate({30 * hours + minutes / 2})'
    />

	<!-- minute hand -->
    <line
            class='minute'
            y1='4'
            y2='-30'
            transform='rotate({6 * minutes + seconds / 10})'
    />

	<!-- second hand -->
    <g transform='rotate({6 * seconds})'>
        <line class='second' y1='10' y2='-38'/>
        <line class='second-counterweight' y1='10' y2='2'/>
    </g>
</svg>
```

You need to define all components on the page

chat.ts

```ts
import {define} from "@micro-frontends/core";
import {XChatClientSvelte, XChatDisplay} from "~/modules/x-chat";
import {XChatClientVue} from "~/modules/x-chat/components/x-chat-client-vue";

define(XChatClientSvelte);
define(XChatDisplay);
define(XChatClientVue);
```

Then just use it by the way of [web-components](https://www.webcomponents.org/)

```html
<script src="/chat.bundle.js"></script>

<div id="main">
    <div class="chat">
        <x-chat-client-svelte></x-chat-client-svelte>
        <x-chat-display></x-chat-display>
        <x-chat-client-vue></x-chat-client-vue>
    </div>
</div>
```

In `chat.html` you can define a `<script src="/chat.bundle.js"></script>` section expected to includes on the page

See more examples on [micro-frontends-starter](https://github.com/one-more/micro-frontends-starter)

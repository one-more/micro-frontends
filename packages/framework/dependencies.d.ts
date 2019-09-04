declare module '@micro-frontends/core' {
    class Component {
        getAttribute(name: string): string;
        id: string;
        update(): void;
    }

    type StorageKey = string | Symbol;

    function retrieve<T>(key: StorageKey): T;

    function store<T>(key: StorageKey, value: T): void;
}

declare module 'vue' {
    interface VueConstructor {}
    export default class Vue {
        static config: {
            productionTip: boolean;
            devtools: boolean;
        };

        public constructor(
            config: {
                el: Element,
                render: (h: Function) => unknown
            }
        );
    }
}
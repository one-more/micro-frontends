import {VueConstructor} from "vue";
import Vue from 'vue';

Vue.config.productionTip = false;
Vue.config.devtools = false;

export function renderVue<K>(
    component: VueConstructor,
    container: Element,
    methods?: object,
    data?: K | Function,
) {
    return new Vue({
        el: container,
        render: (h) => h(component),
        methods,
        data: data || {},
    })
}
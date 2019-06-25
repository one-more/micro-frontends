import {VueConstructor} from "vue";
import Vue from 'vue'

Vue.config.productionTip = false;
Vue.config.devtools = false;

export function renderVue(
    component: VueConstructor,
    container: Element,
) {
    return new Vue({
        el:container,
        render: (h) => h(component)
    })
}
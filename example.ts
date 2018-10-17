import Vue, { VNode } from 'vue';
import VueA11y from './index';

new Vue({
  el: '#app',
  render(h): VNode {
    return h('h1', VueA11y.name);
  }
});

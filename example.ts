import Vue from 'vue';
import VueA11y from './index';

new Vue({
  el: '#app',
  render(h) {
    return h('h1', VueA11y.name);
  }
});

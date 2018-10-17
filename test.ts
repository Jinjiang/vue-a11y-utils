import Vue, { Component } from 'vue';
import { mount, Wrapper } from '@vue/test-utils';

import VueA11y from './';

describe('foo', () => {
  it('bar', () => {
    expect(VueA11y.name).toBe('vue-a11y-utils');
  });
});

describe('Counter', () => {
  // Now mount the component and you have the wrapper
  const Counter: Component = Vue.extend({
    template: `
      <div>
        <span class="count">0</span>
        <button @click="increment">Increment</button>
      </div>
    `,
    data() {
      return {
        count: 0
      };
    },
    methods: {
      increment(): void {
        this.count++;
      }
    }
  });
  const wrapper: Wrapper<Vue> = mount(Counter);

  it('renders the correct markup', () => {
    expect(wrapper.html()).toContain('<span class="count">0</span>');
  });

  // it's also easy to check for the existence of elements
  it('has a button', () => {
    expect(wrapper.contains('button')).toBe(true);
  });
});

import Vue, { Component } from 'vue';
import { mount, Wrapper, config } from '@vue/test-utils';

import { VueAria } from './';

config.logModifiedComponents = false;

describe('<VueAria> Component', () => {
  it('set role and aria props correctly', () => {
    const Foo = Vue.extend({
      template: `
        <VueAria
          role="button"
          :aria="{ label: 'save your changes' }"
        >
          <i class="icon-save" />
        </VueAria>
      `,
      components: {
        VueAria
      }
    });
    const wrapper: Wrapper<Vue> = mount(Foo);
    expect(wrapper.element.tagName).toBe('I');
    expect(wrapper.text()).toBe('');
    expect(wrapper.attributes()).toEqual({
      class: 'icon-save',
      role: 'button',
      'aria-label': 'save your changes'
    });
  });

  it('set array-type aria props correctly', () => {
    const Foo = Vue.extend({
      template: `
        <VueAria
          role="button"
          :aria="[{ label: 'save your changes' }, otherAriaProps]"
        >
          <i class="icon-save" />
        </VueAria>
      `,
      components: {
        VueAria
      },
      props: {
        otherAriaProps: Object
      }
    });
    const wrapper: Wrapper<Vue> = mount(Foo, {
      propsData: {
        otherAriaProps: {
          pressed: true
        }
      }
    });
    expect(wrapper.element.tagName).toBe('I');
    expect(wrapper.text()).toBe('');
    expect(wrapper.attributes()).toEqual({
      class: 'icon-save',
      role: 'button',
      'aria-label': 'save your changes',
      'aria-pressed': 'true'
    });
  });

  it('nested using', () => {
    const Foo = Vue.extend({
      template: `
        <VueAria
          role="button"
          :aria="otherAriaProps"
        >
          <VueAria
            :aria="{ label: 'save your changes' }"
          >
            <i class="icon-save" />
          </VueAria>
        </VueAria>
      `,
      components: {
        VueAria
      },
      props: {
        otherAriaProps: Object
      }
    });
    const wrapper: Wrapper<Vue> = mount(Foo, {
      propsData: {
        otherAriaProps: {
          pressed: true,
          label: 'changed label'
        }
      }
    });
    expect(wrapper.element.tagName).toBe('I');
    expect(wrapper.text()).toBe('');
    expect(wrapper.attributes()).toEqual({
      class: 'icon-save',
      role: 'button',
      'aria-label': 'changed label',
      'aria-pressed': 'true'
    });
  });
});

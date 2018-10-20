import Vue, { Component } from 'vue';
import { mount, Wrapper, config } from '@vue/test-utils';

import { VueAria, vAria } from './';

config.logModifiedComponents = false;

const NothingHappen = Vue.extend({
  render() {
    return this.$slots.default[0];
  }
});

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

  it('set tabindex correctly', () => {
    const Foo = Vue.extend({
      template: `
      <VueAria
        role="button"
        :tabindex="0"
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
      tabindex: '0'
    });
  });

  it('not set tabindex when when it is not a number', () => {
    const Foo = Vue.extend({
      template: `
      <VueAria role="button" :tabindex="NaN">
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
      role: 'button'
    });
  });

  it('reset tabindex in child when the role is none', () => {
    const Foo = Vue.extend({
      template: `
      <VueAria role="none">
        <VueAria role="button" :tabindex="0">
          <i class="icon-save" />
        </VueAria>
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
      role: 'none',
      tabindex: ''
    });
  });

  it('set tabindex correctly even when the role is none', () => {
    const Foo = Vue.extend({
      template: `
      <VueAria role="none" :tabindex="-1">
        <VueAria role="button" :tabindex="0">
          <i class="icon-save" />
        </VueAria>
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
      role: 'none',
      tabindex: '-1'
    });
  });
});

describe('v-aria directive', () => {
  it('set aria-* attributes correctly when init', () => {
    const Foo = Vue.extend({
      template: `
        <i
          class="icon-save"
          role="button"
          v-aria="{ label: 'save your changes' }"
        />
      `,
      directives: {
        aria: vAria
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

  it('update aria-* attributes correctly when update prop data', () => {
    const Foo = Vue.extend({
      template: `
        <i
          class="icon-save"
          role="button"
          v-aria="ariaConfig"
        />
      `,
      directives: {
        aria: vAria
      },
      props: {
        ariaConfig: Object
      }
    });
    const wrapper: Wrapper<Vue> = mount(Foo);
    expect(wrapper.element.tagName).toBe('I');
    expect(wrapper.text()).toBe('');
    expect(wrapper.attributes()).toEqual({
      class: 'icon-save',
      role: 'button'
    });

    wrapper.setProps({
      ariaConfig: { label: 'save your changes' }
    });
    expect(wrapper.element.tagName).toBe('I');
    expect(wrapper.text()).toBe('');
    expect(wrapper.attributes()).toEqual({
      class: 'icon-save',
      role: 'button',
      'aria-label': 'save your changes'
    });

    wrapper.setProps({
      ariaConfig: {
        label: 'Save Your Changes',
        pressed: true
      }
    });
    expect(wrapper.element.tagName).toBe('I');
    expect(wrapper.text()).toBe('');
    expect(wrapper.attributes()).toEqual({
      class: 'icon-save',
      role: 'button',
      'aria-label': 'Save Your Changes',
      'aria-pressed': 'true'
    });

    wrapper.setProps({
      ariaConfig: {
        pressed: false
      }
    });
    expect(wrapper.element.tagName).toBe('I');
    expect(wrapper.text()).toBe('');
    expect(wrapper.attributes()).toEqual({
      class: 'icon-save',
      role: 'button',
      'aria-pressed': 'false'
    });
  });

  it('runs on component', () => {
    const Foo = Vue.extend({
      template: `
        <NothingHappen
          v-aria="{
            label: 'save your changes',
            pressed: true
          }"
        >
          <NothingHappen
            v-aria="{
              label: 'Save Your Changes',
              controls: 'id-of-a-textbox'
            }"
          >
            <i class="icon-save" role="button" />
          </NothingHappen>
        </NothingHappen>
      `,
      components: {
        NothingHappen
      },
      directives: {
        aria: vAria
      }
    });
    const wrapper: Wrapper<Vue> = mount(Foo);
    expect(wrapper.element.tagName).toBe('I');
    expect(wrapper.text()).toBe('');
    expect(wrapper.attributes()).toEqual({
      class: 'icon-save',
      role: 'button',
      'aria-label': 'save your changes',
      'aria-pressed': 'true',
      'aria-controls': 'id-of-a-textbox'
    });
  });

  it('runs on component when update', () => {
    const Foo = Vue.extend({
      template: `
        <NothingHappen v-aria="outer">
          <NothingHappen v-aria="inner">
            <i class="icon-save" role="button" />
          </NothingHappen>
        </NothingHappen>
      `,
      components: {
        NothingHappen
      },
      directives: {
        aria: vAria
      },
      props: {
        outer: Object,
        inner: Object
      }
    });

    const wrapper: Wrapper<Vue> = mount(Foo, {
      propsData: {
        outer: {
          label: 'save your changes',
          pressed: true
        },
        inner: {
          label: 'Save Your Changes',
          controls: 'id-of-a-textbox'
        }
      }
    });
    expect(wrapper.element.tagName).toBe('I');
    expect(wrapper.text()).toBe('');
    expect(wrapper.attributes()).toEqual({
      class: 'icon-save',
      role: 'button',
      'aria-label': 'save your changes',
      'aria-pressed': 'true',
      'aria-controls': 'id-of-a-textbox'
    });

    wrapper.setProps({
      outer: {
        label: 'save your changes',
        pressed: false
      },
      inner: {
        label: 'Save Your Changes',
        controls: 'id-of-a-textbox'
      }
    });
    expect(wrapper.attributes()).toEqual({
      class: 'icon-save',
      role: 'button',
      'aria-label': 'save your changes',
      'aria-pressed': 'false',
      'aria-controls': 'id-of-a-textbox'
    });

    wrapper.setProps({
      outer: {
        pressed: false
      },
      inner: {
        label: 'Save Your Changes',
        controls: 'id-of-a-textbox'
      }
    });
    expect(wrapper.attributes()).toEqual({
      class: 'icon-save',
      role: 'button',
      'aria-label': 'Save Your Changes',
      'aria-pressed': 'false',
      'aria-controls': 'id-of-a-textbox'
    });

    wrapper.setProps({
      outer: {
        label: 'save your changes',
        pressed: false
      },
      inner: {
        controls: 'id-of-a-textbox'
      }
    });
    expect(wrapper.attributes()).toEqual({
      class: 'icon-save',
      role: 'button',
      'aria-label': 'save your changes',
      'aria-pressed': 'false',
      'aria-controls': 'id-of-a-textbox'
    });
  });

  it('runs after all parent <VueAria> components', () => {
    const Foo = Vue.extend({
      template: `
        <VueAria
          role="menubutton"
          :aria="{ pressed: true }"
        >
          <i
            class="icon-save"
            role="button"
            v-aria="{
              label: 'save your changes',
              pressed: false
            }"
          />
        </VueAria>
      `,
      components: { VueAria },
      directives: { aria: vAria }
    });
    const wrapper: Wrapper<Vue> = mount(Foo);
    expect(wrapper.element.tagName).toBe('I');
    expect(wrapper.text()).toBe('');
    expect(wrapper.attributes()).toEqual({
      class: 'icon-save',
      role: 'menubutton',
      'aria-label': 'save your changes',
      'aria-pressed': 'false'
    });

    const Bar = Vue.extend({
      template: `
        <VueAria
          role="menubutton"
          :aria="{ pressed: true }"
          v-aria="{
            label: 'save your changes',
            pressed: false
          }"
        >
          <i
            class="icon-save"
            role="button"
          />
        </VueAria>
      `,
      components: { VueAria },
      directives: { aria: vAria }
    });
    const wrapperBar: Wrapper<Vue> = mount(Bar);
    expect(wrapperBar.element.tagName).toBe('I');
    expect(wrapperBar.text()).toBe('');
    expect(wrapperBar.attributes()).toEqual({
      class: 'icon-save',
      role: 'menubutton',
      'aria-label': 'save your changes',
      'aria-pressed': 'false'
    });

    const Baz = Vue.extend({
      template: `
        <NothingHappen
          v-aria="{
            label: 'save your changes',
            pressed: false
          }"
        >
          <VueAria
            role="menubutton"
            :aria="{ pressed: true }"
          >
            <i
              class="icon-save"
              role="button"
            />
          </VueAria>
        </NothingHappen>
      `,
      components: { VueAria, NothingHappen },
      directives: { aria: vAria }
    });
    const wrapperBaz: Wrapper<Vue> = mount(Baz);
    expect(wrapperBaz.element.tagName).toBe('I');
    expect(wrapperBaz.text()).toBe('');
    expect(wrapperBaz.attributes()).toEqual({
      class: 'icon-save',
      role: 'menubutton',
      'aria-label': 'save your changes',
      'aria-pressed': 'false'
    });
  });
});

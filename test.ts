import Vue, { Component } from 'vue';
import { mount, Wrapper, config } from '@vue/test-utils';

import { VueAria, directiveAria, MixinKeyTravel, MixinId } from './';

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
        aria: directiveAria
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
        aria: directiveAria
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
        aria: directiveAria
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
        aria: directiveAria
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
      directives: { aria: directiveAria }
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
      directives: { aria: directiveAria }
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
      directives: { aria: directiveAria }
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

describe('KeyTravel mixin', () => {
  it('autofocus', () => {
    const Foo = Vue.extend({
      mixins: [MixinKeyTravel],
      template: `<div><button ref="btn">Hello</button></div>`,
      props: {
        autofocus: Boolean
      },
      methods: {
        getAutofocusItem() {
          return this.$refs.btn;
        }
      }
    });

    const wrapper: Wrapper<Vue> = mount(Foo, {
      attachToDocument: true
    });
    const document: Document | null = wrapper.element.ownerDocument;
    expect(document).toBeTruthy();
    if (document) {
      expect(document.activeElement).toBe(document.body);
    }

    const wrapperFocus: Wrapper<Vue> = mount(Foo, {
      propsData: { autofocus: true },
      attachToDocument: true
    });
    const documentFocus: Document | null = wrapperFocus.element.ownerDocument;
    const btnFocus: any = wrapperFocus.vm.$refs.btn;
    expect(documentFocus).toBeTruthy();
    expect(btnFocus).toBeTruthy();
    if (documentFocus) {
      expect(documentFocus.activeElement).toBe(btnFocus);
    }
  });

  it('travel through all focusable items', () => {
    const Foo = Vue.extend({
      mixins: [MixinKeyTravel],
      template: `
        <ul @keydown="keyTravel">
          <li
            tabindex="-1"
            v-for="option in options"
            :key="option.value"
            ref="items"
          >
            {{ option.text }}
          </li>
        </ul>
      `,
      data() {
        return {
          autofocus: true
        };
      },
      props: {
        options: Array
      },
      methods: {
        getKeyItems() {
          return this.$refs.items;
        }
      }
    });

    const wrapper: Wrapper<Vue> = mount(Foo, {
      attachToDocument: true,
      propsData: {
        options: [
          { text: 'First', value: 'foo' },
          { text: 'Second', value: 'bar' },
          { text: 'Third', value: 'baz' }
        ]
      }
    });
    const document: Document | null = wrapper.element.ownerDocument;
    const items: any = wrapper.vm.$refs.items;
    expect(document).toBeTruthy();
    expect(Array.isArray(items)).toBeTruthy();
    if (!document || !Array.isArray(items)) {
      return;
    }
    expect(document.activeElement).toBe(items[0]);

    wrapper.trigger('keydown', { key: 'ArrowDown' });
    expect(document.activeElement).toBe(items[1]);

    wrapper.trigger('keydown', { key: 'ArrowDown' });
    expect(document.activeElement).toBe(items[2]);

    wrapper.trigger('keydown', { key: 'ArrowDown' });
    expect(document.activeElement).toBe(items[0]);

    wrapper.trigger('keydown', { key: 'End' });
    expect(document.activeElement).toBe(items[2]);
  });

  it('fire action when enter key down', () => {
    let lastAction: string = '';

    const ListItem = Vue.extend({
      template: `<div role="listitem" tabindex="-1">{{ text }}</div>`,
      props: {
        text: String,
        value: String
      },
      methods: {
        fireAction() {
          lastAction = this.value;
        }
      }
    });

    const Foo = Vue.extend({
      mixins: [MixinKeyTravel],
      template: `
        <div role="list" @keydown="keyTravel">
          <ListItem
            ref="items"
            v-for="option in options"
            :key="option.value"
            :text="option.text"
            :value="option.value"
          />
        </div>
      `,
      components: { ListItem },
      data() {
        return {
          autofocus: true
        };
      },
      props: {
        options: Array
      },
      methods: {
        getKeyItems() {
          return this.$refs.items;
        }
      }
    });

    const wrapper: Wrapper<Vue> = mount(Foo, {
      attachToDocument: true,
      propsData: {
        options: [
          { text: 'First', value: 'foo' },
          { text: 'Second', value: 'bar' },
          { text: 'Third', value: 'baz' }
        ]
      }
    });
    const document: Document | null = wrapper.element.ownerDocument;
    const items: any = wrapper.vm.$refs.items;
    expect(document).toBeTruthy();
    expect(Array.isArray(items)).toBeTruthy();
    if (!document || !Array.isArray(items)) {
      return;
    }
    expect(document.activeElement).toBe(items[0].$el);
    expect(lastAction).toBe('');

    wrapper.trigger('keydown', { key: 'ArrowDown' });
    expect(document.activeElement).toBe(items[1].$el);
    expect(lastAction).toBe('');

    wrapper.trigger('keydown', { key: 'Enter' });
    expect(document.activeElement).toBe(items[1].$el);
    expect(lastAction).toBe('bar');

    wrapper.trigger('keydown', { key: 'ArrowDown' });
    expect(document.activeElement).toBe(items[2].$el);
    expect(lastAction).toBe('bar');

    wrapper.trigger('keydown', { key: 'Enter' });
    expect(document.activeElement).toBe(items[2].$el);
    expect(lastAction).toBe('baz');

    wrapper.trigger('keydown', { key: 'ArrowDown' });
    expect(document.activeElement).toBe(items[0].$el);
    expect(lastAction).toBe('baz');

    wrapper.trigger('keydown', { key: 'End' });
    expect(document.activeElement).toBe(items[2].$el);
    expect(lastAction).toBe('baz');
  });
});

describe('Id mixin', () => {
  const Foo = Vue.extend({
    mixins: [MixinId],
    template: `
      <div>
        <label ref="label" :id="\`\${localId}-label\`">Username</label>
        <input
          ref="input"
          :id="\`\${localId}-input\`"
          :aria-labelledby="\`\${localId}-label\`"
        />
      </div>
    `
  });

  it('will generate unique new ids for each component instance', () => {
    const wrapper: Wrapper<Vue> = mount(Foo);
    const label = wrapper.vm.$refs.label;
    const input = wrapper.vm.$refs.input;
    expect(label).toBeTruthy();
    expect(Array.isArray(label)).toBeFalsy();
    expect(input).toBeTruthy();
    expect(Array.isArray(input)).toBeFalsy();
    if (label && input && !Array.isArray(label) && !Array.isArray(input)) {
      const labelId = label.getAttribute('id');
      const inputId = input.getAttribute('id');
      const labelledby = input.getAttribute('aria-labelledby');
      expect(labelledby).toBe(labelId);
      expect(labelId.substr(0, labelId.length - 5)).
        toBe(inputId.substr(0, inputId.length - 5));
    }
  });

  it('will use an id prop to assign sub ids', () => {
    const wrapper: Wrapper<Vue> = mount(Foo, {
      propsData: { id: 'v-helloworld' }
    });
    const label = wrapper.vm.$refs.label;
    const input = wrapper.vm.$refs.input;
    expect(label).toBeTruthy();
    expect(Array.isArray(label)).toBeFalsy();
    expect(input).toBeTruthy();
    expect(Array.isArray(input)).toBeFalsy();
    if (label && input && !Array.isArray(label) && !Array.isArray(input)) {
      const labelId = label.getAttribute('id');
      const inputId = input.getAttribute('id');
      const labelledby = input.getAttribute('aria-labelledby');
      expect(labelId).toBe('v-helloworld-label');
      expect(inputId).toBe('v-helloworld-input');
      expect(labelledby).toBe('v-helloworld-label');
    }
  });
});

import { describe, it } from "vitest";
import Vue from "vue";
import { mount, Wrapper, config, WrapperArray } from "@vue/test-utils";

import {
  VueAria,
  directiveAria,
  MixinTravel,
  MixinId,
  VueFocusTrap,
  MixinShortcuts,
  VueLive
} from "../src/index";

import { TravelConfig } from "../src/travel";

config.logModifiedComponents = false;

const NothingHappen = Vue.extend({
  render() {
    return this.$slots.default![0];
  }
});

describe("<VueAria> component", () => {
  it("set role and aria props correctly", () => {
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
    expect(wrapper.element.tagName).toBe("I");
    expect(wrapper.text()).toBe("");
    expect(wrapper.attributes()).toEqual({
      class: "icon-save",
      role: "button",
      "aria-label": "save your changes"
    });
  });

  it("set array-type aria props correctly", () => {
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
    expect(wrapper.element.tagName).toBe("I");
    expect(wrapper.text()).toBe("");
    expect(wrapper.attributes()).toEqual({
      class: "icon-save",
      role: "button",
      "aria-label": "save your changes",
      "aria-pressed": "true"
    });
  });

  it("nested using", () => {
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
          label: "changed label"
        }
      }
    });
    expect(wrapper.element.tagName).toBe("I");
    expect(wrapper.text()).toBe("");
    expect(wrapper.attributes()).toEqual({
      class: "icon-save",
      role: "button",
      "aria-label": "changed label",
      "aria-pressed": "true"
    });
  });

  it("set tabindex correctly", () => {
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
    expect(wrapper.element.tagName).toBe("I");
    expect(wrapper.text()).toBe("");
    expect(wrapper.attributes()).toEqual({
      class: "icon-save",
      role: "button",
      tabindex: "0"
    });
  });

  it("not set tabindex when when it is not a number", () => {
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
    expect(wrapper.element.tagName).toBe("I");
    expect(wrapper.text()).toBe("");
    expect(wrapper.attributes()).toEqual({
      class: "icon-save",
      role: "button"
    });
  });

  it("reset tabindex in child when the role is none", () => {
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
    expect(wrapper.element.tagName).toBe("I");
    expect(wrapper.text()).toBe("");
    expect(wrapper.attributes()).toEqual({
      class: "icon-save",
      role: "none",
      tabindex: ""
    });
  });

  it("set tabindex correctly even when the role is none", () => {
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
    expect(wrapper.element.tagName).toBe("I");
    expect(wrapper.text()).toBe("");
    expect(wrapper.attributes()).toEqual({
      class: "icon-save",
      role: "none",
      tabindex: "-1"
    });
  });
});

describe("v-aria directive", () => {
  it("set aria-* attributes correctly when init", () => {
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
    expect(wrapper.element.tagName).toBe("I");
    expect(wrapper.text()).toBe("");
    expect(wrapper.attributes()).toEqual({
      class: "icon-save",
      role: "button",
      "aria-label": "save your changes"
    });
  });

  it("update aria-* attributes correctly when update prop data", () => {
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
    expect(wrapper.element.tagName).toBe("I");
    expect(wrapper.text()).toBe("");
    expect(wrapper.attributes()).toEqual({
      class: "icon-save",
      role: "button"
    });

    wrapper.setProps({
      ariaConfig: { label: "save your changes" }
    });
    expect(wrapper.element.tagName).toBe("I");
    expect(wrapper.text()).toBe("");
    expect(wrapper.attributes()).toEqual({
      class: "icon-save",
      role: "button",
      "aria-label": "save your changes"
    });

    wrapper.setProps({
      ariaConfig: {
        label: "Save Your Changes",
        pressed: true
      }
    });
    expect(wrapper.element.tagName).toBe("I");
    expect(wrapper.text()).toBe("");
    expect(wrapper.attributes()).toEqual({
      class: "icon-save",
      role: "button",
      "aria-label": "Save Your Changes",
      "aria-pressed": "true"
    });

    wrapper.setProps({
      ariaConfig: {
        pressed: false
      }
    });
    expect(wrapper.element.tagName).toBe("I");
    expect(wrapper.text()).toBe("");
    expect(wrapper.attributes()).toEqual({
      class: "icon-save",
      role: "button",
      "aria-pressed": "false"
    });
  });

  it("runs on component", () => {
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
    expect(wrapper.element.tagName).toBe("I");
    expect(wrapper.text()).toBe("");
    expect(wrapper.attributes()).toEqual({
      class: "icon-save",
      role: "button",
      "aria-label": "save your changes",
      "aria-pressed": "true",
      "aria-controls": "id-of-a-textbox"
    });
  });

  it("runs on component when update", () => {
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
          label: "save your changes",
          pressed: true
        },
        inner: {
          label: "Save Your Changes",
          controls: "id-of-a-textbox"
        }
      }
    });
    expect(wrapper.element.tagName).toBe("I");
    expect(wrapper.text()).toBe("");
    expect(wrapper.attributes()).toEqual({
      class: "icon-save",
      role: "button",
      "aria-label": "save your changes",
      "aria-pressed": "true",
      "aria-controls": "id-of-a-textbox"
    });

    wrapper.setProps({
      outer: {
        label: "save your changes",
        pressed: false
      },
      inner: {
        label: "Save Your Changes",
        controls: "id-of-a-textbox"
      }
    });
    expect(wrapper.attributes()).toEqual({
      class: "icon-save",
      role: "button",
      "aria-label": "save your changes",
      "aria-pressed": "false",
      "aria-controls": "id-of-a-textbox"
    });

    wrapper.setProps({
      outer: {
        pressed: false
      },
      inner: {
        label: "Save Your Changes",
        controls: "id-of-a-textbox"
      }
    });
    expect(wrapper.attributes()).toEqual({
      class: "icon-save",
      role: "button",
      "aria-label": "Save Your Changes",
      "aria-pressed": "false",
      "aria-controls": "id-of-a-textbox"
    });

    wrapper.setProps({
      outer: {
        label: "save your changes",
        pressed: false
      },
      inner: {
        controls: "id-of-a-textbox"
      }
    });
    expect(wrapper.attributes()).toEqual({
      class: "icon-save",
      role: "button",
      "aria-label": "save your changes",
      "aria-pressed": "false",
      "aria-controls": "id-of-a-textbox"
    });
  });

  it("runs after all parent <VueAria> components", () => {
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
    expect(wrapper.element.tagName).toBe("I");
    expect(wrapper.text()).toBe("");
    expect(wrapper.attributes()).toEqual({
      class: "icon-save",
      role: "menubutton",
      "aria-label": "save your changes",
      "aria-pressed": "false"
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
    expect(wrapperBar.element.tagName).toBe("I");
    expect(wrapperBar.text()).toBe("");
    expect(wrapperBar.attributes()).toEqual({
      class: "icon-save",
      role: "menubutton",
      "aria-label": "save your changes",
      "aria-pressed": "false"
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
    expect(wrapperBaz.element.tagName).toBe("I");
    expect(wrapperBaz.text()).toBe("");
    expect(wrapperBaz.attributes()).toEqual({
      class: "icon-save",
      role: "menubutton",
      "aria-label": "save your changes",
      "aria-pressed": "false"
    });
  });
});

describe("Travel mixin", () => {
  it("travel through all focusable items", () => {
    interface FooVm extends Vue {
      currentIndex: number;
    }
    const travelOption: TravelConfig = {
      looped: true,
      getItems(vm: FooVm) {
        return <Array<HTMLElement>>vm.$refs.items;
      },
      getIndex(vm: FooVm) {
        return vm.currentIndex;
      },
      setIndex(vm: FooVm, index: number) {
        vm.currentIndex = index;
        travelOption.getItems(vm)[index].focus();
      },
      move(vm: FooVm, event: KeyboardEvent, newIndex: number) {
        this.setIndex(vm, newIndex);
      }
    };

    const Foo = Vue.extend({
      template: `
        <ul @keydown="bindTravel">
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
      mixins: [MixinTravel],
      $travel: travelOption,
      mounted() {
        (<Array<HTMLElement>>this.$refs.items)[0].focus();
      },
      data() {
        return {
          currentIndex: 0
        };
      },
      props: {
        options: Array
      }
    });

    const wrapper: Wrapper<Vue> = mount(Foo, {
      attachToDocument: true,
      propsData: {
        options: [
          { text: "First", value: "foo" },
          { text: "Second", value: "bar" },
          { text: "Third", value: "baz" }
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

    wrapper.trigger("keydown", { key: "ArrowDown" });
    expect(document.activeElement).toBe(items[1]);

    wrapper.trigger("keydown", { key: "ArrowDown" });
    expect(document.activeElement).toBe(items[2]);

    wrapper.trigger("keydown", { key: "ArrowDown" });
    expect(document.activeElement).toBe(items[0]);

    wrapper.trigger("keydown", { key: "End" });
    expect(document.activeElement).toBe(items[2]);
  });

  it("fire action when enter key down", () => {
    interface FooVm extends Vue {
      currentIndex: number;
    }
    const travelOption: TravelConfig = {
      looped: true,
      getItems(vm: FooVm) {
        return <Array<Vue>>vm.$refs.items;
      },
      getIndex(vm: FooVm) {
        return vm.currentIndex;
      },
      setIndex(vm: FooVm, index: number) {
        vm.currentIndex = index;
        const items = travelOption.getItems(vm);
        const item = items[index];
        item.$el.focus();
      },
      move(vm: FooVm, event: KeyboardEvent, newIndex: number) {
        this.setIndex(vm, newIndex);
      },
      action(vm: FooVm, event: KeyboardEvent, index: number, items: any[]) {
        items[index].fireAction();
      }
    };

    let lastAction: string = "";

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
      mixins: [MixinTravel],
      template: `
        <div role="list" @keydown="bindTravel">
          <ListItem
            ref="items"
            v-for="option in options"
            :key="option.value"
            :text="option.text"
            :value="option.value"
          />
        </div>
      `,
      $travel: travelOption,
      components: { ListItem },
      mounted() {
        ((<Array<Vue>>this.$refs.items)[0].$el as HTMLElement).focus();
      },
      props: {
        options: Array
      },
      data() {
        return {
          currentIndex: 0
        };
      }
    });

    const wrapper: Wrapper<Vue> = mount(Foo, {
      attachToDocument: true,
      propsData: {
        options: [
          { text: "First", value: "foo" },
          { text: "Second", value: "bar" },
          { text: "Third", value: "baz" }
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
    expect(lastAction).toBe("");

    wrapper.trigger("keydown", { key: "ArrowDown" });
    expect(document.activeElement).toBe(items[1].$el);
    expect(lastAction).toBe("");

    wrapper.trigger("keydown", { key: "Enter" });
    expect(document.activeElement).toBe(items[1].$el);
    expect(lastAction).toBe("bar");

    wrapper.trigger("keydown", { key: "ArrowDown" });
    expect(document.activeElement).toBe(items[2].$el);
    expect(lastAction).toBe("bar");

    wrapper.trigger("keydown", { key: "Enter" });
    expect(document.activeElement).toBe(items[2].$el);
    expect(lastAction).toBe("baz");

    wrapper.trigger("keydown", { key: "ArrowDown" });
    expect(document.activeElement).toBe(items[0].$el);
    expect(lastAction).toBe("baz");

    wrapper.trigger("keydown", { key: "End" });
    expect(document.activeElement).toBe(items[2].$el);
    expect(lastAction).toBe("baz");
  });
});

describe("Id mixin", () => {
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

  it("will generate unique new ids for each component instance", () => {
    const wrapper: Wrapper<Vue> = mount(Foo);
    const label = <HTMLElement>wrapper.vm.$refs.label;
    const input = <HTMLElement>wrapper.vm.$refs.input;
    expect(label).toBeTruthy();
    expect(Array.isArray(label)).toBeFalsy();
    expect(input).toBeTruthy();
    expect(Array.isArray(input)).toBeFalsy();
    if (label && input && !Array.isArray(label) && !Array.isArray(input)) {
      const labelId = label.getAttribute("id") || "";
      const inputId = input.getAttribute("id") || "";
      const labelledby = input.getAttribute("aria-labelledby");
      expect(labelledby).toBe(labelId);
      expect(labelId.substr(0, labelId.length - 5)).toBe(
        inputId.substr(0, inputId.length - 5)
      );
    }
  });

  it("will use an id prop to assign sub ids", () => {
    const wrapper: Wrapper<Vue> = mount(Foo, {
      propsData: { id: "v-helloworld" }
    });
    const label = <HTMLElement>wrapper.vm.$refs.label;
    const input = <HTMLElement>wrapper.vm.$refs.input;
    expect(label).toBeTruthy();
    expect(Array.isArray(label)).toBeFalsy();
    expect(input).toBeTruthy();
    expect(Array.isArray(input)).toBeFalsy();
    if (label && input && !Array.isArray(label) && !Array.isArray(input)) {
      const labelId = label.getAttribute("id");
      const inputId = input.getAttribute("id");
      const labelledby = input.getAttribute("aria-labelledby");
      expect(labelId).toBe("v-helloworld-label");
      expect(inputId).toBe("v-helloworld-input");
      expect(labelledby).toBe("v-helloworld-label");
    }
  });

  it("will update localId after id prop changed", () => {
    const wrapper: Wrapper<Vue> = mount(Foo);
    const label = <HTMLElement>wrapper.vm.$refs.label;
    const input = <HTMLElement>wrapper.vm.$refs.input;
    expect(label).toBeTruthy();
    expect(Array.isArray(label)).toBeFalsy();
    expect(input).toBeTruthy();
    expect(Array.isArray(input)).toBeFalsy();
    if (label && input && !Array.isArray(label) && !Array.isArray(input)) {
      wrapper.setProps({ id: "v-helloworld" });
      expect(label.getAttribute("id")).toBe("v-helloworld-label");
      wrapper.setProps({ id: null });
      expect(label.getAttribute("id")).not.toBe("v-helloworld-label");
      expect(label.getAttribute("id")).toBe(
        input.getAttribute("aria-labelledby")
      );
    }
  });
});

describe("<VueFocusTrap> component", () => {
  interface DialogVm extends Vue {
    open(): void;
    close(autofocus: boolean): void;
  }
  interface FooVm extends Vue {
    shown: boolean;
  }

  it("will trap focus to a modal dialog", done => {
    const Foo = Vue.extend({
      template: `
        <div id="focus-trap-example">
          <button class="trigger" ref="trigger" @click="shown = true">
            Open a Modal Dialog
          </button>
          <div v-if="shown" class="dialog">
            <VueFocusTrap
              ref="dialog"
              @open="open"
              @gofirst="goFirst"
              @golast="goLast"
            >
              <label>
                Email:
                <input ref="email" type="email" />
              </label>
              <label>
                Password
                <input ref="password" type="password" />
              </label>
              <button ref="login" @click="shown = false">Login</button>
              <button ref="cancel">Cancel</button>
            </VueFocusTrap>
          </div>
        </div>
      `,
      components: {
        VueFocusTrap
      },
      mounted() {
        (<HTMLElement>this.$refs.trigger).focus();
      },
      data() {
        return {
          shown: false
        };
      },
      watch: {
        shown(value) {
          if (value) {
            setTimeout(() => {
              const dialog = this.$refs.dialog;
              (<DialogVm>dialog).open();
            }, 100);
          } else {
            const dialog = this.$refs.dialog;
            (<DialogVm>dialog).close(true);
          }
        }
      },
      methods: {
        open() {
          setTimeout(() => {
            this.goFirst();
          });
        },
        goFirst() {
          const item = this.$refs.email;
          if (item) {
            (<HTMLElement>item).focus();
          }
        },
        goLast() {
          const item = this.$refs.cancel;
          if (item) {
            (<HTMLElement>item).focus();
          }
        }
      }
    });

    // NOTICE:
    // vue-test-utils doesn't support TAB focus
    // but still preserve this case.

    // init
    const wrapper: Wrapper<Vue> = mount(Foo, { attachToDocument: true });
    const document = <HTMLDocument>wrapper.element.ownerDocument;
    expect(document).toBeTruthy();

    const trigger = <HTMLElement>wrapper.element.querySelector(".trigger");
    expect(trigger).toBeTruthy();

    // init state
    expect((<FooVm>wrapper.vm).shown).toBeFalsy();
    const dialog = <HTMLElement>wrapper.element.querySelector(".dialog");
    expect(dialog).toBe(null);

    // click trigger
    trigger.click();
    setTimeout(() => {
      const dialog = <HTMLElement>wrapper.element.querySelector(".dialog");
      const first = <HTMLElement>(
        wrapper.element.querySelector('.dialog input[type="email"]')
      );
      const password = <HTMLElement>(
        wrapper.element.querySelector('.dialog input[type="password"]')
      );
      const login = <HTMLElement>(
        wrapper.element.querySelectorAll(".dialog button")[0]
      );
      const last = <HTMLElement>(
        wrapper.element.querySelectorAll(".dialog button")[1]
      );
      expect(dialog).toBeTruthy();
      expect(first).toBeTruthy();
      expect(last).toBeTruthy();
      expect((<FooVm>wrapper.vm).shown).toBeTruthy();
      expect(dialog.style.display).toBe("");
      expect(document.activeElement).toBe(first);
      login.click();
      setTimeout(() => {
        const dialog = <HTMLElement>wrapper.element.querySelector(".dialog");
        expect((<FooVm>wrapper.vm).shown).toBeFalsy();
        expect(dialog).toBe(null);
        done();
      }, 200);
    }, 200);
  });
});

describe("Shortcuts mixin", () => {
  it("will trigger a single-key shortcut", () => {
    const messages: Array<string> = [];
    const Foo = Vue.extend({
      template: `
        <div>
          Please press:
          <kbd>CMD</kbd> + <kbd>G</kbd> or
          <kbd>Window</kbd> + <kbd>G</kbd>
        </div>
      `,
      mixins: [MixinShortcuts],
      $shortcuts: [
        {
          key: "g",
          modifiers: { meta: true },
          handle(event: KeyboardEvent) {
            messages.push("trigger: CMD + G");
          }
        }
      ]
    });
    const wrapper: Wrapper<Vue> = mount(Foo, {
      attachToDocument: true
    });
    // { key, code, ctrlKey, shiftKey, altKey, metaKey }
    expect(messages.length).toBe(0);
    wrapper.trigger("keydown", {
      key: "g",
      code: "KeyG"
    });
    expect(messages.length).toBe(0);
    wrapper.trigger("keydown", {
      key: "F",
      code: "KeyF",
      metaKey: true,
      ctrlKey: false,
      shiftKey: false,
      altKey: false
    });
    expect(messages.length).toBe(0);
    wrapper.trigger("keydown", {
      key: "G",
      code: "KeyG",
      metaKey: true,
      ctrlKey: true,
      shiftKey: false,
      altKey: false
    });
    expect(messages.length).toBe(0);
    wrapper.trigger("keydown", {
      key: "g",
      code: "KeyG",
      metaKey: true,
      ctrlKey: false,
      shiftKey: false,
      altKey: false
    });
    expect(messages.length).toBe(1);
    expect(messages[0]).toBe("trigger: CMD + G");
    wrapper.trigger("keydown", {
      key: "G",
      code: "KeyG",
      metaKey: true,
      ctrlKey: false,
      shiftKey: false,
      altKey: false
    });
    expect(messages.length).toBe(2);
    expect(messages[1]).toBe("trigger: CMD + G");
    wrapper.destroy();
  });

  it("will trigger a key seq shortcut", () => {
    const messages: Array<string> = [];
    const Foo = Vue.extend({
      template: `
        <div>
          Please press:
          <kbd>CMD</kbd> + <kbd>G</kbd> or
          <kbd>Window</kbd> + <kbd>G</kbd>
        </div>
      `,
      mixins: [MixinShortcuts],
      $shortcuts: [
        {
          keys: [{ key: "a" }, { key: "s" }, { key: "d" }, { key: "f" }],
          handle(event: KeyboardEvent) {
            messages.push("trigger: seems you are so boring");
          }
        }
      ]
    });
    const wrapper: Wrapper<Vue> = mount(Foo, {
      attachToDocument: true
    });
    // { key, code, ctrlKey, shiftKey, altKey, metaKey }
    expect(messages.length).toBe(0);
    wrapper.trigger("keydown", {
      key: "a",
      code: "KeyA"
    });
    expect(messages.length).toBe(0);
    wrapper.trigger("keydown", {
      key: "s",
      code: "KeyS"
    });
    expect(messages.length).toBe(0);
    wrapper.trigger("keydown", {
      key: "d",
      code: "KeyD"
    });
    expect(messages.length).toBe(0);
    wrapper.trigger("keydown", {
      key: "f",
      code: "KeyF"
    });
    expect(messages.length).toBe(1);
    expect(messages[0]).toBe("trigger: seems you are so boring");
    wrapper.destroy();
  });

  it("will trigger a key seq shortcut which keys is declared by string array", () => {
    const messages: Array<string> = [];
    const Foo = Vue.extend({
      template: `
        <div>
          Please press:
          <kbd>CMD</kbd> + <kbd>G</kbd> or
          <kbd>Window</kbd> + <kbd>G</kbd>
        </div>
      `,
      mixins: [MixinShortcuts],
      $shortcuts: [
        {
          keys: ["a", "s", "d", "f"],
          handle(event: KeyboardEvent) {
            messages.push("trigger: seems you are so boring");
          }
        }
      ]
    });
    const wrapper: Wrapper<Vue> = mount(Foo, {
      attachToDocument: true
    });
    // { key, code, ctrlKey, shiftKey, altKey, metaKey }
    expect(messages.length).toBe(0);
    wrapper.trigger("keydown", {
      key: "a",
      code: "KeyA"
    });
    expect(messages.length).toBe(0);
    wrapper.trigger("keydown", {
      key: "s",
      code: "KeyS"
    });
    expect(messages.length).toBe(0);
    wrapper.trigger("keydown", {
      key: "d",
      code: "KeyD"
    });
    expect(messages.length).toBe(0);
    wrapper.trigger("keydown", {
      key: "f",
      code: "KeyF"
    });
    expect(messages.length).toBe(1);
    expect(messages[0]).toBe("trigger: seems you are so boring");
    wrapper.destroy();
  });

  it("will trigger a key shortcut on a certain element", () => {
    const messages: Array<string> = [];
    const Foo = Vue.extend({
      template: `
        <div>
          <input type="text" value="CMD + G" @keydown="bindShortcut($event, 'first')" />
          <input type="text" value="CMD + K" @keydown="bindShortcut($event, 'second')" />
        </div>
      `,
      mixins: [MixinShortcuts],
      $shortcuts: {
        first: [
          {
            key: "g",
            modifiers: { meta: true },
            handle() {
              messages.push("trigger: CMD + G");
            }
          }
        ],
        second: [
          {
            key: "k",
            modifiers: { meta: true },
            handle() {
              messages.push("trigger: CMD + K");
            }
          }
        ]
      }
    });
    const wrapper: Wrapper<Vue> = mount(Foo, {
      attachToDocument: true
    });
    // { key, code, ctrlKey, shiftKey, altKey, metaKey }
    expect(messages.length).toBe(0);
    const inputs = wrapper.findAll("input");
    inputs.at(0).trigger("keydown", { key: "g", code: "KeyG", metaKey: true });
    expect(messages.length).toBe(1);
    expect(messages[0]).toBe("trigger: CMD + G");
    inputs.at(1).trigger("keydown", { key: "k", code: "KeyK", metaKey: true });
    expect(messages.length).toBe(2);
    expect(messages[1]).toBe("trigger: CMD + K");
    wrapper.destroy();
  });
});

describe("<VueLive> component", () => {
  it("will generate two zero-size live regions", () => {
    const Foo = Vue.extend({
      template: `<VueLive>hello</VueLive>`,
      components: { VueLive }
    });
    const wrapper: Wrapper<Vue> = mount(Foo);
    const childNodes = wrapper.element.childNodes;
    expect(childNodes.length).toBe(2);
    expect(childNodes[0].nodeType).toBe(wrapper.element.TEXT_NODE);
    expect(childNodes[1].nodeName).toBe("DIV");
    expect(wrapper.element.innerHTML).toBe(
      `
      hello 
      <div style="position: absolute; height: 1px; width: 1px; margin: -1px; overflow: hidden;">
        <div role="log" aria-live="assertive" aria-busy="false"></div> 
        <div role="log" aria-live="assertive" aria-busy="false"></div> 
        <div role="log" aria-live="polite" aria-busy="false"></div> 
        <div role="log" aria-live="polite" aria-busy="false"></div>
      </div>
    `.replace(/(  |\n)/g, "")
    );
  });

  it("will provide announce method", done => {
    let announce: Function = () => {};
    interface InjectedVue extends Vue {
      announce: Function;
    }
    const Foo = Vue.extend({
      template: `<div>hello</div>`,
      inject: ["announce"],
      created() {
        announce = (...args: []) => {
          (<InjectedVue>this).announce(...args);
        };
      }
    });
    const Bar = Vue.extend({
      template: `<VueLive><Foo /></VueLive>`,
      components: { VueLive, Foo }
    });
    const wrapper: Wrapper<Vue> = mount(Bar);
    const logs: WrapperArray<Vue> = wrapper.findAll('[role="log"]');
    expect(logs.at(0).text()).toBe("");
    expect(logs.at(1).text()).toBe("");
    expect(logs.at(2).text()).toBe("");
    expect(logs.at(3).text()).toBe("");
    announce("A");
    new Promise(resolve => {
      setTimeout(() => {
        expect(logs.at(0).text()).toBe("");
        expect(logs.at(1).text()).toBe("");
        expect(logs.at(2).text()).toBe("A");
        expect(logs.at(3).text()).toBe("");
        announce("B");
        resolve();
      });
    })
      .then(
        () =>
          new Promise(resolve => {
            setTimeout(() => {
              expect(logs.at(0).text()).toBe("");
              expect(logs.at(1).text()).toBe("");
              expect(logs.at(2).text()).toBe("");
              expect(logs.at(3).text()).toBe("B");
              announce("C", true);
              resolve();
            });
          })
      )
      .then(
        () =>
          new Promise(resolve => {
            setTimeout(() => {
              expect(logs.at(0).text()).toBe("C");
              expect(logs.at(1).text()).toBe("");
              expect(logs.at(2).text()).toBe("");
              expect(logs.at(3).text()).toBe("B");
              announce("D", true);
              resolve();
            });
          })
      )
      .then(
        () =>
          new Promise(resolve => {
            setTimeout(() => {
              expect(logs.at(0).text()).toBe("");
              expect(logs.at(1).text()).toBe("D");
              expect(logs.at(2).text()).toBe("");
              expect(logs.at(3).text()).toBe("B");
              resolve();
              done();
            });
          })
      );
  });
});

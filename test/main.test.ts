import { describe, it, expect } from "vitest";
import {
  PropType,
  defineComponent,
  computed,
  ref,
  watch,
  onMounted,
} from "vue";
import { mount, VueWrapper } from "@vue/test-utils";

import {
  directiveAria,
  getTabindexByRole,
  ariaToAttrs,
  useTravel,
  genId,
  FocusTrap,
  useHotkey,
  useGlobalHotkey,
  Announce,
  Live,
  useLive,
} from "../src/index";

const NothingHappen = defineComponent({
  template: `<slot />`,
});

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe("Aria utils", () => {
  it("get tabindex for a role correctly", () => {
    expect(getTabindexByRole(0, "button")).toBe("0");
    expect(getTabindexByRole(NaN, "button")).toBe("-1");
    expect(getTabindexByRole(0, "none")).toBe("-1");
  });

  it("get attributes correctly", () => {
    expect(ariaToAttrs({ label: "save your changes" }, "button")).toEqual({
      role: "button",
      "aria-label": "save your changes",
    });
  });

  it("set array-type aria props correctly", () => {
    expect(
      ariaToAttrs([{ label: "save your changes" }, { pressed: true }], "button")
    ).toEqual({
      role: "button",
      "aria-label": "save your changes",
      "aria-pressed": "true",
    });
  });

  it("set complex aria props correctly", () => {
    expect(
      ariaToAttrs(
        [
          { label: "save your changes" },
          { pressed: true },
          { expanded: false },
        ],
        "button",
        5
      )
    ).toEqual({
      role: "button",
      "aria-label": "save your changes",
      "aria-pressed": "true",
      "aria-expanded": "false",
      tabindex: "5",
    });
    expect(
      ariaToAttrs(
        [
          { label: "save your changes" },
          { pressed: true },
          { expanded: false },
        ],
        "none",
        5
      )
    ).toEqual({
      role: "none",
      "aria-label": "save your changes",
      "aria-pressed": "true",
      "aria-expanded": "false",
      tabindex: "-1",
    });
  });
});

describe("Aria utils: v-aria directive", () => {
  it("set aria-* attributes correctly when init", () => {
    const Foo = defineComponent({
      template: `
        <i
          class="icon-save"
          role="button"
          v-aria="{ label: 'save your changes' }"
        />
      `,
      directives: {
        aria: directiveAria,
      },
    });
    const wrapper = mount(Foo);
    expect(wrapper.element.tagName).toBe("I");
    expect(wrapper.text()).toBe("");
    expect(wrapper.attributes()).toEqual({
      class: "icon-save",
      role: "button",
      "aria-label": "save your changes",
    });
  });

  it("update aria-* attributes correctly when update prop data", async () => {
    const Foo = defineComponent({
      template: `
        <i
          class="icon-save"
          role="button"
          v-aria="ariaConfig"
        />
      `,
      directives: {
        aria: directiveAria,
      },
      props: {
        ariaConfig: Object,
      },
    });
    const wrapper = mount(Foo);
    expect(wrapper.element.tagName).toBe("I");
    expect(wrapper.text()).toBe("");
    expect(wrapper.attributes()).toEqual({
      class: "icon-save",
      role: "button",
    });

    await wrapper.setProps({
      ariaConfig: { label: "save your changes" },
    });
    expect(wrapper.element.tagName).toBe("I");
    expect(wrapper.text()).toBe("");
    expect(wrapper.attributes()).toEqual({
      class: "icon-save",
      role: "button",
      "aria-label": "save your changes",
    });

    await wrapper.setProps({
      ariaConfig: {
        label: "Save Your Changes",
        pressed: true,
      },
    });
    expect(wrapper.element.tagName).toBe("I");
    expect(wrapper.text()).toBe("");
    expect(wrapper.attributes()).toEqual({
      class: "icon-save",
      role: "button",
      "aria-label": "Save Your Changes",
      "aria-pressed": "true",
    });

    await wrapper.setProps({
      ariaConfig: {
        pressed: false,
      },
    });
    expect(wrapper.element.tagName).toBe("I");
    expect(wrapper.text()).toBe("");
    expect(wrapper.attributes()).toEqual({
      class: "icon-save",
      role: "button",
      "aria-pressed": "false",
    });
  });

  it("only runs on component with element root node", () => {
    const Foo = defineComponent({
      template: `
        <NothingHappen
          v-aria="{
            label: 'Save Your Changes',
            controls: 'id-of-a-textbox'
          }"
        >
          <i class="icon-save" role="button" />
        </NothingHappen>
      `,
      components: {
        NothingHappen,
      },
      directives: {
        aria: directiveAria,
      },
    });
    const wrapper = mount(Foo).get("[data-v-app] > *");
    expect(wrapper.element.tagName).toBe("I");
    expect(wrapper.text()).toBe("");
    expect(wrapper.attributes()).toEqual({
      class: "icon-save",
      role: "button",
    });
  });
});

describe("Travel utils", () => {
  type TravelOptionExample = {
    text: string;
    value: string;
  };

  it("travel through all focusable items", async () => {
    // a walkaround for HTMLElement#focus() + document.activeElement
    let currentFocus: HTMLElement | null = null;
    const Foo = defineComponent({
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
      setup() {
        const index = ref(0);
        const items = ref<HTMLElement[]>([]);
        onMounted(() => {
          currentFocus = items.value[0];
        });
        const bindTravel = useTravel({
          loop: true,
          items,
          index,
          onMove(event, newIndex) {
            event.preventDefault();
            index.value = newIndex;
            currentFocus = items.value[newIndex];
          },
        });
        return {
          items,
          bindTravel,
        };
      },
      props: {
        options: Array as PropType<TravelOptionExample[]>,
      },
    });

    const wrapper = mount(Foo, {
      attachToDocument: true,
      props: {
        options: [
          { text: "First", value: "foo" },
          { text: "Second", value: "bar" },
          { text: "Third", value: "baz" },
        ],
      },
    });

    const document = wrapper.element.ownerDocument;
    const items = wrapper.vm.items;
    expect(document).toBeTruthy();
    expect(Array.isArray(items)).toBeTruthy();
    if (!document || !Array.isArray(items)) {
      return;
    }

    expect(currentFocus).toBe(items[0]);

    wrapper.trigger("keydown", { key: "ArrowDown" });
    expect(currentFocus).toBe(items[1]);

    wrapper.trigger("keydown", { key: "ArrowDown" });
    expect(currentFocus).toBe(items[2]);

    wrapper.trigger("keydown", { key: "ArrowDown" });
    expect(currentFocus).toBe(items[0]);

    wrapper.trigger("keydown", { key: "End" });
    expect(currentFocus).toBe(items[2]);
  });

  it("fire action when enter key down", () => {
    let lastAction: string | undefined = "";
    let currentFocus: HTMLElement | null = null;

    const ListItem = defineComponent({
      template: `<div role="listitem" tabindex="-1">{{ text }}</div>`,
      props: {
        text: String,
        value: String,
      },
      methods: {
        fireAction() {
          lastAction = this.value;
        },
      },
      expose: ["fireAction"],
    });

    const Foo = defineComponent({
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
      components: { ListItem },
      setup() {
        const index = ref(0);
        const items = ref<InstanceType<typeof ListItem>[]>([]);
        onMounted(() => {
          currentFocus = items.value[0].$el;
        });
        const bindTravel = useTravel({
          loop: true,
          items,
          index,
          onMove(event, newIndex) {
            event.preventDefault();
            index.value = newIndex;
            currentFocus = items.value[newIndex].$el;
          },
          onAction(_, index, items) {
            const item = items[index] as InstanceType<typeof ListItem>;
            item.fireAction();
          },
        });
        return {
          items,
          bindTravel,
        };
      },
      props: {
        options: Array,
      },
    });

    const wrapper = mount(Foo, {
      attachToDocument: true,
      props: {
        options: [
          { text: "First", value: "foo" },
          { text: "Second", value: "bar" },
          { text: "Third", value: "baz" },
        ],
      },
    });
    const document: Document | null = wrapper.element.ownerDocument;
    const items = wrapper.vm.items;
    expect(document).toBeTruthy();
    expect(Array.isArray(items)).toBeTruthy();
    if (!document || !Array.isArray(items)) {
      return;
    }
    expect(currentFocus).toBe(items[0].$el);
    expect(lastAction).toBe("");

    wrapper.trigger("keydown", { key: "ArrowDown" });
    expect(currentFocus).toBe(items[1].$el);
    expect(lastAction).toBe("");

    wrapper.trigger("keydown", { key: "Enter" });
    expect(currentFocus).toBe(items[1].$el);
    expect(lastAction).toBe("bar");

    wrapper.trigger("keydown", { key: "ArrowDown" });
    expect(currentFocus).toBe(items[2].$el);
    expect(lastAction).toBe("bar");

    wrapper.trigger("keydown", { key: "Enter" });
    expect(currentFocus).toBe(items[2].$el);
    expect(lastAction).toBe("baz");

    wrapper.trigger("keydown", { key: "ArrowDown" });
    expect(currentFocus).toBe(items[0].$el);
    expect(lastAction).toBe("baz");

    wrapper.trigger("keydown", { key: "End" });
    expect(currentFocus).toBe(items[2].$el);
    expect(lastAction).toBe("baz");
  });
});

describe("Id utils", () => {
  const Foo = defineComponent({
    props: {
      id: String,
    },
    setup(props) {
      const localId = computed(() => genId(props.id));
      return { localId };
    },
    template: `
      <div>
        <label ref="label" :id="\`\${localId}-label\`">Username</label>
        <input
          ref="input"
          :id="\`\${localId}-input\`"
          :aria-labelledby="\`\${localId}-label\`"
        />
      </div>
    `,
  });

  it("will generate unique new ids for each component instance", () => {
    const wrapper = mount(Foo);
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
      expect(labelId.slice(0, labelId.length - 5)).toBe(
        inputId.slice(0, inputId.length - 5)
      );
    }
  });

  it("will use an id prop to assign sub ids", () => {
    const wrapper = mount(Foo, {
      props: { id: "v-helloworld" },
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

  it("will update localId after id prop changed", async () => {
    const wrapper = mount(Foo);
    const label = <HTMLElement>wrapper.vm.$refs.label;
    const input = <HTMLElement>wrapper.vm.$refs.input;
    expect(label).toBeTruthy();
    expect(Array.isArray(label)).toBeFalsy();
    expect(input).toBeTruthy();
    expect(Array.isArray(input)).toBeFalsy();
    if (label && input && !Array.isArray(label) && !Array.isArray(input)) {
      await wrapper.setProps({ id: "v-helloworld" });
      expect(label.getAttribute("id")).toBe("v-helloworld-label");
      await wrapper.setProps({ id: null });
      expect(label.getAttribute("id")).not.toBe("v-helloworld-label");
      expect(label.getAttribute("id")).toBe(
        input.getAttribute("aria-labelledby")
      );
    }
  });
});

describe("FocusTrap utils", () => {
  it("will trap focus to a modal dialog", async () => {
    const Foo = defineComponent({
      template: `
        <div id="focus-trap-example">
          <button class="trigger" ref="trigger" @click="shown = true">
            Open a Modal Dialog
          </button>
          <div v-if="shown" class="dialog">
            <FocusTrap
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
              <button ref="cancel" @click="shown = false">Cancel</button>
            </FocusTrap>
          </div>
        </div>
      `,
      components: {
        FocusTrap,
      },
      setup(_, { expose }) {
        const trigger = ref<HTMLElement>();
        const dialog = ref<typeof FocusTrap>();
        const email = ref<HTMLElement>();
        const password = ref<HTMLElement>();
        const login = ref<HTMLElement>();
        const cancel = ref<HTMLElement>();

        const shown = ref(false);

        const goFirst = () => {
          email.value?.focus();
        };
        const goLast = () => {
          cancel.value?.focus();
        };

        onMounted(() => {
          trigger.value?.focus();
        });

        watch(shown, (value) => {
          if (value) {
            setTimeout(() => {
              dialog.value?.open();
            }, 100);
          } else {
            dialog.value?.close(true);
          }
        });

        expose({ shown });

        return {
          shown,
          trigger,
          dialog,
          email,
          password,
          login,
          cancel,
          goFirst,
          goLast,
        };
      },
    });

    // NOTICE:
    // vue-test-utils doesn't support TAB focus
    // but still preserve this case.

    // init
    const wrapper = mount(Foo, { attachToDocument: true });
    const document = wrapper.element.ownerDocument;
    expect(document).toBeTruthy();

    const trigger = wrapper.find(".trigger");
    expect(trigger.exists()).toBeTruthy();

    // init state
    expect(wrapper.vm.shown).toBeFalsy();
    let dialog = wrapper.find(".dialog");
    expect(dialog.exists()).toBeFalsy();

    // click trigger
    await trigger.trigger("click");
    expect(wrapper.vm.shown).toBeTruthy();
    dialog = wrapper.find(".dialog");
    const first = wrapper.find('.dialog input[type="email"]');
    const [login, cancel] = wrapper.findAll(".dialog button");
    expect(dialog.exists()).toBeTruthy();
    expect(first.exists()).toBeTruthy();
    expect(cancel.exists()).toBeTruthy();
    expect(dialog.isVisible()).toBeTruthy();
    // TODO: check focus
    // expect(document.activeElement).toBe(first.element);
    await login.trigger("click");
    dialog = wrapper.find(".dialog");
    expect(wrapper.vm.shown).toBeFalsy();
    expect(dialog.exists()).toBeFalsy();
  });
});

describe("Hotkey utils", () => {
  it.todo("will trigger a single-key shortcut", async () => {
    const messages: Array<string> = [];
    const Foo = defineComponent({
      template: `
        <div>
          Please press:
          <kbd>CMD</kbd> + <kbd>G</kbd> or
          <kbd>Window</kbd> + <kbd>G</kbd>
        </div>
      `,
      setup() {
        useGlobalHotkey({
          key: "g",
          modifiers: { meta: true },
          handler() {
            messages.push("trigger: CMD + G");
          },
        });
      },
    });
    const wrapper = mount(Foo, {
      attachToDocument: true,
    });
    // { key, code, ctrlKey, shiftKey, altKey, metaKey }
    expect(messages.length).toBe(0);
    await wrapper.trigger("keydown", {
      key: "g",
      code: "KeyG",
    });
    expect(messages.length).toBe(0);
    await wrapper.trigger("keydown", {
      key: "F",
      code: "KeyF",
      metaKey: true,
      ctrlKey: false,
      shiftKey: false,
      altKey: false,
    });
    expect(messages.length).toBe(0);
    await wrapper.trigger("keydown", {
      key: "G",
      code: "KeyG",
      metaKey: true,
      ctrlKey: true,
      shiftKey: false,
      altKey: false,
    });
    expect(messages.length).toBe(0);
    await wrapper.trigger("keydown", {
      key: "g",
      code: "KeyG",
      metaKey: true,
      ctrlKey: false,
      shiftKey: false,
      altKey: false,
    });
    expect(messages.length).toBe(1);
    expect(messages[0]).toBe("trigger: CMD + G");
    await wrapper.trigger("keydown", {
      key: "G",
      code: "KeyG",
      metaKey: true,
      ctrlKey: false,
      shiftKey: false,
      altKey: false,
    });
    expect(messages.length).toBe(2);
    expect(messages[1]).toBe("trigger: CMD + G");
    wrapper.unmount();
  });

  it.todo("will trigger a key seq shortcut", async () => {
    const messages: Array<string> = [];
    const Foo = defineComponent({
      template: `
        <div>
          Please press:
          <kbd>CMD</kbd> + <kbd>G</kbd> or
          <kbd>Window</kbd> + <kbd>G</kbd>
        </div>
      `,
      setup() {
        useGlobalHotkey({
          keys: [{ key: "a" }, { key: "s" }, { key: "d" }, { key: "f" }],
          handler(event: KeyboardEvent) {
            messages.push("trigger: seems you are so boring");
          },
        });
      },
    });
    const wrapper = mount(Foo, {
      attachToDocument: true,
    });
    // { key, code, ctrlKey, shiftKey, altKey, metaKey }
    expect(messages.length).toBe(0);
    await wrapper.trigger("keydown", {
      key: "a",
      code: "KeyA",
    });
    expect(messages.length).toBe(0);
    await wrapper.trigger("keydown", {
      key: "s",
      code: "KeyS",
    });
    expect(messages.length).toBe(0);
    await wrapper.trigger("keydown", {
      key: "d",
      code: "KeyD",
    });
    expect(messages.length).toBe(0);
    await wrapper.trigger("keydown", {
      key: "f",
      code: "KeyF",
    });
    expect(messages.length).toBe(1);
    expect(messages[0]).toBe("trigger: seems you are so boring");
    wrapper.unmount();
  });

  it.todo(
    "will trigger a key seq shortcut which keys is declared by string array",
    async () => {
      const messages: Array<string> = [];
      const Foo = defineComponent({
        template: `
        <div>
          Please press:
          <kbd>CMD</kbd> + <kbd>G</kbd> or
          <kbd>Window</kbd> + <kbd>G</kbd>
        </div>
      `,
        setup() {
          useGlobalHotkey({
            keys: ["a", "s", "d", "f"],
            handler(event: KeyboardEvent) {
              messages.push("trigger: seems you are so boring");
            },
          });
        },
      });
      const wrapper = mount(Foo, {
        attachToDocument: true,
      });
      // { key, code, ctrlKey, shiftKey, altKey, metaKey }
      expect(messages.length).toBe(0);
      await wrapper.trigger("keydown", {
        key: "a",
        code: "KeyA",
      });
      expect(messages.length).toBe(0);
      await wrapper.trigger("keydown", {
        key: "s",
        code: "KeyS",
      });
      expect(messages.length).toBe(0);
      await wrapper.trigger("keydown", {
        key: "d",
        code: "KeyD",
      });
      expect(messages.length).toBe(0);
      await wrapper.trigger("keydown", {
        key: "f",
        code: "KeyF",
      });
      expect(messages.length).toBe(1);
      expect(messages[0]).toBe("trigger: seems you are so boring");
      wrapper.unmount();
    }
  );

  it("will trigger a key shortcut on a certain element", async () => {
    const messages: Array<string> = [];
    const Foo = defineComponent({
      template: `
        <div>
          <input type="text" value="CMD + G" @keydown="bindFirst" />
          <input type="text" value="CMD + K" @keydown="bindSecond" />
        </div>
      `,
      setup() {
        const bindFirst = useHotkey({
          key: "g",
          modifiers: { meta: true },
          handler() {
            messages.push("trigger: CMD + G");
          },
        });
        const bindSecond = useHotkey({
          key: "k",
          modifiers: { meta: true },
          handler() {
            messages.push("trigger: CMD + K");
          },
        });
        return { bindFirst, bindSecond };
      },
    });
    const wrapper = mount(Foo, {
      attachToDocument: true,
    });
    // { key, code, ctrlKey, shiftKey, altKey, metaKey }
    expect(messages.length).toBe(0);
    const inputs = wrapper.findAll("input");
    await inputs[0].trigger("keydown", {
      key: "g",
      code: "KeyG",
      metaKey: true,
    });
    expect(messages.length).toBe(1);
    expect(messages[0]).toBe("trigger: CMD + G");
    await inputs[1].trigger("keydown", {
      key: "k",
      code: "KeyK",
      metaKey: true,
    });
    expect(messages.length).toBe(2);
    expect(messages[1]).toBe("trigger: CMD + K");
    wrapper.unmount();
  });
});

describe("Live utils", () => {
  it("will generate two zero-size live regions", () => {
    const Foo = defineComponent({
      template: `<Live foo>hello</Live>`,
      components: { Live },
    });
    const wrapper = mount(Foo);
    const root = wrapper.find("[foo]").element;
    const children = Array.prototype.filter.call(root.childNodes, (node) => {
      return node.nodeType === 1 || node.nodeValue.length > 0;
    });
    expect(children.length).toBe(2);
    expect(children[0].nodeType).toBe(3);
    expect(children[0].nodeValue).toBe("hello");
    expect(children[1].nodeType).toBe(1);
    expect(children[1].childNodes.length).toBe(4);
    expect(children[1].querySelectorAll('[role="log"]').length).toBe(4);
    expect(children[1].querySelectorAll('[aria-live="assertive"]').length).toBe(
      2
    );
    expect(children[1].querySelectorAll('[aria-live="polite"]').length).toBe(2);
  });

  it("will provide announce method", async () => {
    let announce: Announce = () => {};

    const Foo = defineComponent({
      template: `<div>hello</div>`,
      setup() {
        [announce] = useLive();
        return { announce };
      },
    });
    const Bar = defineComponent({
      template: `<Live><Foo /></Live>`,
      components: { Live, Foo },
    });
    const wrapper: VueWrapper = mount(Bar);
    const logs = wrapper.findAll('[role="log"]');
    expect(logs[0].text()).toBe("");
    expect(logs[1].text()).toBe("");
    expect(logs[2].text()).toBe("");
    expect(logs[3].text()).toBe("");

    announce("A");
    await sleep(100);
    expect(logs[0].text()).toBe("");
    expect(logs[1].text()).toBe("");
    expect(logs[2].text()).toBe("A");
    expect(logs[3].text()).toBe("");

    announce("B");
    await sleep(100);
    expect(logs[0].text()).toBe("");
    expect(logs[1].text()).toBe("");
    expect(logs[2].text()).toBe("");
    expect(logs[3].text()).toBe("B");

    announce("C", true);
    await sleep(100);
    expect(logs[0].text()).toBe("C");
    expect(logs[1].text()).toBe("");
    expect(logs[2].text()).toBe("");
    expect(logs[3].text()).toBe("B");

    announce("D", true);
    await sleep(100);
    expect(logs[0].text()).toBe("");
    expect(logs[1].text()).toBe("D");
    expect(logs[2].text()).toBe("");
    expect(logs[3].text()).toBe("B");
  });
});

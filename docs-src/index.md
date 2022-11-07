# Vue A11y Utils

<div style="display: flex; align-items: center;">
  <img src="https://vuejs.org/images/logo.png" width="200" height="200" />
  <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" version="1.1" x="0" y="0" viewBox="-3627 353 1024 1024" style="enable-background:new -3627 353 1024 1024;"><circle cx="-3115" cy="865" r="512" fill="#4dba87"></circle><path d="M-3116.4 353c-282 0-510.6 228.6-510.6 510.6s228.6 510.6 510.6 510.6s510.6-228.6 510.6-510.6S-2834.4 353-3116.4 353z M-3124.1 454.4c36.6 0 66.2 29.6 66.2 65.9c0 36.6-29.6 66.2-66.2 66.2c-36.3 0-65.9-29.6-65.9-66.2 C-3190.1 484-3160.5 454.4-3124.1 454.4L-3124.1 454.4z M-2838 667.7l-196.4 24.8l0.1 196.6l95.2 317.7c5 20.1-7 40.1-26.9 45.1 c-19.8 5-40.1-6-45.1-26l-97.5-289.2h-30l-89.7 295.2c-7.5 19.3-29 28.1-48.2 20.6c-19.1-7.4-30.7-29.1-23.2-48.4l82.4-311.8V692.5 l-181-24.6c-18.6-1.5-31.2-17.8-29.7-36.4c1.4-18.7 18.3-32.6 36.8-31.1l219.9 18.9h96.4l234.1-19.3c18.6-0.7 34.4 13.7 35 32.5 C-2805 651-2819.4 666.9-2838 667.7L-2838 667.7z" fill="#435466"></path></svg>
</div>

Utilities for accessibility (a11y) in Vue.js

## Table of Contents

- [Why](#why)
- [Getting Started](#getting-started)
- [`<VueAria>` Component](#vuearia-component)
- [`v-aria` Custome Directive](#v-aria-custom-directive)
- [`Travel` Mixin](#travel-mixin)
- [`Id` Mixin](#id-mixin)
- [`<VueFocusTrap>` Component](#vuefocustrap-component)
- [`Shortcuts` Mixin](#shortcuts-mixin)
- [`<VueLive>` Component](#vuelive-component)
- [Further resources](#further-resources)

## Why

TL;DR: when you write a Vue app with full accessibility, you may meet some common issues to deal with. So we built this project to help you.

<details>

### Background

As the [(WIP) Vue accessibility guide page](https://github.com/vuejs/vuejs.org/pull/1002) says:

> The World Health Organization estimate that 15% of the world's population has some form of disability, 2-4% of them severely so ... which can be divided roughly into four categories: _visual impairments_, _motor impairments_, _hearing impairments_ and _cognitive impairments_.

_table: issues for different impairments_

| visual  | motor              | hearing | cognitive                    |
| ------- | ------------------ | ------- | ---------------------------- |
| 🖥 🔎 🎨 | 🖱 📱 ⌨️ 🕹 🎮 🎙 🖊 🎛 | 🔈      | content, layout, interaction |

Or there are also some accessibility issues for a normal person in such a situation like driving a car, having a meeting, using a mobile device with a bluetooth keyboard etc.

So actually accessibility is not just for the "less amount of people", but for almost everyone.

But some mistakes we often make in a real project like:

- Mouse-only in a desktop app
- Touch-only in a mobile app
- Remote-control-only in a TV app
- Operation through keyboard only is not possible or with low efficiency
- No text alternative for non-text content
- Have no fallback way for the creative interaction like e-pencil, audio input, face ID, touch ID, NFC etc.
- The color contrast is not enough

Each of them might make user confused, block the user flow or lead user to a no-way-out trap in some certain cases.

### Web Standards

However, there are already some web standards and best practice to follow which let developers do it better.

In W3C there are 3 main parts of accessibility standards:

![WAI standard overview](https://www.w3.org/WAI/content-images/wai-std-gl-overview/specs.png)  
via: [W3C Accessibility Standards Overview](https://www.w3.org/WAI/standards-guidelines/)

- [WCAG](https://www.w3.org/TR/WCAG20/): about web content, targeting websites.
- [UAAG](https://www.w3.org/TR/UAAG20/): about user agent, targeting browsers, screen readers etc.
- [ATAG](https://www.w3.org/TR/ATAG20/): about authoring tools, targeting CMS, WYSIWYG editor etc.

and a technical spec which is commonly used:

- [WAI-ARIA](https://w3c.github.io/aria/): targeting web app.

For web developers, we may pay more attention on WCAG and WAI-ARIA. At the same time, we should know which user agents people use most and how about their support and compatibility to the standard.

Here is a survey about most common screen reader and browser combinations table:

| Screen Reader & Browser     | # of Respondents | % of Respondents |
| --------------------------- | ---------------- | ---------------- |
| JAWS with Internet Explorer | 424              | 24.7%            |
| NVDA with Firefox           | 405              | 23.6%            |
| JAWS with Firefox           | 260              | 15.1%            |
| VoiceOver with Safari       | 172              | 10.0%            |
| JAWS with Chrome            | 112              | 6.5%             |
| NVDA with Chrome            | 102              | 5.9%             |
| NVDA with IE                | 40               | 2.3%             |
| VoiceOver with Chrome       | 24               | 1.4%             |
| Other combinations          | 180              | 10.5%            |

_via [Screen Reader User Survey by webaim.org](https://webaim.org/projects/screenreadersurvey7/#browsercombos)_

### Common Issues

When you write a Vue app with full accessibility. You may meet some issues frequently. For example:

- Making sure the [W3C WAI-ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA) roles & properties of each DOM element are set properly.
- Controling the _focus_ and finish every use case elegantly only through _keyboard_.
- Using a central [live region](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions) to read messages right now in a screen reader.
- Sometimes you need set a _ID reference_ or _ID reference list_ type aria attribute with _ID_ of another DOM element. But we don't use _ID_ in Vue to identify a DOM element right?

So that's why **Vue A11y Utils** is trying to supply a group of utilities to help Vue developers finish these jobs easier.

</details>

## Getting Started

### Install

```bash
npm install vue-a11y-utils
```

or

```bash
yarn add vue-a11y-utils
```

### Import

```js
// choose the utils you need
import {
  ariaToAttrs,
  getTabindexByRole,
  Live,
  useLive,
  FocusTrap,
  genId,
  useTravel,
  useHotkey,
  useGlobalHotkey,
} from "vue-a11y-utils";
```

### Usage

See the docs below or preview some [examples](https://github.com/Jinjiang/vue-a11y-utils/tree/master/examples) [online](https://jinjiang.github.io/vue-a11y-utils/examples).

For more complicated examples, there is another repo in [`Jinjiang/vue-a11y-examples`](https://github.com/Jinjiang/vue-a11y-examples/) you can [preview online](https://jinjiang.github.io/vue-a11y-examples/).

## `<VueAria>` Component

This component helps you to write `role` and `aria-*` attributes likely in a better way.

First you could put all `aria-*` attributes in an JS object. Second these a11y attributes could be inherited when more than 1 `<VueAria>` components nested. Third, it's more portable to use.

Another thing important is the [`tabindex` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex) which could make an element focusable. But sometimes when the `role` changed into `"none"` or `"appearance"`, there should be a easy way to control whether it is focusable as well.

### Examples

#### For Props `role` And `aria`

```vue{2-4,8,10}
<template>
  <VueAria role="menubutton" :aria="aria">
    <button>WAI-ARIA Quick Links</button>
  </VueAria>
</template>

<script>
import { VueAria } from "vue-a11y-utils";
export default {
  components: { VueAria },
  data() {
    return {
      aria: {
        haspopup: true,
        controls: "menu2"
      }
    };
  }
};
</script>
```

which is same to:

```vue
<template>
  <button id="menubutton" aria-haspopup="true" aria-controls="menu2">
    WAI-ARIA Quick Links
  </button>
</template>
```

So the content and structure in template is more clear than which with a lot of `aria-*` attribute in.

The `aria` prop could also be an Array which is convenient to merge multiple `aria-*` attribute from different places:

```vue{4-8}
<template>
  <VueAria
    role="menubutton"
    :aria="[ariaData, ariaProps, otherAriaFromSomewhereElse]"
  >
    <button>WAI-ARIA Quick Links</button>
  </VueAria>
</template>
```

And this component could be nested like:

```vue{2-4}
<template>
  <VueAria :aria="otherAriaFromSomewhereElse">
    <VueAria :aria="ariaProps">
      <VueAria role="menubutton" :aria="ariaData">
        <button>WAI-ARIA Quick Links</button>
      </VueAria>
    </VueAria>
  </VueAria>
</template>
```

or:

```vue{2-3}
<template>
  <VueAria role="menubutton">
    <VueAria :aria="aria">
      <button>WAI-ARIA Quick Links</button>
    </VueAria>
  </VueAria>
</template>
```

#### For Prop `tabindex`

If you want to make a `<div>` focusable. You should give it a `tabindex` attribute. For example:

```vue{4}
<template>
  <VueAria role="menubutton" :tabindex="0">
    <div>WAI-ARIA Quick Links</div>
  </VueAria>
</template>
```

When you pass `"none"` or `"appearance"` value into `role` prop but without a `tabindex` prop. The `tabindex` attribute on the root element will finally be `""` by default. For examples:

```vue{3}
<template>
  <!-- won't be focused by click or TAB key -->
  <VueAria role="none">
    <div tabindex="0" role="menubutton">WAI-ARIA Quick Links</div>
  </VueAria>
</template>
```

```vue{3}
<template>
  <!-- won't be focused TAB key but could be focused by click -->
  <VueAria role="none" :tabindex="-1">
    <div role="button" tabindex="0">WAI-ARIA Quick Links</div>
  </VueAria>
</template>
```

### API

#### props

- `role`: `string`
- `aria`: `Array` or `Object`
- `tabindex`: `number`

::: tip
When you pass `"none"` or `"appearance"` value into `role` prop but without a `tabindex` prop. The `tabindex` attribute on the root element will finally be `""` by default.
:::

#### slots

- default slot: the element you would put these a11y attributes on (only one root element is accepted)

## `v-aria` Custom Directive

If you prefer using directives rather than components, here is another choise: `v-aria` custom directive.

It helps you to write `aria-*` attributes better throught a Vue custom directive.

Almost the same to the `aria` prop in `<VueAria>` component, let you put all `aria-*` attributes in an object or array.

::: tip
Because the custom directive would modify the DOM element. It is different from component which renders virtual DOM. So `v-aria` will run after all `<VueAria>` executed if you put both of them on a same DOM element. And the performance of `v-aria` would be theoritically a little bit slower than `<VueAria>` if you use them bested quite a lot.
:::

### Examples

```vue{2,6,8-10}
<template>
  <i class="icon-save" role="button" v-aria="aria" />
</template>

<script>
import { directiveAria } from "vue-a11y-utils";
export default {
  directives: {
    aria: directiveAria
  },
  data() {
    return {
      aria: {
        label: "save your changes",
        controls: "id-of-a-textbox"
      }
    };
  }
};
</script>
```

This example above is same to:

```vue
<template>
  <i
    class="icon-save"
    role="button"
    aria-label="save your changes"
    aria-controls="id-of-a-textbox"
  >
</template>
```

Btw. there is no custom directive such as `v-role` and `v-tabindex` because you can set the two raw attributes directly on the same component or element with `v-aria`.

## `Travel` Mixin

This mixin exposes a method named `bindTravel($event: KeyboardEvent)` which helps you use <kbd>Arrow</kbd> keys to travel through a group of focusable items or descendants. At the same time we support you fire some common actions by pressing <kbd>ENTER</kbd>, <kbd>SPACE</kbd> or <kbd>ESC</kbd> key.

Beside binding the method to a `@keydown` event, you should also config a special component option: `$travel: TravelConfig`. The config object must contain a `setItems(vm)` method to return an array of items you want to travel, and a pair of `getIndex(vm)`, `setIndex(vm, index)` methods to access the current active index. And also you could define how to `move(vm, event, newIndex, oldIndex, items)` active index, how to fire action by `enter(vm, event, index, items)`, `space(vm, event, index, items)` or `esc(vm, event, index, items)` keys. These 3 methods support returning a truthy value to avoid other following actions happened from the same `event`.

If there are more than one area you want to travel in a Vue component, we also provide another named travel way like: `bindTravel($event, name)` method + `$travel: Record<string, TravelConfig>` config.

Additionally, this travel config also accepts you define:

- `looped` to determine whether the travel would be looped back when we go next at the last item or go previously at the first item.
- `orientation` to determine the orientation of the <kbd>Arrow</kbd> keys: `"horizontal"` or `"vertical"`.
- `hasPagination` to fire `nextPage(vm, event, index, items)` & `prevPage(vm, event, index, items)` when <kbd>PageDown</kbd> or <kbd>PageUp</kbd> pressed.
- `hasSearch` to fire `search(vm, next, keyword, index, items)` when a letter or number key pressed.

::: tip
We suggest you define all the methods in `TravelConfig` config as pure functions. So the first parameter of each methods are always the Vue component instance object (`vm`). Don't forget to pass the right parameters when using them and using `vm.foo` or `vm.foo()`, not `this.foo` or `this.foo()`, to access the props/data/methods/... Vue component instance members in these methods.
:::

### Examples

#### Focus Travel Using Arrow Keys

The second example is about focus travel using <kbd>Arrow</kbd> keys in a Vue component. There are 2 files:

- `App.vue`:

  ```vue{2,14,16-36,38,40}
  <template>
    <div role="list" @keydown="bindTravel">
      <ListItem
        ref="items"
        v-for="option in options"
        :key="option.value"
        :text="option.text"
        :value="option.value"
      />
    </div>
  </template>

  <script>
  import { MixinTravel } from "vue-a11y-utils";

  const travelConfig = {
    looped: true,
    getItems(vm) {
      return vm.$refs.items;
    },
    getIndex(vm) {
      return vm.currentIndex;
    },
    setIndex(vm, index) {
      vm.currentIndex = index;
      const items = this.getItems(vm);
      const item = items[index];
      item.$el.focus();
    },
    move(vm, event, newIndex) {
      this.setIndex(vm, newIndex);
    },
    enter(vm, event, index, items) {
      items[index].fireAction();
    }
  };
  export default {
    mixins: [MixinTravel],
    components: { ListItem },
    $travel: travelConfig,
    data() {
      return {
        currentIndex: 0
      };
    },
    props: {
      options: Array
    }
  };
  </script>
  ```

- `ListItem.vue`:

  ```vue{2}
  <template>
    <div role="listitem" tabindex="-1" @click="fireAction">{{ text }}</div>
  </template>

  <script>
  export default {
    props: {
      text: String,
      value: String
    },
    methods: {
      fireAction() {
        alert(this.value);
      }
    }
  };
  </script>
  ```

Here are some points you may notice:

1. Bind `@keydown="bindTravel"` to the root DOM element of your component.
2. Define `getItems(vm)`, `getIndex(vm)`, `setIndex(vm, index)` methods in `travelConfig` to make the travel runnable.
3. Define the `move()` method to make the travel worked and define the `looped` travel way.
4. Define `enter()` method to call `fireAction()` method in the current active `<ListItem>` component when user press <kbd>ENTER</kbd>.

Now you can focus the list first, and use <kbd>ArrowUp</kbd> and <kbd>ArrowDown</kbd> to travel each items. When you press <kbd>ENTER</kbd>, an alert with the value of the current focused item would be poped up.

### API

#### Method you can call

- `bindTravel(event: KeyboardEvent[, name: string]): void`

  The second parameter is optional. When you write `$travel` option like:

  ```js
  $travel: {
    foo: travelConfigFoo,
    bar: travelConfigBar
  }
  ```

  You can use the second parameter like: `bindTravel($event, 'foo')` or `bindTravel($event, 'bar')` to match a certain travel config.

#### Component option you can define

- `$travel: TravelConfig`
- `$travel: Record<string, TravelConfig>`

The format of `TravelConfig`:

_Basic config_

- `getItems(vm): any[]`: required
- `getIndex(vm): number`: required
- `setIndex(vm, index)`: required

_Basic movement config_

- `orientation: string`: optional, `"vertical"` (default value) or `"horizontal"`
- `looped: boolean`
- `move(vm, event, newIndex, oldIndex, items)`: optional, if you don't define this method the active index may be not possible to move when <kbd>Arrow</kbd> keys pressed.

_Action config_

- `enter(vm, event, index, items)`: optional, will be fired when <kbd>ENTER</kbd> key pressed.
- `space(vm, event, index, items)`: optional, will be fired when <kbd>SPACE</kbd> key pressed.
- `action(vm, event, index, items)`: optional, will be fired when <kbd>ENTER</kbd> or <kbd>SPACE</kbd> key pressed.
- `esc(vm, event, index, items)`: optional, will be fired when <kbd>Escape</kbd> key pressed.

_Pagination config_

- `hasPagination: boolean`: optional
- `nextPage(vm, event, index, items)`: optional
- `prevPage(vm, event, index, items)`: optional

_Search config_

- `hasSearch: boolean`: optional
- `search(vm, event, keyword, index, items)`: optional

## `Id` Mixin

In modern web framework today, the _id_ attribute of an HTML element is almost never used. But in WAI-ARIA, some `aria-*` attributes like `aria-controls`, `aria-labelledby` only accept _ID reference_ or _ID reference list_. Another problem about id is that it's always global unique. But every Vue component has its own scope. It's not easy to make sure an id not used in other Vue components.

This mixin helps you generate unique id (sometimes as an id prefix) for HTML elements in a component by default. And you can also easily specify the id manually if necessary.

### Examples

#### Generate unique id

`input.vue`:

```vue{2,3,6,7,13,15}
<template>
  <div :id="localId">
    <label ref="label" :id="`${localId}-label`">Username</label>
    <input
      ref="input"
      :id="`${localId}-input`"
      :aria-labelledby="`${localId}-label`"
    />
  </div>
</template>

<script>
import { MixinId } from "vue-a11y-utils";
export default {
  mixins: [MixinId]
};
</script>
```

In this example, the `localId` is a data member which is generated by `Id` mixin. It's globally unique so you don't need worry about that.

If you have a form with a group of inputs, it is suitable for set each input with a different auto-generated id in that way above.

#### Use id passed from parent component

Think about you should bind a clear button out of the input component above. Now you can easily set an `id` prop from parent like this:

`foo.vue`:

```vue{3,4,10,12}
<template>
  <div>
    <VueInput id="foo" />
    <button aria-controls="foo-input">Clear</button>
  </div>
</template>

<script>
import VueInput from "input.vue";
import { MixinId } from "vue-a11y-utils";
export default {
  mixins: [MixinId],
  components: { VueInput }
};
</script>
```

Now the final generated DOM tree will be:

```html
<div>
  <div id="foo">
    <label id="foo-label">Username</label>
    <input id="foo-input" aria-labelledby="foo-label" />
  </div>
  <button aria-controls="foo-input">Clear</button>
</div>
```

### API

#### Props you can use

- `id: string`

#### Values you can get

- `localId: string`

## `<VueFocusTrap>` Component

Usually, when you have a modal dialog in your Vue app, you should keep the focus always in it whatever you navigate by touch, mouse or keyboard.

`<VueFocusTrap>` gives you a easy way to wrap a modal content with trapped focus by just two events: `gofirst` and `golast`, which should bind handlers to reset the focus to the first or last focusable element in it.

But there must only be one trap in the whole Vue app, so by default the traps of all `<VueFocusTrap>` instances would be disabled by default. To control the enabled trap in one of them, you need instance methods:

- `open()`: enable the current focus trap and push the previous focus trap in an "focus stack" internally. At the same time, save the previous focused element, and then emit a `open` event.
- `replace()`: enable the current focus trap and replace the last focus trap in the "focus stack" with the current one. At the same time, save the previous focused element, and then emit a `open` event.
- `close(returnFocus)`: disable the current focus trap and enable the last focus trap in the "focus stack". Also you can determine whether auto-focus the previous focused element in that focus trap. And then emit a `open(prevTraget)` event with the previous focused element whatever you determined.

### Examples

In this example below, after you open the modal dialog by click the trigger button, the focus will always be in one of the 4 control elements in `<form>`, whatever you press <kbd>tab</kbd>, <kbd>tab</kbd> + <kbd>shift</kbd> or click somewhere out of the dialog:

```vue{7-12,18,20,29,33,42,45}
<template>
  <div>
    <button ref="trigger" @click="shown = true">
      Open a Modal Dialog
    </button>
    <form class="dialog" v-show="shown">
      <VueFocusTrap
        ref="dialog"
        @open="open"
        @gofirst="goFirst"
        @golast="goLast"
      >
        <label>Email: <input ref="email" type="email"/></label>
        <label>Password: <input ref="password" type="password"/></label>
        <button ref="login" @click="shown = false">Login</button>
        <button ref="cancel">Cancel</button>
      </VueFocusTrap>
    </form>
  </div>
</template>

<script>
import { VueFocusTrap } from "vue-a11y-utils";
export default {
  components: { VueFocusTrap },
  data() {
    return { shown: false };
  },
  watch: {
    shown(value) {
      if (value) {
        setTimeout(() => {
          const dialog = this.$refs.dialog;
          dialog.open();
        }, 50);
      } else {
        const dialog = this.$refs.dialog;
        dialog.close(true);
      }
    }
  },
  methods: {
    open() {
      this.goFirst();
    },
    goFirst() {
      this.$refs.email.focus();
    },
    goLast() {
      this.$refs.cancel.focus();
    }
  }
};
</script>
```

::: tip
Notice that for browser compatibility, please take an about >50ms timeout before focus the modal dialog after its `v-if` or `v-show` directive set truthy.
:::

### API

#### Methods

- `open()`
- `replace()`
- `close(returnFocus: boolean)`

#### Slots

- default slot: the content you would trap focus in.

#### Events

- `open(prevTarget: HTMLElement | null)`: when it is enabled
- `gofirst`: when you should manually set focus to the first focusable element
- `golast`: when you should manually set focus to the last focusable element

## `Shortcuts` Mixin

In an app we may need some keyboard shortcuts to do operations more effectively. Fortunately we have a `Shortcuts` mixin.

### Examples

In this example, this component will listen shortcut <kbd>CMD</kbd> + <kbd>G</kbd> globally:

```vue{4,6,7-15}
<template>...</template>

<script>
import { MixinShortcuts } from "vue-a11y-utils";
export default {
  mixins: [MixinShortcuts],
  $shortcuts: [
    {
      key: "G",
      modifiers: { meta: true },
      handle(event) {
        alert("trigger: CMD + G");
      }
    }
  ]
};
</script>
```

Another way to config <kbd>CMD</kbd> + <kbd>K</kbd>, <kbd>CMD</kbd> + <kbd>B</kbd> as a `keys` sequence:

```vue{9-12}
<template>...</template>

<script>
import { MixinShortcuts } from "vue-a11y-utils";
export default {
  mixins: [MixinShortcuts],
  $shortcuts: [
    {
      keys: [
        { key: "K", modifiers: { meta: true } },
        { key: "B", modifiers: { meta: true } }
      ],
      handle(event) {
        alert("trigger: CMD + K, B");
      }
    }
  ]
};
</script>
```

You can also quickly config each key in `keys` as a string if there is no modifiers to declare:

```vue{9}
<template>...</template>

<script>
import { MixinShortcuts } from "vue-a11y-utils";
export default {
  mixins: [MixinShortcuts],
  shortcuts: [
    {
      keys: ["a", "s", "d", "f"],
      handle(event) {
        alert("trigger: A-S-D-F");
      }
    }
  ]
};
</script>
```

At last, if you would like to bind key shortcuts on a certain element, for example an input text box, we also supports named shortcuts config like below:

```vue{5,9,18-45}
<template>
  <div>
    <input type="text" value="CMD + G" @keydown="bindShortcut($event, 'foo')" />
    <input type="text" value="CMD + K" @keydown="bindShortcut($event, 'bar')" />
  </div>
</template>

<script>
import { MixinShortcuts } from "vue-a11y-utils";
export default {
  mixins: [MixinShortcuts],
  $shortcuts: {
    foo: [
      {
        key: "g",
        modifiers: { meta: true },
        handle(event) {
          alert("trigger: CMD + G");
        }
      }
    ],
    bar: [
      {
        key: "k",
        modifiers: { meta: true },
        handle(event) {
          alert("trigger: CMD + K");
        }
      }
    ],
    default: [
      {
        keys: ["a", "s", "d", "f"],
        handle(event) {
          alert("trigger: A-S-D-F");
        }
      }
    ]
  }
};
</script>
```

And the `default` shortcuts config is still globally avaliable.

### API

#### New option you can declare

- `$shortcuts: Array<ShortcutConfig>`
- `$shortcuts: Record<string, ShortcutConfig>`
- `$shortcuts: Record<string, Array<ShortcutConfig>>`

  The interface `ShortcutConfig` is like:

  ```ts
  {
    key: string, // we will introduce later
    modifiers: {
      ctrl?: boolean,
      shift?: boolean,
      alt?: boolean, // you can also use `option`
      meta?: boolean // you can also use `cmd` or `window`
    },
    handle(event: KeyboardEvent)
  } |
  {
    keys[
      {
        key: string,
        modifiers: {
          ctrl?: boolean,
          shift?: boolean,
          alt?: boolean, // you can also use `option`
          meta?: boolean // you can also use `cmd` or `window`
        }
      } |
      key: string
    ],
    handle(event: KeyboardEvent)
  }
  ```

  The `key` value in interface `ShortcutConfig` could be one of them below:

  - letter: a-z (case-insensitive)
  - number: 0-9
  - common key names: `up`, `down`, `left`, `right`, `home`, `end`, `pagedown`, `pageup` (case-insensitive)
  - any other valid [`code`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code) value in [`KeyboardEvent`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent)

### Methods you can call

- `bindShortcut(event: KeyboardEvent, name: string)`

## `<VueLive>` Component

_inspired from [react-aria-live](https://github.com/AlmeroSteyn/react-aria-live) by AlmeroSteyn_

This component is actually a wrapper which generates a invisible [WAI-ARIA live region](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions) and provides a default slot which injects some methods to announce live messages on its descendant components.

### Examples

- `App.vue`:

  ```vue{2-4,8,10}
  <template>
    <VueLive>
      <Foo />
    </VueLive>
  </template>

  <script>
  import { VueLive } from "vue-a11y-utils";
  export default {
    components: { VueLive }
  };
  </script>
  ```

- `Foo.vue`:

  ```vue{4,10}
  <template>
    <div>
      Message: <input type="text" v-model="message" />
      <button @click="announce(message)">Announce</button>
    </div>
  </template>

  <script>
  export default {
    inject: ["announce"],
    data() {
      return { message: "" };
    }
  };
  </script>
  ```

Now, if you enable VoiceOver or other a11y screen readers, there will be a live message announced when you input some text in the textbox and press the "announce" button.

The injected method `announce(message)` could announce live message to the screen reader.

But by default the live message will be announced "politely" after other voices spoken. If you want to announce the message immediately, you can pass a second parameter with a truthy value:

```vue{5}
<template>
  <div>
    Message: <input type="text" v-model="message" />
    <input type="checkbox" v-model="immediately" />: immediately
    <button @click="announce(message, immediately)">Announce</button>
  </div>
</template>

<script>
export default {
  inject: ["announce"],
  data() {
    return {
      message: "",
      immediately: false
    };
  }
};
</script>
```

### API

#### Props

- `role: string`: `"log"` by default, you can also choose other [live region roles](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions#Preferring_Specialized_Live_Region_Roles)
- `label: string`: the label of the live region

#### Slots

- default slot: the content you would wrap.

#### Provide

- `announce(message: string, immediately: boolean)`: announce message to screen reader
  - `message`: the message text would be announced
  - `immediately`: whether announce immediately or "politely"
- `isBusy(busy: boolean)` if you set it `true`, only the last message you send during that time would be announced after you set it `false` later. _(experimental, not sure screen readers support that well)_

## Further resources

- [Vue I18n](https://kazupon.github.io/vue-i18n/): the internationalization plugin for Vue.js.
- [Vue A11y](https://vue-a11y.com/): Vue.js community effort to improve web accessibility.

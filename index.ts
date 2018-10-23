import Vue, { CreateElement, VNode, VNodeData, DirectiveOptions } from 'vue';
import Component from 'vue-class-component';
export { default as VueFocusTrap } from './focus-trap.vue';

declare module 'vue/types/vue' {
  interface Vue {
    autofocus?: boolean // MixinKeyTravel
    orientation?: string // MixinKeyTravel
    [keyMethod: string]: any // MixinKeyTravel
  }
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    shortcuts?: Array<ShortcutConfig> // MixinKeyShortcuts
  }
}

interface ShortcutConfig extends KeyDescriptor {
  keys?: Array<KeyDescriptor | string>
  handle: Function
}

interface KeyDescriptor {
  key?: string
  modifiers?: KeyModifiers
}

const VueAriaProps = Vue.extend({
  props: {
    role: String,
    aria: [Object, Array],
    tabindex: Number
  }
})

/**
 * <VueAria role aria tabindex>
 * - props: role, aria, tabindex
 * - slots: default slot
 */
@Component
export class VueAria extends VueAriaProps {
  render(h: CreateElement): VNode {
    const { role, aria, tabindex } = this;
    const rootVNode = this.$slots.default[0];
    if (rootVNode) {
      if (!rootVNode.data) {
        rootVNode.data = {};
      }
      if (!rootVNode.data.attrs) {
        rootVNode.data.attrs = {};
      }
      const attrs = rootVNode.data.attrs;

      // set `role`
      if (role) {
        attrs.role = role;
      }

      // set `tabindex`
      mergeTabindexToVNode(attrs, tabindex);

      // set `aria-*`
      mergeAriaAttrsToVNode(attrs, aria);
    }
    return rootVNode;
  }
};

function mergeTabindexToVNode(attrs: VNodeData['attrs'], tabindex: number): void {
  if (attrs) {
    const isAppearance: boolean = attrs.role === 'none' || attrs.role === 'appearance';
    if (typeof tabindex !== 'number' || isNaN(tabindex)) {
      // no value passed in
      if (isAppearance) {
        attrs.tabindex = '';
      }
    } else {
      // a number passed in
      attrs.tabindex = tabindex.toString();
    }
  }
}

function mergeAriaAttrsToVNode(attrs: VNodeData['attrs'], aria: any): void {
  if (attrs) {
    const flatAria = flattenAria(aria);
    for (const name in flatAria) {
      const value = flatAria[name];
      if (isValidAttributeValue(value)) {
        attrs[`aria-${name}`] = value.toString();
      } else {
        delete attrs[`aria-${name}`];
      }
    }
  }
}

/**
 * <Foo v-aria>
 */
export const directiveAria: DirectiveOptions = {
  inserted(el: HTMLElement, { value, oldValue }) {
    mergeAriaAttrsToElement(el, value, oldValue);
  },
  update(el: HTMLElement, { value, oldValue }) {
    mergeAriaAttrsToElement(el, value, oldValue);
  }
};

function mergeAriaAttrsToElement(el: HTMLElement, aria: any, oldAria: any) {
  const flatAria = flattenAria(aria);
  const flatOldAria = flattenAria(oldAria);

  // 1. find attributes in value but not in oldValue and remove them
  for (const name in flatOldAria) {
    if (
      !isValidAttributeValue(flatAria[name]) &&
      isValidAttributeValue(flatOldAria[name])
    ) {
      el.removeAttribute(`aria-${name}`);
    }
  }

  // 2. set all attributes in value
  for (const name in flatAria) {
    const value = flatAria[name];
    if (isValidAttributeValue(value)) {
      el.setAttribute(`aria-${name}`, value.toString());
    }
  }
}

function flattenAria(aria: any): { [key: string]: any } {
  const result = {};
  if (aria) {
    if (Array.isArray(aria)) {
      aria.forEach(ariaItem => {
        Object.assign(result, ariaItem);
      });
    } else {
      Object.assign(result, aria);
    }
  }
  return result;
}

function isValidAttributeValue(value: any): boolean {
  if (typeof value === 'undefined') {
    return false;
  }
  if (value === null) {
    return false;
  }
  return true;
}

interface KeyConfig {
  [key: string]: string;
};

const defaultKeyToMethod: KeyConfig = {
  ArrowUp: 'prev',
  ArrowDown: 'next',
  ArrowLeft: 'prev',
  ArrowRight: 'next',
  Home: 'first',
  End: 'last',
  Enter: 'action',
  Space: 'action'
};

/**
 * Mixin: KeyTravel
 * - methods: keyTravel(event[, config])
 * work with:
 * - value: autofocus, orientation
 * - methods: getKeyItems()
 * could be overrided:
 * - methods: // call focus() or $el.focus() by default
 *            goPrev(), goNext(), goFirst(), goLast(),
 *            // focus first item in key items by default
 *            getAutofocusItem(),
 *            // nothing happen by default
 *            goNextPage(), goPrevPage(),
 *            // call fireAction(item) by default
 *            goAction()
 *            // call fireAction() in the item by default
 *            fireAction(item)
 */
export const MixinKeyTravel = Vue.extend({
  // fixed
  mounted(): void {
    if (this.autofocus) {
      focusItem(this.getAutofocusItem());
    }
  },
  methods: {
    // fixed
    keyTravel(event: KeyboardEvent, config?: KeyConfig): void {
      // get the current key
      const keyToMethod: KeyConfig = Object.assign(
        {},
        defaultKeyToMethod,
        this.orientation === 'vertical' ? {
          ArrowLeft: '',
          ArrowRight: ''
        } : {},
        this.orientation === 'horizontal' ? {
          ArrowUp: '',
          ArrowDown: ''
        } : {},
        config
      );
      const methodName: string = keyToMethod[event.key] || '';

      // make sure what to do next
      if (methodName) {
        const method = this[`go${capitalizeFirstLetter(methodName)}`];
        if (typeof method === 'function') {
          const willPreventDefault = method.call(this, event);
          if (willPreventDefault) {
            event.preventDefault();
          }
        }
      }
    },
    // need be overrided
    getKeyItems(): Array<Vue> {
      return [];
    },
    // could be overrided
    fireAction(item: Vue): void {
      fireItemAction(item);
    },
    // could be overrided
    getAutofocusItem(): Vue {
      return this.getKeyItems()[0];
    },
    // could be overrided
    goPrev() {
      const items = this.getKeyItems();
      const length = items.length;
      if (length === 0) {
        return;
      }
      const activeIndex = getActiveIndex(items);
      const prevItem = activeIndex <= 0 ? items[length - 1] : items[activeIndex - 1];
      return focusItem(prevItem);
    },
    // could be overrided
    goNext() {
      const items = this.getKeyItems();
      const length = items.length;
      if (length === 0) {
        return;
      }
      const activeIndex = getActiveIndex(items);
      const nextItem = activeIndex === length - 1 ? items[0] : items[activeIndex + 1];
      return focusItem(nextItem);
    },
    // could be overrided
    goFirst() {
      const items = this.getKeyItems();
      const length = items.length;
      if (length === 0) {
        return;
      }
      const firstItem = items[0];
      if (!isActiveItem(firstItem)) {
        return focusItem(firstItem);
      }
    },
    // could be overrided
    goLast() {
      const items = this.getKeyItems();
      const length = items.length;
      if (length === 0) {
        return;
      }
      const lastItem = items[length - 1];
      if (!isActiveItem(lastItem)) {
        return focusItem(lastItem);
      }
    },
    // could be overrided
    goNextPage() { },
    // could be overrided
    goPrevPage() { },
    // could be overrided
    goAction() {
      const items = this.getKeyItems();
      const length = items.length;
      if (length === 0) {
        return;
      }
      const activeIndex = getActiveIndex(items);
      const activeItem = items[activeIndex];
      return fireItemAction(activeItem);
    }
  }
});

function getActiveIndex(items: Array<Vue>): number {
  let activeIndex = -1;
  const activeElement = document.activeElement;
  items.some((item: Vue, index: number) => {
    const el = item.$el ? item.$el : item;
    if (el === activeElement) {
      activeIndex = index;
      return true;
    }
    return false;
  });
  return activeIndex;
}

function isActiveItem(item: Vue): boolean {
  if (!item) {
    return false;
  }
  const el = item.$el ? item.$el : item;
  return el === document.activeElement;
}

function focusItem(item: Vue): any {
  if (item) {
    if (typeof item.focus === 'function') {
      item.focus();
      return true;
    }
    if (item.$el && typeof item.$el.focus === 'function') {
      item.$el.focus();
      return true;
    }
  }
}

function fireItemAction(item: Vue): any {
  if (item && typeof item.fireAction === 'function') {
    item.fireAction();
    return true;
  }
}

function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const MixinIdProps = Vue.extend({
  props: {
    id: String
  }
});

/**
 * Mixin: Id
 * - prop: id
 * - data: localId
 */
@Component
export class MixinId extends MixinIdProps {
  get localId() {
    return this.id || generateNewId();
  }
}

let lastId = Date.now();

function generateNewId() {
  const now = Date.now();
  if (now === lastId) {
    lastId++;
  }
  return `v-${lastId}`;
}

@Component({
  beforeMount() {
    window.addEventListener('keydown', this.detectShortcuts);
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.detectShortcuts);
  }
})
export class MixinKeyShortcuts extends Vue {
  detectShortcuts(event: KeyboardEvent): void {
    // update global unique key seq
    const updated = updateKeySeq(event);
    // match shortcuts
    if (updated) {
      // check whether end rule matched
      const touchedEndBefore = keyEventIsEnded();
      if (!touchedEndBefore) {
        (this.$options.shortcuts || []).some((shortcut: ShortcutConfig) => {
          // match new rules in current shortcut config
          if (matchShortcut(shortcut)) {
            // do the job and make sure whether to end the matching process
            const ended = shortcut.handle(event);
            if (ended) {
              endLastKeyDown();
            }
            return keyEventIsEnded();
          }
          return false;
        })
      }
    }
  }
}

interface KeyModifiers {
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  meta?: boolean
  window?: boolean
  cmd?: boolean
  option?: boolean
}

interface KeyDown {
  [modifier: string]: boolean | string | number | Function
  name: string
  ctrl: boolean
  shift: boolean
  alt: boolean
  meta: boolean
  timestamp: number
  ended: boolean
  toString(): string
}

class KeyDown {
  constructor(name: string, modifiers: KeyModifiers = {}) {
    this.name = parseKeyName(name);
    const { ctrl, shift, alt, meta, window, cmd, option } = modifiers;
    this.ctrl = !!ctrl;
    this.shift = !!shift;
    this.alt = !!alt || !!option;
    this.meta = !!meta || !!window || !!cmd;
    this.timestamp = Date.now();
  }
  static parseEvent(event: KeyboardEvent): KeyDown | void {
    const { key, code, ctrlKey, shiftKey, altKey, metaKey } = event;
    // skip modifier key
    if (['Control', 'Shift', 'Alt', 'Meta'].indexOf(key) >= 0) {
      return;
    }
    const keyModifiers: KeyModifiers = {
      ctrl: ctrlKey,
      shift: shiftKey,
      alt: altKey,
      meta: metaKey
    }
    // number: key
    if (key.match(/^Digit\d$/)) {
      return new KeyDown(key, keyModifiers);
    }
    // alphabet: code
    if (code.match(/^Key\w$/)) {
      return new KeyDown(code, keyModifiers);
    }
    // navigation: key
    if (
      [
        'Up', 'Down', 'Left', 'Right',
        'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
        'Home', 'End', 'PageUp', 'PageDown'
      ].indexOf(key) >= 0
    ) {
      return new KeyDown(key, keyModifiers);
    }
    // other: code
    return new KeyDown(code, keyModifiers);
  }
  equals(keyDown: any) {
    if (!keyDown || typeof keyDown.toString !== 'function') {
      return false;
    }
    return this.toString() === keyDown.toString();
  }
  toString(): string {
    const { name } = this;
    const modifiers: string = ['ctrl', 'shift', 'alt', 'meta']
      .filter((modifier: string) => this[modifier]).join(',');
    return modifiers ? `${name}(${modifiers})` : name;
  }
}

function parseKeyName(name: string): string {
  if (name.match(/^[a-z]$/)) {
    return `Key${name.toUpperCase()}`;
  }
  if (name.match(/^[0-9]$/)) {
    return `Digit${name.toUpperCase()}`;
  }
  const specialNameMap: Record<string, string> = {
    up: 'ArrowUp',
    down: 'ArrowDown',
    left: 'ArrowLeft',
    right: 'ArrowRight',
    home: 'Home',
    end: 'End',
    pagedown: 'PageDown',
    pageup: 'PageUp'
  }
  const specialName = specialNameMap[name.toLowerCase()];
  if (specialName) {
    return specialName;
  }
  return capitalizeFirstLetter(name);
}

const keySeq: Array<KeyDown> = [];
const maxKeySeqLength = 32;

function updateKeySeq(event: KeyboardEvent): boolean {
  const keyDown: KeyDown | void = KeyDown.parseEvent(event);
  if (keyDown) {
    keySeq.push(keyDown);
    if (keySeq.length > maxKeySeqLength) {
      keySeq.shift();
    }
    return true;
  }
  return false;
}

function keyEventIsEnded(): boolean {
  const lastKeyDown = keySeq[keySeq.length - 1];
  return lastKeyDown ? !!lastKeyDown.ended : false;
}

function matchShortcut(shortcut: ShortcutConfig): boolean {
  const { key, keys, modifiers } = shortcut;
  const keyDownList: Array<KeyDown> = [];
  if (Array.isArray(keys)) {
    keyDownList.push(...keys.filter(descriptor =>
      descriptor && (typeof descriptor === 'string' || descriptor.key)
    ).map(
      descriptor => {
        if (typeof descriptor === 'string') {
          return new KeyDown(descriptor);
        }
        return new KeyDown(<string>descriptor.key, descriptor.modifiers)
      }
    ));
  } else if (key) {
    keyDownList.push(new KeyDown(key, modifiers));
  }
  const keyDownListLength = keyDownList.length;
  const keySeqLength = keySeq.length;
  if (!keyDownListLength) {
    return false;
  }
  for (let index = 0; index < keyDownListLength; index++) {
    if (
      !(<KeyDown>keySeq[keySeqLength - 1 - index])
        .equals(keyDownList[keyDownListLength - 1 - index])
    ) {
      return false;
    }
  }
  return true;
}

function endLastKeyDown(): void {
  const lastKeyDown = keySeq[keySeq.length - 1];
  if (lastKeyDown) {
    lastKeyDown.ended = true;
  }
}

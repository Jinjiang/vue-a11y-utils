import Vue from "vue";
import Component from "vue-class-component";

import { capitalizeFirstLetter } from "./util";

// shortcuts interface

declare module "vue/types/options" {
  interface ComponentOptions<V extends Vue> {
    $shortcuts?: ShortcutsOption;
  }
}

declare global {
  interface KeyboardEvent {
    ended: boolean;
  }
}

type ShortcutsOption =
  | Array<ShortcutConfig>
  | Record<string, Array<ShortcutConfig> | ShortcutConfig>;

interface ShortcutConfig extends KeyDescriptor {
  keys?: Array<KeyDescriptor | string>;
  handle: Function;
}

interface KeyDescriptor {
  key?: string;
  modifiers?: KeyModifiers;
}

/**
 * Mixin: KeyShortcuts
 * - option: shortcuts: Array<ShortcutConfig>
 * - methods: bindShortcut(KeyboardEvent, name)
 */
@Component({
  beforeMount() {
    if (this.$options.$shortcuts) {
      window.addEventListener(
        "keydown",
        (<MixinKeyShortcuts>this).bindShortcut
      );
    }
  },
  beforeDestroy() {
    if (this.$options.$shortcuts) {
      window.removeEventListener(
        "keydown",
        (<MixinKeyShortcuts>this).bindShortcut
      );
    }
  }
})
export default class MixinKeyShortcuts extends Vue {
  bindShortcut(event: KeyboardEvent, name: string = "default"): void {
    const target: EventTarget | null = event.currentTarget;
    if (!target) {
      return;
    }
    // update global unique key seq
    const updated = updateKeySeq(event, target);
    // match shortcuts
    if (updated) {
      // check whether end rule matched
      const touchedEndBefore = keyEventIsEnded(target, event);
      if (!touchedEndBefore) {
        const shortcuts = getShortcutsByName(this.$options.$shortcuts, name);
        shortcuts.some((shortcut: ShortcutConfig) => {
          // match new rules in current shortcut config
          if (matchShortcut(shortcut, target)) {
            // do the job and make sure whether to end the matching process
            const ended = shortcut.handle.call(this, event);
            if (ended) {
              endLastKeyDown(target, event);
            }
            return keyEventIsEnded(target, event);
          }
          return false;
        });
      }
    }
  }
}

// keydown class

interface KeyDown {
  [modifier: string]: boolean | string | number | Function;
  name: string;
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
  meta: boolean;
  timestamp: number;
  ended: boolean;
  toString(): string;
}

interface KeyModifiers {
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  window?: boolean;
  cmd?: boolean;
  option?: boolean;
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
    if (["Control", "Shift", "Alt", "Meta"].indexOf(key) >= 0) {
      return;
    }
    const keyModifiers: KeyModifiers = {
      ctrl: ctrlKey,
      shift: shiftKey,
      alt: altKey,
      meta: metaKey
    };
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
        "Up",
        "Down",
        "Left",
        "Right",
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "Home",
        "End",
        "PageUp",
        "PageDown"
      ].indexOf(key) >= 0
    ) {
      return new KeyDown(key, keyModifiers);
    }
    // other: code
    return new KeyDown(code, keyModifiers);
  }
  equals(keyDown: any) {
    if (!keyDown || typeof keyDown.toString !== "function") {
      return false;
    }
    return this.toString() === keyDown.toString();
  }
  toString(): string {
    const { name } = this;
    const modifiers: string = ["ctrl", "shift", "alt", "meta"]
      .filter((modifier: string) => this[modifier])
      .join(",");
    return modifiers ? `${name}(${modifiers})` : name;
  }
}

// keydown functions

function parseKeyName(name: string): string {
  if (name.match(/^[a-z]$/)) {
    return `Key${name.toUpperCase()}`;
  }
  if (name.match(/^[0-9]$/)) {
    return `Digit${name.toUpperCase()}`;
  }
  const specialNameMap: Record<string, string> = {
    up: "ArrowUp",
    down: "ArrowDown",
    left: "ArrowLeft",
    right: "ArrowRight",
    home: "Home",
    end: "End",
    pagedown: "PageDown",
    pageup: "PageUp"
  };
  const specialName = specialNameMap[name.toLowerCase()];
  if (specialName) {
    return specialName;
  }
  return capitalizeFirstLetter(name);
}

// key shortcuts config functions

function getShortcutsByName(
  shortcutsOption: ShortcutsOption | void,
  name: string = "default"
): Array<ShortcutConfig> {
  if (Array.isArray(shortcutsOption)) {
    if (name === "default") {
      return shortcutsOption;
    }
    return [];
  }
  if (shortcutsOption) {
    const shortcuts = shortcutsOption[name];
    if (Array.isArray(shortcuts)) {
      return shortcuts;
    } else if (shortcuts) {
      return [shortcuts];
    }
    return [];
  }
  return [];
}

// key sequence functions

const maxKeySeqLength = 32;

const keySeqMap: WeakMap<EventTarget, Array<KeyDown>> = new WeakMap();

function updateKeySeq(event: KeyboardEvent, target: EventTarget): boolean {
  const keySeq = keySeqMap.get(target) || [];
  if (!keySeqMap.has(target)) {
    keySeqMap.set(target, keySeq);
  }
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

function keyEventIsEnded(target: EventTarget, event: KeyboardEvent): boolean {
  if (event.ended) {
    return true;
  }
  const keySeq = keySeqMap.get(target) || [];
  if (!keySeqMap.has(target)) {
    keySeqMap.set(target, keySeq);
  }
  const lastKeyDown = keySeq[keySeq.length - 1];
  return lastKeyDown ? !!lastKeyDown.ended : false;
}

function matchShortcut(shortcut: ShortcutConfig, target: EventTarget): boolean {
  const keySeq = keySeqMap.get(target) || [];
  if (!keySeqMap.has(target)) {
    keySeqMap.set(target, keySeq);
  }
  const { key, keys, modifiers } = shortcut;
  const keyDownList: Array<KeyDown> = [];
  if (Array.isArray(keys)) {
    keyDownList.push(
      ...keys
        .filter(
          descriptor =>
            descriptor && (typeof descriptor === "string" || descriptor.key)
        )
        .map(descriptor => {
          if (typeof descriptor === "string") {
            return new KeyDown(descriptor);
          }
          return new KeyDown(<string>descriptor.key, descriptor.modifiers);
        })
    );
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
      !(<KeyDown>keySeq[keySeqLength - 1 - index]).equals(
        keyDownList[keyDownListLength - 1 - index]
      )
    ) {
      return false;
    }
  }
  return true;
}

function endLastKeyDown(target: EventTarget, event: KeyboardEvent): void {
  const keySeq = keySeqMap.get(target) || [];
  if (!keySeqMap.has(target)) {
    keySeqMap.set(target, keySeq);
  }
  const lastKeyDown = keySeq[keySeq.length - 1];
  if (lastKeyDown) {
    lastKeyDown.ended = true;
  }
  event.ended = true;
}

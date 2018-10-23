import Vue from 'vue';
import Component from 'vue-class-component';

import { capitalizeFirstLetter } from './util';

// shortcuts config

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    shortcuts?: Array<ShortcutConfig>
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

/**
 * Mixin: KeyShortcuts
 * - option: shortcuts: Array<ShortcutConfig>
 */
@Component({
  beforeMount() {
    if (this.$options.shortcuts) {
      window.addEventListener('keydown', this.detectShortcuts);
    }
  },
  beforeDestroy() {
    if (this.$options.shortcuts) {
      window.removeEventListener('keydown', this.detectShortcuts);
    }
  }
})
export default class MixinKeyShortcuts extends Vue {
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

// keydown class

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

interface KeyModifiers {
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  meta?: boolean
  window?: boolean
  cmd?: boolean
  option?: boolean
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

// keydown functions

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

// key sequence functions

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

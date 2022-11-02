// KeyDown events

import { nextTick, onMounted, onUnmounted } from "vue";
import { capitalizeFirstLetter } from "./util";

// TODO
declare global {
  interface KeyboardEvent {
    ended: boolean;
  }
}

type KeyDown = {
  [modifier: string]: boolean | string | number | Function;
  name: string;
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
  meta: boolean;
  timestamp: number;
  // TODO
  ended: boolean;
  toString(): string;
};

export type KeyModifiers = {
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  window?: boolean;
  cmd?: boolean;
  option?: boolean;
};

const SPECIAL_KEY_NAME_MAP: Record<string, string> = {
  up: "ArrowUp",
  down: "ArrowDown",
  left: "ArrowLeft",
  right: "ArrowRight",
  home: "Home",
  end: "End",
  pagedown: "PageDown",
  pageup: "PageUp",
};

const parseKeyName = (name: string): string => {
  if (name.match(/^[a-z]$/)) {
    return `Key${name.toUpperCase()}`;
  }
  if (name.match(/^[0-9]$/)) {
    return `Digit${name.toUpperCase()}`;
  }
  const specialName = SPECIAL_KEY_NAME_MAP[name.toLowerCase()];
  if (specialName) {
    return specialName;
  }
  return capitalizeFirstLetter(name);
};

const createKeyDown = (name: string, modifiers: KeyModifiers = {}): KeyDown => {
  const { ctrl, shift, alt, meta, window, cmd, option } = modifiers;
  return {
    name: parseKeyName(name),
    ctrl: !!ctrl,
    shift: !!shift,
    alt: !!alt || !!option,
    meta: !!meta || !!window || !!cmd,
    timestamp: Date.now(),
    ended: false,
  };
};

const parseEvent = (event: KeyboardEvent): KeyDown | undefined => {
  const { key, code, ctrlKey, shiftKey, altKey, metaKey } = event;
  // skip modifier key
  if (["Control", "Shift", "Alt", "Meta"].indexOf(key) >= 0) {
    return;
  }
  const keyModifiers: KeyModifiers = {
    ctrl: ctrlKey,
    shift: shiftKey,
    alt: altKey,
    meta: metaKey,
  };
  // number: key
  if (key.match(/^Digit\d$/)) {
    return createKeyDown(key, keyModifiers);
  }
  // alphabet: code
  if (code.match(/^Key\w$/)) {
    return createKeyDown(code, keyModifiers);
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
      "PageDown",
    ].indexOf(key) >= 0
  ) {
    return createKeyDown(key, keyModifiers);
  }
  // other: code
  return createKeyDown(code, keyModifiers);
};

const keyDownToString = (keyDown: KeyDown): string => {
  const { name } = keyDown;
  const modifiers: string = ["ctrl", "shift", "alt", "meta"]
    .filter((modifier: string) => keyDown[modifier])
    .join(",");
  return modifiers ? `${name}(${modifiers})` : name;
};

const equalsToKeyDown = (
  a: KeyDown | undefined,
  b: KeyDown | undefined
): boolean => {
  if (!a || !b) {
    return false;
  }
  return keyDownToString(a) === keyDownToString(b);
};

// Key sequence management

const MAX_KEY_SEQ_LENGTH = 32;

const keySeqMap: WeakMap<EventTarget, KeyDown[]> = new WeakMap();
const lastEventMap: WeakMap<EventTarget, KeyboardEvent> = new WeakMap();

const updateKeySeq = (event: KeyboardEvent, target: EventTarget): boolean => {
  const keyDown = parseEvent(event);
  if (!keyDown) {
    return false;
  }

  const lastEvent = lastEventMap.get(target);
  if (event === lastEvent) return true;

  nextTick(() => lastEventMap.set(target, event));

  if (!keySeqMap.has(target)) {
    keySeqMap.set(target, []);
  }
  const keySeq = keySeqMap.get(target) as KeyDown[];

  keySeq.push(keyDown);
  if (keySeq.length > MAX_KEY_SEQ_LENGTH) {
    keySeq.shift();
  }

  return true;
};

const keyEventIsEnded = (
  target: EventTarget,
  event: KeyboardEvent
): boolean => {
  // TODO
  if (event.ended) {
    return true;
  }
  if (!keySeqMap.has(target)) {
    keySeqMap.set(target, []);
  }
  const keySeq = keySeqMap.get(target) as KeyDown[];
  const lastKeyDown = keySeq[keySeq.length - 1];
  return lastKeyDown ? lastKeyDown.ended : false;
};

const endLastKeyDown = (target: EventTarget, event: KeyboardEvent): void => {
  if (!keySeqMap.has(target)) {
    keySeqMap.set(target, []);
  }
  const keySeq = keySeqMap.get(target) as KeyDown[];
  const lastKeyDown = keySeq[keySeq.length - 1];
  if (lastKeyDown) {
    lastKeyDown.ended = true;
  }
  event.ended = true;
};

// Config and hook

export type KeyDescriptor = {
  key: string;
  modifiers?: KeyModifiers;
};

export type SingleHotkeyConfig = {
  handler: Function;
} & KeyDescriptor;

export type MultipleHotkeyConfig = {
  handler: Function;
  keys: Array<KeyDescriptor | string>;
};

export type HotkeyConfig =
  | SingleHotkeyConfig
  | MultipleHotkeyConfig
  | Array<SingleHotkeyConfig | MultipleHotkeyConfig>;

const isSingleHotkeyConfig = (
  config: HotkeyConfig
): config is SingleHotkeyConfig => {
  return !config.hasOwnProperty("keys");
};

type NormalizedSingleConfig = {
  handler: Function;
  keySeq: KeyDown[];
};

type NormalizedConfig = NormalizedSingleConfig[];

const matchHotkey = (
  config: NormalizedSingleConfig,
  target: EventTarget
): boolean => {
  if (!keySeqMap.has(target)) {
    keySeqMap.set(target, []);
  }

  const currentKeySeq = keySeqMap.get(target) as KeyDown[];
  const { keySeq } = config;

  if (!keySeq.length) {
    return false;
  }

  for (let index = 0; index < keySeq.length; index++) {
    if (
      !equalsToKeyDown(
        currentKeySeq[currentKeySeq.length - 1 - index],
        keySeq[keySeq.length - 1 - index]
      )
    ) {
      return false;
    }
  }
  return true;
};

const normalizeConfig = (config: HotkeyConfig): NormalizedConfig => {
  config = Array.isArray(config) ? config : [config];
  return config.map((item) => {
    if (isSingleHotkeyConfig(item)) {
      return {
        handler: item.handler,
        keySeq: [createKeyDown(item.key, item.modifiers)],
      };
    } else {
      return {
        handler: item.handler,
        keySeq: item.keys.map((key: KeyDescriptor | string) => {
          if (typeof key === "string") {
            return createKeyDown(key);
          }
          return createKeyDown(key.key, key.modifiers);
        }),
      };
    }
  });
};

export const useHotkey = (
  config: HotkeyConfig
): ((event: KeyboardEvent) => void) => {
  const normalizedConfig = normalizeConfig(config);
  return (event: KeyboardEvent) => {
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
        normalizedConfig.some((hotkey) => {
          // match new rules in current shortcut config
          if (matchHotkey(hotkey, target)) {
            // do the job and make sure whether to end the matching process
            const ended = hotkey.handler.call(null, event);
            if (ended) {
              setTimeout(() => endLastKeyDown(target, event));
            }
            return ended;
          }
          return false;
        });
      }
    }
  };
};

export const useGlobalHotkey = (config: HotkeyConfig): void => {
  const handler = useHotkey(config);
  onMounted(() => {
    document.addEventListener("keydown", handler);
  });
  onUnmounted(() => {
    document.removeEventListener("keydown", handler);
  });
};

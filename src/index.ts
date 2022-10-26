import type { TruthyAriaValue, Aria, AriaFlat, AriaAttrs } from "./aria";
import type { Announce, SetBusy } from "./live.vue";
import type { TravelHandler, TravelConfig } from "./travel";
import type {
  KeyModifiers,
  KeyDescriptor,
  SingleHotkeyConfig,
  MultipleHotkeyConfig,
  HotkeyConfig,
} from "./hotkey";

export {
  TruthyAriaValue,
  Aria,
  AriaFlat,
  AriaAttrs,
  Announce,
  SetBusy,
  TravelHandler,
  TravelConfig,
  KeyModifiers,
  KeyDescriptor,
  SingleHotkeyConfig,
  MultipleHotkeyConfig,
  HotkeyConfig,
};

export { directiveAria, getTabindexByRole, ariaToAttrs } from "./aria";
export { default as Live, useLive } from "./live.vue";
export { default as FocusTrap } from "./focus-trap.vue";
export { genId } from "./id";
export { useTravel } from "./travel";
export { useHotkey, useGlobalHotkey } from "./hotkey";

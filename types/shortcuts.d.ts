import Vue from "vue";
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
declare type ShortcutsOption =
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
export default class MixinKeyShortcuts extends Vue {
  bindShortcut(event: KeyboardEvent, name?: string): void;
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
export {};

import Vue, { CreateElement, VNode, DirectiveOptions } from "vue";
declare const VueAriaInterface: import("vue").VueConstructor<
  {
    role: string;
    aria: any;
    tabindex: number;
  } & Vue
>;
/**
 * <VueAria role aria tabindex>
 * - props: role, aria, tabindex
 * - slots: default slot
 */
export declare class VueAria extends VueAriaInterface {
  render(h: CreateElement): VNode;
}
/**
 * <Foo v-aria>
 */
export declare const directiveAria: DirectiveOptions;
export {};

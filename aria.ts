import Vue, { CreateElement, VNode, VNodeData, DirectiveOptions } from "vue";
import Component from "vue-class-component";

const VueAriaInterface = Vue.extend({
  props: {
    role: String,
    aria: [Object, Array],
    tabindex: Number
  }
});

/**
 * <VueAria role aria tabindex>
 * - props: role, aria, tabindex
 * - slots: default slot
 */
@Component
export class VueAria extends VueAriaInterface {
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

// merging functions

function mergeTabindexToVNode(
  attrs: VNodeData["attrs"],
  tabindex: number
): void {
  if (attrs) {
    const isAppearance: boolean =
      attrs.role === "none" || attrs.role === "appearance";
    if (typeof tabindex !== "number" || isNaN(tabindex)) {
      // no value passed in
      if (isAppearance) {
        attrs.tabindex = "";
      }
    } else {
      // a number passed in
      attrs.tabindex = tabindex.toString();
    }
  }
}

function mergeAriaAttrsToVNode(attrs: VNodeData["attrs"], aria: any): void {
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

// util functions

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
  if (typeof value === "undefined") {
    return false;
  }
  if (value === null) {
    return false;
  }
  return true;
}

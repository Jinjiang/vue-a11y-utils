import Vue, { Component, VueConstructor, VNode, VNodeData } from "vue";

export const VueAria = Vue.extend({
  props: {
    role: String,
    aria: [Object, Array]
  },
  render(): VNode {
    const { role, aria } = this;
    const rootVNode = this.$slots.default[0];
    if (rootVNode) {
      if (!rootVNode.data) {
        rootVNode.data = {};
      }
      if (!rootVNode.data.attrs) {
        rootVNode.data.attrs = {};
      }
      const attrs = rootVNode.data.attrs;
      if (role) {
        attrs.role = role;
      }
      mergeAriaAttrs(attrs, aria);
    }
    return rootVNode;
  }
});

function mergeAriaAttrs(attrs: VNodeData["attrs"], aria: any): void {
  if (attrs) {
    if (Array.isArray(aria)) {
      aria.forEach(ariaItem => mergeAriaAttrs(attrs, ariaItem));
    } else if (typeof aria === "object") {
      for (const name in aria) {
        const value = aria[name];
        if (value) {
          attrs[`aria-${name}`] = value.toString();
        } else {
          delete attrs[`aria-${name}`];
        }
      }
    }
  }
}

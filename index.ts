import Vue, { CreateElement, VNode, VNodeData } from 'vue';
import Component from 'vue-class-component';

const VueAriaProps = Vue.extend({
  props: {
    role: String,
    aria: [Object, Array],
    tabindex: Number
  }
})

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
      mergeTabindex(attrs, tabindex);

      // set `aria-*`
      mergeAriaAttrs(attrs, aria);
    }
    return rootVNode;
  }
};

function mergeTabindex(attrs: VNodeData['attrs'], tabindex: number): void {
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

function mergeAriaAttrs(attrs: VNodeData['attrs'], aria: any): void {
  if (attrs) {
    if (Array.isArray(aria)) {
      aria.forEach(ariaItem => mergeAriaAttrs(attrs, ariaItem));
    } else if (typeof aria === 'object') {
      for (const name in aria) {
        const value = aria[name];
        if (value && value.toString) {
          attrs[`aria-${name}`] = value.toString();
        } else {
          attrs[`aria-${name}`] = null;
        }
      }
    }
  }
}

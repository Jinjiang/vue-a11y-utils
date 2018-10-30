<template>
  <div>
    <div tabindex="0" ref="start"></div>
    <slot></slot>
    <div tabindex="0" ref="end"></div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

const VueFocusTrapInterface = Vue.extend({
  props: {
    disabled: Boolean
  }
});

/**
 * <VueFocusTrap disabled>
 * - props: disabled
 * - events: gofirst, golast
 * - slots: default slot
 */
@Component({
  data() {
    return {
      mounted: false
    };
  },
  mounted() {
    this.mounted = true;
    document.addEventListener("focus", this.trapFocus, true);
  },
  beforeDestroy() {
    if (this.mounted) {
      document.removeEventListener("focus", this.trapFocus, true);
    }
  }
})
export default class VueFocusTrap extends VueFocusTrapInterface {
  trapFocus(event: FocusEvent) {
    if (this.disabled) {
      return;
    }
    const root = this.$el;
    const { start, end } = this.$refs;
    const { target } = event;
    if (!root.contains(<HTMLElement>target)) {
      event.preventDefault();
      this.$emit("gofirst");
    } else if (target === start) {
      event.preventDefault();
      this.$emit("golast");
    } else if (target === end) {
      event.preventDefault();
      this.$emit("gofirst");
    }
  }
}
</script>

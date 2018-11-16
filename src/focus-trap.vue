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

interface TrapInfo {
  vm: Vue;
  prevTraget: HTMLElement;
}

const trapStack: Array<TrapInfo> = [];

/**
 * <VueFocusTrap>
 * - methods: open(), replace(), close(returnFocus)
 * - events: open, gofirst, golast
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
export default class VueFocusTrap extends Vue {
  trapFocus(event: FocusEvent) {
    const trap = trapStack[trapStack.length - 1];
    if (!trap || trap.vm !== this) {
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
  open() {
    const prevTraget = <HTMLElement>document.activeElement;
    trapStack.push({ vm: this, prevTraget });
    this.$emit("open");
  }
  replace() {
    const prevTraget = <HTMLElement>document.activeElement;
    trapStack.pop();
    trapStack.push({ vm: this, prevTraget });
    this.$emit("open");
  }
  close(returnFocus: any) {
    const trap = trapStack.pop();
    if (!trap) {
      return;
    }
    const { prevTraget } = trap;
    if (returnFocus) {
      prevTraget.focus();
    }

    const lastTrap = trapStack[trapStack.length - 1];
    if (lastTrap) {
      lastTrap.vm.$emit("open", prevTraget);
    }
  }
}
</script>

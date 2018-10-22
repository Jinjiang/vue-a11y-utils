<template>
  <div>
    <div tabindex="0" ref="start"></div>
    <slot></slot>
    <div tabindex="0" ref="end"></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  mounted() {
    document.addEventListener('focus', this.trapFocus, true);
  },
  beforeDestroy() {
    document.removeEventListener('focus', this.trapFocus, true);
  },
  methods: {
    trapFocus(event: FocusEvent) {
      const root = this.$el;
      const { start, end } = this.$refs;
      const { target } = event;
      if (!root.contains(<HTMLElement>target)) {
        event.preventDefault();
        this.$emit('gofirst');
      } else if (target === start) {
        event.preventDefault();
        this.$emit('golast');
      } else if (target === end) {
        event.preventDefault();
        this.$emit('gofirst');
      }
    }
  }
});
</script>

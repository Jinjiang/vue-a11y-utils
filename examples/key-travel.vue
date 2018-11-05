<template>
  <div id="key-travel-example">
    <p>
      <button ref="btn">Auto-focus Button!</button>
    </p>
    <p>Selectable List</p>
    <p class="tip">
      Please active the list first and use <kbd>Arrow</kbd> keys
      and <kbd>Enter</kbd>/<kbd>Space</kbd> key to choose option.
      The current value is <output>{{ value }}</output>.</p>
    <ul
      class="list"
      tabindex="0"
      @keydown="keyTravel"
      @keydown.enter="goCurrentItem"
    >
      <li
        v-for="option in options"
        :key="option.value"
        ref="items"
        tabindex="-1"
        :class="{ current: option.value === value }"
      >{{ option.text }}</li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { MixinKeyTravel } from "../";

interface ExampleOption {
  text: string;
  value: string;
}

@Component({
  mixins: [MixinKeyTravel]
})
export default class ExampleKeyTravel extends Vue {
  autofocus = true;
  orientation = "vertical";

  options: Array<ExampleOption> = [
    { text: "Foo", value: "x" },
    { text: "Bar", value: "y" },
    { text: "Baz", value: "z" }
  ];
  value: string = "y";

  getAutofocusItem() {
    return this.$refs.btn;
  }
  getKeyItems() {
    return this.$refs.items;
  }
  goCurrentItem() {
    const items = <Array<HTMLElement>>this.getKeyItems();
    const index = this.options.map(option => option.value).indexOf(this.value);
    const currentItem = items[index];
    if (currentItem) {
      currentItem.focus();
    }
  }
  fireAction(item: any) {
    const items = <Array<HTMLElement>>this.getKeyItems();
    const index = items.indexOf(item);
    if (index >= 0) {
      this.value = this.options[index].value;
    }
  }
}
</script>

<style scoped>
.current {
  font-weight: bold;
}
.tip {
  padding: 0.25em 0.5em;
  background-color: InfoBackground;
}
</style>

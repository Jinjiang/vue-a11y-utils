<template>
  <div id="key-travel-example">
    <p>Selectable List</p>
    <p class="tip">
      Please active the list first and use <kbd>Arrow</kbd> keys
      and <kbd>Enter</kbd>/<kbd>Space</kbd> key to choose option.
      The current value is <output>{{ value }}</output>.</p>
    <ul
      class="list"
      tabindex="0"
      @keydown="bindTravel"
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
import { MixinTravel } from "../src/index";
import { TravelConfig } from "../src/travel";

interface ExampleOption {
  text: string;
  value: string;
}

const travelOption: TravelConfig = {
  looped: true,
  getItems(vm: Vue) {
    return <HTMLElement[]>vm.$refs.items;
  },
  getIndex(vm: Vue) {
    return vm.activeIndex;
  },
  setIndex(vm: Vue, index: number) {
    this.getItems(vm)[index].focus();
    vm.activeIndex = index;
  },
  move(vm: Vue, event: KeyboardEvent, newIndex) {
    event.preventDefault();
    this.setIndex(vm, newIndex);
  },
  action(vm: Vue, event: KeyboardEvent, index: number) {
    vm.value = vm.options[index].value;
  }
};

@Component({
  mixins: [MixinTravel],
  $travel: travelOption
})
export default class ExampleKeyTravel extends Vue {
  activeIndex: number = -1;

  options: Array<ExampleOption> = [
    { text: "Foo", value: "x" },
    { text: "Bar", value: "y" },
    { text: "Baz", value: "z" }
  ];
  value: string = "y";

  goCurrentItem() {
    const items = travelOption.getItems(this);
    const index = this.options.map(option => option.value).indexOf(this.value);
    const currentItem = items[index];
    if (currentItem) {
      currentItem.focus();
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

<template>
  <div id="key-travel-example">
    <p>Selectable List</p>
    <p class="tip">
      Please active the list first and use <kbd>Arrow</kbd> keys and
      <kbd>Enter</kbd>/<kbd>Space</kbd> key to choose option. The current value
      is <output>{{ value }}</output
      >.
    </p>
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
      >
        {{ option.text }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref } from "vue";
import { useTravel, TravelConfig } from "../src/index";

type ExampleOption = {
  text: string;
  value: string;
};

const options: Array<ExampleOption> = [
  { text: "Option 1", value: "1" },
  { text: "Option 2", value: "2" },
  { text: "Option 3", value: "3" },
  { text: "Option 4", value: "4" },
  { text: "Option 5", value: "5" },
  { text: "Option 6", value: "6" },
  { text: "Option 7", value: "7" },
  { text: "Option 8", value: "8" },
  { text: "Option 9", value: "9" },
  { text: "Option 10", value: "10" },
];

const items = ref<HTMLElement[]>([]);
const index = ref(-1);
const value = ref("");

const travelOption: TravelConfig<HTMLElement> = {
  items,
  index,
  loop: true,
  onMove: (event: KeyboardEvent, newIndex) => {
    event.preventDefault();
    index.value = newIndex;
    items.value[newIndex].focus();
  },
  onAction: (_: KeyboardEvent, index: number) => {
    value.value = options[index].value;
  },
};

const goCurrentItem = () => {
  const index = options.map((option) => option.value).indexOf(value.value);
  const currentItem = items.value[index];
  if (currentItem) {
    currentItem.focus();
  }
};

const bindTravel = useTravel(travelOption);
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

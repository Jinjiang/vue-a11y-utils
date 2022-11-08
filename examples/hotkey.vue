<template>
  <div id="key-shortcuts-example" @keydown="wrapper">
    <p>
      Press
      <input type="text" value="CMD + G HERE" @keydown="foo" />
      or
      <input type="text" value="CMD + K HERE" @keydown="bar" />
      or A-S-D-F anywhere.
    </p>
  </div>
</template>

<script setup lang="ts">
import { useHotkey, useGlobalHotkey } from "../src";

const foo = useHotkey([
  {
    key: "g",
    modifiers: { meta: true },
    handler(event) {
      alert("trigger: CMD + G (and avoid wrapper trigger)");
      // or return true;
      event.stopPropagation();
    },
  },
]);

const bar = useHotkey([
  {
    key: "k",
    modifiers: { meta: true },
    handler() {
      alert("trigger: CMD + K (and trigger wrapper later)");
    },
  },
]);

const wrapper = useHotkey([
  {
    key: "g",
    modifiers: { meta: true },
    handler() {
      alert("wrapper trigger: CMD + G");
    },
  },
  {
    key: "k",
    modifiers: { meta: true },
    handler() {
      alert("wrapper trigger: CMD + K");
    },
  },
]);

useGlobalHotkey({
  keys: ["a", "s", "d", "f"],
  handler() {
    alert("You have pressed A-S-D-F. So are you boring now?");
  },
});

useGlobalHotkey({
  key: "a",
  modifiers: { ctrl: true },
  handler() {
    alert("CTRL + A");
  },
});
</script>

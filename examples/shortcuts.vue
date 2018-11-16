<template>
  <div id="key-shortcuts-example">
    <p>
      Press <input
        type="text" value="CMD + G HERE"
        @keydown="bindShortcut($event, 'foo')"
      /> or
      <input
        type="text" value="CMD + K HERE"
        @keydown="bindShortcut($event, 'bar')"
      /> or A-S-D-F anywhere.
    </p>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { MixinShortcuts } from "../src/index";

@Component({
  mixins: [MixinShortcuts],
  $shortcuts: {
    default: {
      keys: ["a", "s", "d", "f"],
      handle() {
        alert("You have pressed A-S-D-F. So are you boring now?");
      }
    },
    foo: [
      {
        key: "g",
        modifiers: { meta: true },
        handle() {
          alert("trigger: CMD + G");
        }
      }
    ],
    bar: [
      {
        key: "k",
        modifiers: { meta: true },
        handle() {
          alert("trigger: CMD + K");
        }
      }
    ]
  }
})
export default class ExampleKeyShortcuts extends Vue {}
</script>

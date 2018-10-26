<template>
  <div id="example">
    <h1>Vue A11y Utils Examples</h1>
    <h2>VueAria Component</h2>
    <ExampleAria></ExampleAria>
    <h2>KeyTravel Mixin</h2>
    <ExampleKeyTravel></ExampleKeyTravel>
    <h2>VueFocusTrap Component</h2>
    <ExampleFocusTrap></ExampleFocusTrap>
    <h2>KeyShortcuts Mixin</h2>
    <ExampleKeyShortcuts></ExampleKeyShortcuts>
    <h2>VueLive Component</h2>
    <VueLive>
      <ExampleLive></ExampleLive>
    </VueLive>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import ExampleAria from "./aria-example.vue";
import ExampleKeyTravel from "./key-travel-example.vue";
import ExampleFocusTrap from "./focus-trap-example.vue";
import ExampleKeyShortcuts from "./key-shortcuts-example.vue";
import ExampleLive from "./live-example.vue";
import VueLive from "./live.vue";

@Component({
  components: {
    ExampleAria,
    ExampleKeyTravel,
    ExampleFocusTrap,
    ExampleKeyShortcuts,
    ExampleLive,
    VueLive
  }
})
export default class Example extends Vue {}
</script>

<template>
  <div id="app">
    <h1>Vue A11y Utils Examples</h1>
    <h2>VueAria Component</h2>
    <ExampleAria></ExampleAria>
    <h2>VueFocusTrap Component</h2>
    <ExampleFocusTrap></ExampleFocusTrap>
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
import ExampleFocusTrap from "./focus-trap-example.vue";
import ExampleLive from "./live-example.vue"
import VueLive from "./live.vue";

@Component({
  components: {
    ExampleAria,
    ExampleFocusTrap,
    ExampleLive,
    VueLive
  }
})
export default class App extends Vue {}
</script>

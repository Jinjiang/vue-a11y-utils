<template>
  <div id="app">
    <h1>Vue A11y Utils Examples</h1>
    <h2>VueAria Component</h2>
    <ExampleAria></ExampleAria>
    <h2>VueFocusTrap Component</h2>
    <ExampleFocusTrap></ExampleFocusTrap>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import ExampleAria from './aria-example.vue'
import ExampleFocusTrap from './focus-trap-example.vue'

@Component({
  components: {
    ExampleAria,
    ExampleFocusTrap
  }
})
export default class App extends Vue {}
</script>

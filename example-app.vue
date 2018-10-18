<template>
  <div id="app">
    <p>
      <button tabindex="-1">X</button>
      <button tabindex="0">X</button>
      <button tabindex>X</button>
      <button>X</button>
      <span tabindex="-1">X</span>
      <span tabindex="0">X</span>
      <span tabindex>X</span>
      <span>X</span>
    </p>
    <p>
      <VueAria role="none" :tabindex="-1">
        <button>X</button>
      </VueAria>
      <VueAria role="none">
        <button :tabindex="-1">X</button>
      </VueAria>
      <VueAria role="none">
        <span role="button" tabindex="0">X</span>
      </VueAria>
      <VueAria role="none" :tabindex="-1">
        <span role="button" tabindex="0">X</span>
      </VueAria>
    </p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { VueAria } from "./index"

@Component({ components: { VueAria } })
export default class App extends Vue {}
</script>

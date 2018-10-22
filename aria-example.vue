<template>
  <div id="aria-example">
    <p>
      <button tabindex="-1">Button can not be accessed throught TAB key</button>
      <button tabindex="0">Normal button</button>
      <button tabindex>Normal button</button>
      <button>Normal button</button>
      <span tabindex="-1">Focusable widget which can not be accessed throught TAB key</span>
      <span tabindex="0">Focusable widget</span>
      <span tabindex>Normal text</span>
      <span>Normal text</span>
    </p>
    <p>
      <VueAria role="none" :tabindex="-1">
        <button>Button can not be accessed throught TAB key</button>
      </VueAria>
      <VueAria role="none">
        <button :tabindex="-1">Button with "none" role</button>
      </VueAria>
      <VueAria role="none">
        <span role="button" tabindex="0">Normal text</span>
      </VueAria>
      <VueAria role="none" :tabindex="-1">
        <span role="button" tabindex="0">Focusable text with "none" role and can not be accessed throught TAB key</span>
      </VueAria>
    </p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { VueAria } from './index'

@Component({ components: { VueAria } })
export default class App extends Vue {}
</script>

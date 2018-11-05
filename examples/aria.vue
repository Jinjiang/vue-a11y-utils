<template>
  <div id="aria-example">
    <h3>Normal Code</h3>
    <p>
      <button tabindex="-1">Button can not be accessed throught TAB key</button><br />
      <button tabindex="0">Normal button</button><br />
      <button tabindex>Normal button</button><br />
      <button>Normal button</button><br />
      <span class="button" tabindex="-1">Focusable widget which can not be accessed throught TAB key</span><br />
      <span class="button" tabindex="0">Focusable widget</span><br />
      <span class="button" tabindex>Normal text</span><br />
      <span>Normal text</span>
    </p>
    <h3>Using VueAria Component</h3>
    <p>
      <VueAria role="none" :tabindex="-1">
        <button>Button can not be accessed throught TAB key</button>
      </VueAria><br />
      <VueAria role="none">
        <button :tabindex="-1">Button with "none" role</button>
      </VueAria><br />
      <VueAria role="none">
        <span class="button" role="button" tabindex="0">Normal text</span>
      </VueAria><br />
      <VueAria role="none" :tabindex="-1">
        <span class="button" role="button" tabindex="0">Focusable text with "none" role and can not be accessed throught TAB key</span>
      </VueAria>
    </p>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { VueAria } from "../src/index";

@Component({ components: { VueAria } })
export default class App extends Vue {}
</script>

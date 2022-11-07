<template>
  <div id="aria-example">
    <h3>Normal Code</h3>
    <p>
      <button tabindex="-1">Button can not be accessed throught TAB key</button
      ><br />
      <button tabindex="0">Normal button</button><br />
      <!-- <button tabindex>Normal button</button><br /> -->
      <button>Normal button</button><br />
      <span class="button" tabindex="-1"
        >Focusable widget which can not be accessed throught TAB key</span
      ><br />
      <span class="button" tabindex="0">Focusable widget</span><br />
      <!-- <span class="button" tabindex>Normal text</span><br /> -->
      <span>Normal text</span>
    </p>
    <h3>Using <code>ariaToAttrs(aria, role, tabindex)</code></h3>
    <p>
      <button v-bind="aria1">
        Button with "none" role can not be accessed throught TAB key</button
      ><br />
      <span class="button" v-bind="aria2">
        Normal text with "none" role can not be accessed throught TAB key </span
      ><br />
      <span class="button" v-bind="aria1">
        Focusable text with "none" role and can not be accessed throught TAB key
      </span>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ariaToAttrs } from "../src/index";
const aria1 = ariaToAttrs({}, "none", -1);
const aria2 = ariaToAttrs({}, "none", 0);
</script>

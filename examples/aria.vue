<template>
  <div id="aria-example">
    <h3>Normal Code</h3>
    <p>
      <button tabindex="-1">Button can not be accessed throught TAB key</button
      ><br />
      <button tabindex="0">Normal button (with explicit tabindex="0")</button
      ><br />
      <!-- <button tabindex>
        Normal button (with explicit empty tabindex)
      </button><br /> -->
      <button>Normal button</button><br />
      <span class="button" tabindex="-1">
        Focusable widget which can not be accessed throught TAB key </span
      ><br />
      <span class="button" tabindex="0">
        Focusable widget (with explicit tabindex="0") </span
      ><br />
      <!-- <span class="button" tabindex>
        Normal text (with explicit empty tabindex)
      </span><br /> -->
      <span> Normal text </span>
    </p>
    <h3>Using <code>ariaToAttrs(aria, role, tabindex)</code></h3>
    <p>
      <button :tabindex="getTabindexByRole(0)">Normal button</button><br />
      <button role="none" :tabindex="getTabindexByRole(0, 'none')">
        Button with "none" role should not be accessed throught TAB key</button
      ><br />
      <span class="button" v-bind="aria1">
        Focusable text with "button" role
      </span>
      <span class="button" v-bind="aria2">
        Focusable text with "button" role and tabindex="0"
      </span>
      <span class="button" v-bind="aria3">
        Focusable text with "button" role and tabindex="-1" </span
      ><br />
    </p>
    <p>
      <label>
        <input type="checkbox" v-model="roleChecked" />
        switch the role ({{ role }})
      </label>
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { ariaToAttrs, getTabindexByRole } from "../src/index";
const roleChecked = ref(true);
const role = computed(() => (roleChecked.value ? "button" : "none"));
const aria1 = ariaToAttrs({}, "button", 0);
const aria2 = computed(() => ariaToAttrs({}, role.value, 0));
const aria3 = computed(() => ariaToAttrs({}, role.value, -1));
</script>

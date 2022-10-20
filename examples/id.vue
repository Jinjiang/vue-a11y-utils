<template>
  <div id="id-example">
    <h3>Using Explicit ID</h3>
    <ExampleIdInput id="foo"></ExampleIdInput>
    <button aria-controls="foo-input">Clear</button>
    <h3>Using implicit ID</h3>
    <ExampleIdInput
      v-for="field in fieldList"
      :key="field.name"
      :label="field.label"
      :type="field.type"
      v-model="field.value"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { MixinId } from "../src/index";
import ExampleIdInput from "./id-input.vue";

interface ExampleFieldOption {
  label: string;
  name: string;
  type: string;
  value: string;
}

export default Vue.extend({
  data(): { fieldList: Array<ExampleFieldOption> } {
    return {
      fieldList: [
        { name: "name", label: "Name", type: "text", value: "" },
        { name: "email", label: "Email", type: "email", value: "" },
        { name: "password", label: "Password", type: "password", value: "" }
      ]
    };
  },
  mixins: [MixinId],
  components: { ExampleIdInput }
});
</script>

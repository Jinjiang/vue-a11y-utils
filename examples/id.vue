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

<script setup lang="ts">
import ExampleIdInput from "./id-input.vue";

type ExampleFieldOption = {
  label: string;
  name: string;
  type: string;
  value: string;
};

const fieldList: ExampleFieldOption[] = [
  { label: "First Name", name: "firstName", type: "text", value: "" },
  { label: "Last Name", name: "lastName", type: "text", value: "" },
  { label: "Email", name: "email", type: "email", value: "" },
  { label: "Password", name: "password", type: "password", value: "" },
  {
    label: "Confirm Password",
    name: "confirmPassword",
    type: "password",
    value: "",
  },
];
</script>

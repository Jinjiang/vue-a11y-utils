<template>
  <div :id="localId">
    <label ref="label" :id="`${localId}-label`">{{ label }}</label>
    <input
      ref="input"
      :id="`${localId}-input`"
      :aria-labelledby="`${localId}-label`"
      :type="type || 'text'"
      v-model="localValue"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { genId } from "../src/index";

const emit = defineEmits(["update:modelValue"]);
const { id, modelValue } = defineProps<{
  id?: string;
  label?: string;
  type?: string;
  modelValue?: string;
}>();

const localId = genId(id);
const localValue = ref(modelValue);

watch(localValue, (newValue) => {
  if (newValue !== modelValue) {
    emit("update:modelValue", newValue);
  }
});
</script>

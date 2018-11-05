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

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { MixinId } from "../src/index";

const ExampleIdInputInterface = Vue.extend({
  props: {
    label: String,
    type: String,
    value: String
  }
});

@Component({
  mixins: [MixinId],
  created() {
    this.localValue = this.value;
  },
  watch: {
    value(v) {
      this.localValue = v;
    },
    localValue(v) {
      if (this.value !== v) {
        this.$emit("input", v);
      }
    }
  }
})
export default class ExampleIdInput extends ExampleIdInputInterface {
  localValue: string = "";
}
</script>

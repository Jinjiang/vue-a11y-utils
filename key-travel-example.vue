<template>
  <div>
    <button ref="btn">Click!</button>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { MixinKeyTravel } from "./index";

@Component({
  mixins: [MixinKeyTravel]
})
export default class ExampleKeyTravel extends Vue {
  autofocus: boolean = true;
  getAutofocusItem() {
    return this.$refs.btn;
  }
}
</script>

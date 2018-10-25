<template>
  <div id="focus-trap-example">
    <button class="trigger" ref="trigger" @click="shown = true">
      Open a Modal Dialog
    </button>
    <div v-show="shown" class="dialog">
      <VueFocusTrap
        @gofirst="goFirst"
        @golast="goLast"
      >
        <h1>Modal Dialog</h1>
        <label>
          Email:
          <input ref="email" type="email" />
        </label>
        <label>
          Password
          <input ref="password" type="password" />
        </label>
        <button ref="login" @click="shown = false">Login</button>
        <button ref="cancel" @click="shown = false">Cancel</button>
      </VueFocusTrap>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { VueFocusTrap } from "./index";

@Component({
  components: { VueFocusTrap },
  watch: {
    shown(value) {
      if (value) {
        this.$nextTick(() => {
          this.goFirst();
        });
      } else {
        this.$nextTick(() => {
          this.goTrigger();
        });
      }
    }
  }
})
export default class ExampleVueFocusTrap extends Vue {
  shown: boolean = false;
  goFirst() {
    (<HTMLLinkElement>this.$refs.email).focus();
  }
  goLast() {
    (<HTMLLinkElement>this.$refs.cancel).focus();
  }
  goTrigger() {
    (<HTMLLinkElement>this.$refs.trigger).focus();
  }
}
</script>

<style>
.dialog {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100vw;
  height: 100vh;
  background: white;
}
</style>

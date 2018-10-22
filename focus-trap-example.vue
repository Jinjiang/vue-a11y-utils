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
        <label>
          Email:
          <input ref="email" type="email" />
        </label>
        <label>
          Password
          <input ref="password" type="password" />
        </label>
        <button ref="login" @click="shown = false">Login</button>
        <button ref="cancel">Cancel</button>
      </VueFocusTrap>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { VueFocusTrap } from './index';

export default Vue.extend({
  components: {
    VueFocusTrap
  },
  data() {
    return {
      shown: false
    };
  },
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
  },
  methods: {
    goFirst() {
      this.$refs.email.focus();
    },
    goLast() {
      this.$refs.cancel.focus();
    },
    goTrigger() {
      this.$refs.trigger.focus();
    }
  }
});
</script>

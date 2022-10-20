<template>
  <div id="live-example">
    <p>
      <label>Message: <input type="text" v-model="value"/></label>
    </p>
    <!-- <p>
      <label><input type="checkbox" v-model="busy" /> Busy</label>
    </p> -->
    <p>
      <button @click="announce(value, true)">
        Announce Immediately
      </button>
      <button @click="announce(value, false)">
        Announce Politely
      </button>
    </p>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

const LiveInjected = Vue.extend<
  {},
  {
    announce: (message: string, important: boolean) => void;
    setBusy: (busy: boolean) => void;
  },
  {}
>({});

export default LiveInjected.extend({
  data() {
    return {
      value: "",
      busy: false
    };
  },
  inject: ["announce", "setBusy"],
  watch: {
    busy(value) {
      this.setBusy(value);
    }
  }
});
</script>

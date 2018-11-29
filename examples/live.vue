<template>
  <div id="live-example">
    <p>
      <label>Message: <input type="text" v-model="value" /></label>
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
import Component from "vue-class-component";

@Component({
  inject: ["announce", "setBusy"],
  watch: {
    busy(value) {
      this.setBusy(value);
    }
  }
})
export default class VueLiveExample extends Vue {
  value: string = "";
  busy: boolean = false;
}
</script>

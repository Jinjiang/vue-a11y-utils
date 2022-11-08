<template>
  <div id="live-example">
    <p>
      <label>Message: <input type="text" v-model="value" /></label>
    </p>
    <!-- <p>
      <label><input type="checkbox" v-model="busy" /> Busy</label>
    </p> -->
    <p>
      <button @click="announce(value, true)">Announce Immediately</button>
      <button @click="announce(value, false)">Announce Politely</button>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useLive } from "../src";

const value = ref("");
const busy = ref(false);

const [announce, setBusy] = useLive();

watch(busy, setBusy);
</script>

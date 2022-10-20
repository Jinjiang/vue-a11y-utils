<template>
  <!-- https://github.com/AlmeroSteyn/react-aria-live -->
  <div>
    <slot></slot>
    <div
      style="
      position: absolute;
      height: 1px;
      width: 1px;
      margin: -1px;
      clip: rect(0 0 0 0);
      overflow: hidden
    "
    >
      <VueAria
        :role="localRole"
        :aria="{ live: 'assertive', label: localLabel, busy }"
      >
        <div>{{ assertive.alternate ? assertive.message : "" }}</div>
      </VueAria>
      <VueAria
        :role="localRole"
        :aria="{ live: 'assertive', label: localLabel, busy }"
      >
        <div>{{ !assertive.alternate ? assertive.message : "" }}</div>
      </VueAria>
      <VueAria
        :role="localRole"
        :aria="{ live: 'polite', label: localLabel, busy }"
      >
        <div>{{ polite.alternate ? polite.message : "" }}</div>
      </VueAria>
      <VueAria
        :role="localRole"
        :aria="{ live: 'polite', label: localLabel, busy }"
      >
        <div>{{ !polite.alternate ? polite.message : "" }}</div>
      </VueAria>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { VueAria } from "./aria";

interface LiveData {
  message: string;
  alternate: boolean;
}

const VueLive = Vue.extend({
  components: { VueAria },
  props: {
    role: String,
    label: String
  },
  data(): { assertive: LiveData; polite: LiveData; busy: boolean } {
    return {
      assertive: {
        message: "",
        alternate: false
      },
      polite: {
        message: "",
        alternate: false
      },
      busy: false
    };
  },
  computed: {
    localRole(): string {
      return this.role || "log";
    },
    localLabel(): string {
      return this.label;
    }
  },
  provide() {
    const self = this;
    return {
      announce(message: string, important: boolean) {
        if (important) {
          self.assertive.message = message;
          self.assertive.alternate = !self.assertive.alternate;
        } else {
          self.polite.message = message;
          self.polite.alternate = !self.polite.alternate;
        }
      },
      setBusy(busy: boolean) {
        self.busy = busy;
      }
    };
  }
});

export default VueLive;
</script>

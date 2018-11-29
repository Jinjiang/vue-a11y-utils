<template>
  <!-- https://github.com/AlmeroSteyn/react-aria-live -->
  <div>
    <slot></slot>
    <div style="
      position: absolute;
      height: 1px;
      width: 1px;
      margin: -1px;
      clip: rect(0 0 0 0);
      overflow: hidden
    ">
      <VueAria :role="localRole" :aria="{ live: 'assertive', label, busy }">
        <div>{{ assertive.alternate ? assertive.message : '' }}</div>
      </VueAria>
      <VueAria :role="localRole" :aria="{ live: 'assertive', label, busy }">
        <div>{{ !assertive.alternate ? assertive.message : '' }}</div>
      </VueAria>
      <VueAria :role="localRole" :aria="{ live: 'polite', label, busy }">
        <div>{{ polite.alternate ? polite.message : '' }}</div>
      </VueAria>
      <VueAria :role="localRole" :aria="{ live: 'polite', label, busy }">
        <div>{{ !polite.alternate ? polite.message : '' }}</div>
      </VueAria>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from "vue";
import Component from "vue-class-component";

import { VueAria } from "./aria";

const VueLiveInterface = Vue.extend({
  props: {
    role: String,
    label: String
  }
});

interface LiveData {
  message: string;
  alternate: boolean;
}

@Component({
  components: { VueAria },
  provide() {
    const self = <VueLive>this;
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
})
export default class VueLive extends VueLiveInterface {
  assertive: LiveData = {
    message: "",
    alternate: false
  };
  polite: LiveData = {
    message: "",
    alternate: false
  };
  busy: boolean = false;
  get localRole(): string {
    return this.role || "log";
  }
}
</script>

<template>
  <!-- https://github.com/AlmeroSteyn/react-aria-live -->
  <div>
    <slot></slot>
    <div class="vue-live">
      <VueAria :role="localRole" :aria="{ live: 'assertive', label, busy }">
        <div>{{ assertiveMessage }}</div>
      </VueAria>
      <VueAria :role="localRole" :aria="{ live: 'polite', label, busy }">
        <div>{{ politeMessage }}</div>
      </VueAria>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import { VueAria } from './aria';

const VueLiveInterface = Vue.extend({
  props: {
    role: String,
    label: String
  }
});

@Component({
  components: { VueAria },
  provide() {
    const self = this;
    return {
      announce(message: string, important: boolean, force: boolean) {
        if (force) {
          self.assertiveMessage = '';
          self.politeMessage = '';
        }
        setTimeout(() => {
          if (important) {
            self.assertiveMessage = message;
          } else {
            self.politeMessage = message;
          }
        }, force ? 300 : 0);
      },
      setBusy(busy: boolean) {
        self.busy = busy;
      },
      clear() {
        self.assertiveMessage = '';
        self.politeMessage = '';
      }
    }
  }
})
export default class VueLive extends VueLiveInterface {
  assertiveMessage: string = ''
  politeMessage: string = ''
  busy: boolean = false
  get localRole(): string {
    return this.role || 'log';
  }
}
</script>

<style scoped>
.vue-live {
  position: absolute;
  height: 1px;
  width: 1px;
  margin: -1px;
  clip: rect(0 0 0 0);
  overflow: hidden;
}
</style>

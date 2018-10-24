<template>
  <div>
    <VueAria :role="localRole" :aria="{ live: 'assertive', label, buzy }">
      <div>{{ assertiveMessage }}</div>
    </VueAria>
    <VueAria :role="localRole" :aria="{ live: 'polite', label, buzy }">
      <div>{{ politeMessage }}</div>
    </VueAria>
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
      announce(message: string, important: boolean) {
        if (important) {
          self.assertiveMessage = message;
        } else {
          self.politeMessage = message;
        }
      },
      setBuzy(buzy: boolean) {
        self.buzy = buzy;
      }
    }
  }
})
export default class VueLive extends VueLiveInterface {
  assertiveMessage: string = ''
  politeMessage: string = ''
  buzy: boolean = false
  get localRole(): string {
    return this.role || 'log';
  }
}
</script>

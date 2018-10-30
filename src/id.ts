import Vue from "vue";
import Component from "vue-class-component";

const MixinIdInterface = Vue.extend({
  props: {
    id: String
  }
});

/**
 * Mixin: Id
 * - prop: id
 * - data: localId
 */
@Component
export default class MixinId extends MixinIdInterface {
  get localId(): string {
    return this.id || generateNewId();
  }
}

let lastId = Date.now();

function generateNewId() {
  const now = Date.now();
  if (now <= lastId) {
    lastId++;
  } else {
    lastId = now;
  }
  return `v-${lastId}`;
}

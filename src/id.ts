import Vue from "vue";

const MixinId = Vue.extend<
  {
    id: string;
  },
  {},
  { localId: string }
>({
  computed: {
    localId(): string {
      return this.id || generateNewId();
    }
  }
});

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

export default MixinId;

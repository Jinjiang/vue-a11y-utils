<template>
  <div id="focus-trap-example">
    <p>
      <button class="trigger" ref="trigger" @click="shown = true">
        Open a Modal Dialog
      </button>
    </p>
    <div v-show="shown" class="dialog">
      <FocusTrap
        ref="dialog"
        @open="goFirst"
        @gofirst="goFirst"
        @golast="goLast"
      >
        <h1>Modal Dialog</h1>
        <label>
          Email:
          <input ref="email" type="email" />
        </label>
        <label>
          Password
          <input ref="password" type="password" />
        </label>
        <button ref="login" @click="shown = false">Login</button>
        <button ref="cancel" @click="shown = false">Cancel</button>
      </FocusTrap>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { FocusTrap } from "../src/index";

const trigger = ref<HTMLElement>();
const dialog = ref<typeof FocusTrap>();
const email = ref<HTMLInputElement>();
const password = ref<HTMLInputElement>();
const login = ref<HTMLButtonElement>();
const cancel = ref<HTMLInputElement>();

const shown = ref(false);

const goFirst = (): void => {
  email.value?.focus();
};
const goLast = (): void => {
  cancel.value?.focus();
};

onMounted(() => {
  trigger.value?.focus();
});

watch(shown, (value) => {
  if (value) {
    setTimeout(() => {
      dialog.value?.open();
    }, 100);
  } else {
    dialog.value?.close(true);
  }
});
</script>

<style scoped>
.dialog {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100vw;
  height: 100vh;
  background: white;
  opacity: 0.9;
  box-sizing: border-box;
  padding: 8em 4em;
  text-align: center;
}
</style>

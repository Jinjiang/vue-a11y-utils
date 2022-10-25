<template>
  <div ref="root">
    <div tabindex="0" ref="start"></div>
    <slot></slot>
    <div tabindex="0" ref="end"></div>
  </div>
</template>

<script lang="ts">
type TrapInfo = {
  open: () => void;
  root: HTMLElement;
  prevTarget: HTMLElement;
};
const trapStack: Array<TrapInfo> = [];
</script>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

const emit = defineEmits<{
  (event: "open", prevTarget?: HTMLElement): void;
  (event: "gofirst"): void;
  (event: "golast"): void;
}>();

const root = ref<HTMLElement>();
const start = ref<HTMLElement>();
const end = ref<HTMLElement>();

const trapFocus = (event: FocusEvent): void => {
  const trap = trapStack[trapStack.length - 1];
  if (!trap || trap.root !== root.value) {
    return;
  }
  const target = event.target as HTMLElement;
  if (!root.value?.contains(target)) {
    event.preventDefault();
    emit("gofirst");
  } else if (target === start.value) {
    event.preventDefault();
    emit("golast");
  } else if (target === end.value) {
    event.preventDefault();
    emit("gofirst");
  }
};

onMounted(() => {
  document.addEventListener("focus", trapFocus, true);
});
onUnmounted(() => {
  document.removeEventListener("focus", trapFocus, true);
});

const open = (): void => {
  const target = document.activeElement as HTMLElement;
  if (target) {
    trapStack.push({
      open: () => emit("open", target),
      root: root.value!,
      prevTarget: target,
    });
  }
  emit("open");
};
const replace = (): void => {
  const target = document.activeElement as HTMLElement;
  if (target) {
    trapStack.pop();
    trapStack.push({
      open: () => emit("open", target),
      root: root.value!,
      prevTarget: target,
    });
  }
  emit("open");
};
const close = (returnFocus: boolean): void => {
  const trap = trapStack.pop();
  if (!trap) {
    return;
  }
  const { prevTarget } = trap;
  if (returnFocus) {
    prevTarget.focus();
  }
  const lastTrap = trapStack[trapStack.length - 1];
  if (lastTrap) {
    lastTrap.open();
  }
};

defineExpose({
  open,
  replace,
  close,
});
</script>

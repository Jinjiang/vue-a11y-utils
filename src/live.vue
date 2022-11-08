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
        overflow: hidden;
      "
    >
      <div v-bind="assertiveAttrs">
        {{ assertive.alternate ? assertive.message : "" }}
      </div>
      <div v-bind="assertiveAttrs">
        {{ !assertive.alternate ? assertive.message : "" }}
      </div>
      <div v-bind="politeAttrs">
        {{ polite.alternate ? polite.message : "" }}
      </div>
      <div v-bind="politeAttrs">
        {{ !polite.alternate ? polite.message : "" }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { inject, InjectionKey } from "vue";

export type Announce = (message: string, important?: boolean) => void;
export type SetBusy = (busy: boolean) => void;

const keyAnnounce: InjectionKey<Announce> = Symbol("announce");
const keySetBusy: InjectionKey<SetBusy> = Symbol("setBusy");

const defaultAnnounce: Announce = () => {
  // do nothing
};

const defaultSetBusy: SetBusy = () => {
  // do nothing
};

export const useLive = (): [Announce, SetBusy] => {
  return [
    inject<Announce>(keyAnnounce) || defaultAnnounce,
    inject<SetBusy>(keySetBusy) || defaultSetBusy,
  ];
};
</script>

<script setup lang="ts">
import { computed, provide, reactive, ref } from "vue";
import { ariaToAttrs } from "./aria";
// import { Announce, SetBusy, keyAnnounce, keySetBusy } from "./live";

type LiveData = {
  message: string;
  alternate: boolean;
};

const { role, label } = defineProps<{
  role?: string;
  label?: string;
}>();

const assertive = reactive<LiveData>({
  message: "",
  alternate: false,
});

const polite = reactive<LiveData>({
  message: "",
  alternate: false,
});

const busy = ref(false);

const assertiveAttrs = computed(() =>
  ariaToAttrs(
    {
      live: "assertive",
      label: label,
      busy: busy.value,
    },
    role || "log"
  )
);

const politeAttrs = computed(() =>
  ariaToAttrs(
    {
      live: "polite",
      label: label,
      busy: busy.value,
    },
    role || "log"
  )
);

provide<Announce>(keyAnnounce, (message, important) => {
  const live = important ? assertive : polite;
  live.alternate = !live.alternate;
  live.message = message;
});

provide<SetBusy>(keySetBusy, (value) => {
  busy.value = value;
});
</script>

import Vue, { VueConstructor } from "vue";
declare const VueLiveInterface: VueConstructor<
  {
    role: string;
    label: string;
  } & Vue
>;
interface LiveData {
  message: string;
  alternate: boolean;
}
export default class VueLive extends VueLiveInterface {
  assertive: LiveData;
  polite: LiveData;
  busy: boolean;
  readonly localRole: string;
}
export {};

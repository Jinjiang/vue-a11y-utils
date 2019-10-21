import Vue from "vue";
declare const MixinIdInterface: import("vue").VueConstructor<
  {
    id: string;
  } & Vue
>;
/**
 * Mixin: Id
 * - prop: id
 * - data: localId
 */
export default class MixinId extends MixinIdInterface {
  readonly localId: string;
}
export {};

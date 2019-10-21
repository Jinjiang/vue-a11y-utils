import Vue from "vue";
declare module "vue/types/options" {
  interface ComponentOptions<V extends Vue> {
    $travel?: TravelOption;
  }
}
declare global {
  interface KeyboardEvent {
    ended: boolean;
  }
}
export declare type TravelOption = TravelConfig | Record<string, TravelConfig>;
export interface TravelConfig {
  orientation?: string;
  looped?: boolean;
  hasPagination?: boolean;
  hasSearch?: boolean;
  getIndex(vm: Vue): number;
  setIndex(vm: Vue, index: number): void;
  getItems(vm: Vue): Array<any>;
  move?(
    vm: Vue,
    event: KeyboardEvent,
    newIndex: number,
    oldIndex: number,
    items: Array<any>
  ): any;
  search?(
    vm: Vue,
    event: KeyboardEvent,
    keyword: string,
    index: number,
    items: Array<any>
  ): any;
  nextPage?(
    vm: Vue,
    event: KeyboardEvent,
    index: number,
    items: Array<any>
  ): any;
  prevPage?(
    vm: Vue,
    event: KeyboardEvent,
    index: number,
    items: Array<any>
  ): any;
  action?(vm: Vue, event: KeyboardEvent, index: number, items: Array<any>): any;
  enter?(vm: Vue, event: KeyboardEvent, index: number, items: Array<any>): any;
  space?(vm: Vue, event: KeyboardEvent, index: number, items: Array<any>): any;
  esc?(vm: Vue, event: KeyboardEvent, index: number, items: Array<any>): any;
}
export default class MixinTravel extends Vue {
  bindTravel(event: KeyboardEvent, name?: string): void;
}

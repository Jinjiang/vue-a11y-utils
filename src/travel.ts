import Vue from "vue";
import Component from "vue-class-component";

type NameMap = Record<string, string>;

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

export type TravelOption = TravelConfig | Record<string, TravelConfig>;

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

function getTravelConfig(
  travelOption?: TravelOption,
  name: string = "default"
): TravelConfig | void {
  if (travelOption && typeof travelOption.getItems !== "function") {
    return (<Record<string, TravelConfig>>travelOption)[name];
  }
  if (name === "default") {
    return <TravelConfig>travelOption;
  }
}

const defaultKeyToMethod: NameMap = {
  Home: "first",
  End: "last",
  Enter: "enter",
  " ": "space",
  Escape: "esc"
};

const verticalKeyToMethod: NameMap = {
  ArrowUp: "prev",
  ArrowDown: "next"
};

const horizontalKeyToMethod: NameMap = {
  ArrowLeft: "prev",
  ArrowRight: "next"
};

const paginationKeyToMethod: NameMap = {
  PageUp: "prevPage",
  PageDown: "nextPage"
};

const methodMap: Record<string, Function> = {
  prev(vm: Vue, event: KeyboardEvent, config: TravelConfig): void {
    const index = config.getIndex(vm);
    const items = config.getItems(vm);
    const length = items.length;
    if (typeof config.move === "function" && length > 0) {
      if (length === 1 && index === 0) {
        return;
      }
      let newIndex = index === -1 ? length - 1 : index - 1;
      if (config.looped && index === 0) {
        newIndex = length - 1;
      }
      config.move(vm, event, newIndex, index, items) && (event.ended = true);
    }
  },
  next(vm: Vue, event: KeyboardEvent, config: TravelConfig): void {
    const index = config.getIndex(vm);
    const items = config.getItems(vm);
    const length = items.length;
    if (typeof config.move === "function" && length > 0) {
      if (length === 1 && index === 0) {
        return;
      }
      let newIndex = index + 1;
      if (config.looped && newIndex === length) {
        newIndex = 0;
      }
      config.move(vm, event, newIndex, index, items) && (event.ended = true);
    }
  },
  first(vm: Vue, event: KeyboardEvent, config: TravelConfig): void {
    const index = config.getIndex(vm);
    const items = config.getItems(vm);
    const length = items.length;
    if (typeof config.move === "function" && length > 0 && index !== 0) {
      config.move(vm, event, 0, index, items) && (event.ended = true);
    }
  },
  last(vm: Vue, event: KeyboardEvent, config: TravelConfig): void {
    const index = config.getIndex(vm);
    const items = config.getItems(vm);
    const length = items.length;
    if (
      typeof config.move === "function" &&
      length > 0 &&
      index !== length - 1
    ) {
      config.move(vm, event, length - 1, index, items) && (event.ended = true);
    }
  },
  prevPage(vm: Vue, event: KeyboardEvent, config: TravelConfig): void {
    const index = config.getIndex(vm);
    const items = config.getItems(vm);
    const length = items.length;
    if (typeof config.prevPage === "function" && length > 0) {
      config.prevPage(vm, event, index, items) && (event.ended = true);
    }
  },
  nextPage(vm: Vue, event: KeyboardEvent, config: TravelConfig): void {
    const index = config.getIndex(vm);
    const items = config.getItems(vm);
    const length = items.length;
    if (typeof config.nextPage === "function" && length > 0) {
      config.nextPage(vm, event, index, items) && (event.ended = true);
    }
  },
  enter(vm: Vue, event: KeyboardEvent, config: TravelConfig): void {
    const index = config.getIndex(vm);
    const items = config.getItems(vm);
    const length = items.length;
    if (typeof config.action === "function" && length > 0) {
      config.action(vm, event, index, items) && (event.ended = true);
    }
    if (!event.ended && typeof config.enter === "function" && length > 0) {
      config.enter(vm, event, index, items) && (event.ended = true);
    }
  },
  space(vm: Vue, event: KeyboardEvent, config: TravelConfig): void {
    const index = config.getIndex(vm);
    const items = config.getItems(vm);
    const length = items.length;
    if (typeof config.action === "function" && length > 0) {
      config.action(vm, event, index, items) && (event.ended = true);
    }
    if (!event.ended && typeof config.space === "function" && length > 0) {
      config.space(vm, event, index, items) && (event.ended = true);
    }
  },
  esc(vm: Vue, event: KeyboardEvent, config: TravelConfig): void {
    const index = config.getIndex(vm);
    const items = config.getItems(vm);
    const length = items.length;
    if (typeof config.esc === "function" && length > 0) {
      config.esc(vm, event, index, items) && (event.ended = true);
    }
  }
};

@Component
export default class MixinTravel extends Vue {
  bindTravel(event: KeyboardEvent, name: string = "default"): void {
    const option = this.$options.$travel;
    const config = getTravelConfig(option, name);
    if (
      !config ||
      typeof config.getIndex !== "function" ||
      typeof config.setIndex !== "function" ||
      typeof config.getItems !== "function"
    ) {
      return;
    }
    if (event.ended) {
      return;
    }

    // get the current key and corresponding method
    const keyToMethod: NameMap = Object.assign(
      {},
      defaultKeyToMethod,
      config.orientation === "horizontal"
        ? horizontalKeyToMethod
        : verticalKeyToMethod,
      config.hasPagination ? paginationKeyToMethod : {}
    );
    const methodName: string = keyToMethod[event.key];

    // make sure what to do next
    const method = methodMap[methodName];
    if (typeof method === "function") {
      method(this, event, config);
    }

    // make sure whether to search
    if (config.hasSearch && typeof config.search === "function") {
      let keyword = "";
      if (event.key.match(/^Digit\d$/)) {
        keyword = event.key.substr(5);
      } else if (event.code.match(/^Key\w$/)) {
        keyword = event.code.substr(3).toLowerCase();
      }
      if (keyword) {
        config.search(
          this,
          event,
          keyword,
          config.getIndex(this),
          config.getItems(this)
        ) && (event.ended = true);
      }
    }
  }
}

import Vue from "vue";
import Component from "vue-class-component";

import { capitalizeFirstLetter } from "./util";

// key travel interface

declare module "vue/types/vue" {
  interface Vue {
    autofocus?: boolean;
    orientation?: string;
    [keyMethod: string]: any;
  }
}

type NameMap = Record<string, string>;

type Item = HTMLElement | Vue;

const defaultKeyToMethod: NameMap = {
  ArrowUp: "prev",
  ArrowDown: "next",
  ArrowLeft: "prev",
  ArrowRight: "next",
  Home: "first",
  End: "last",
  Enter: "action",
  Space: "action",
  " ": "action"
};

/**
 * Mixin: KeyTravel
 * - methods: keyTravel(event[, config])
 * work with:
 * - value: autofocus, orientation
 * - methods: getKeyItems()
 * could be overrided:
 * - methods: // call focus() or $el.focus() by default
 *            goPrev(), goNext(), goFirst(), goLast(),
 *            // focus first item in key items by default
 *            getAutofocusItem(),
 *            // nothing happen by default
 *            goNextPage(), goPrevPage(),
 *            // call fireAction(item) by default
 *            goAction()
 *            // call fireAction() in the item by default
 *            fireAction(item)
 */
@Component({
  // fixed
  mounted(): void {
    if (this.autofocus) {
      focusItem(this.getAutofocusItem());
    }
  }
})
export default class MixinKeyTravel extends Vue {
  // fixed
  keyTravel(event: KeyboardEvent, config?: NameMap): void {
    // get the current key
    const keyToMethod: NameMap = Object.assign(
      {},
      defaultKeyToMethod,
      this.orientation === "vertical"
        ? {
            ArrowLeft: "",
            ArrowRight: ""
          }
        : {},
      this.orientation === "horizontal"
        ? {
            ArrowUp: "",
            ArrowDown: ""
          }
        : {},
      config
    );
    const methodName: string = keyToMethod[event.key] || "";

    // make sure what to do next
    if (methodName) {
      const method = this[`go${capitalizeFirstLetter(methodName)}`];
      if (typeof method === "function") {
        const willPreventDefault = method.call(this, event);
        if (willPreventDefault) {
          event.preventDefault();
        }
      }
    }
  }
  // need be overrided
  getKeyItems(): Array<Item> {
    return [];
  }
  // could be overrided
  fireAction(item: Item): void {
    return fireItemAction(item);
  }
  // could be overrided
  getAutofocusItem(): Item {
    return this.getKeyItems()[0];
  }
  // could be overrided
  goPrev() {
    const items = this.getKeyItems();
    const length = items.length;
    if (length === 0) {
      return;
    }
    const activeIndex = getActiveIndex(items);
    const prevItem =
      activeIndex <= 0 ? items[length - 1] : items[activeIndex - 1];
    return focusItem(prevItem);
  }
  // could be overrided
  goNext() {
    const items = this.getKeyItems();
    const length = items.length;
    if (length === 0) {
      return;
    }
    const activeIndex = getActiveIndex(items);
    const nextItem =
      activeIndex === length - 1 ? items[0] : items[activeIndex + 1];
    return focusItem(nextItem);
  }
  // could be overrided
  goFirst() {
    const items = this.getKeyItems();
    const length = items.length;
    if (length === 0) {
      return;
    }
    const firstItem = items[0];
    if (!isActiveItem(firstItem)) {
      return focusItem(firstItem);
    }
  }
  // could be overrided
  goLast() {
    const items = this.getKeyItems();
    const length = items.length;
    if (length === 0) {
      return;
    }
    const lastItem = items[length - 1];
    if (!isActiveItem(lastItem)) {
      return focusItem(lastItem);
    }
  }
  // could be overrided
  goNextPage() {}
  // could be overrided
  goPrevPage() {}
  // could be overrided
  goAction() {
    const items = this.getKeyItems();
    const length = items.length;
    if (length === 0) {
      return;
    }
    const activeIndex = getActiveIndex(items);
    const activeItem = items[activeIndex];
    return this.fireAction(activeItem);
  }
}

// focus functions

function getActiveIndex(items: Array<Item>): number {
  let activeIndex = -1;
  const activeElement = document.activeElement;
  items.some((item: Item, index: number) => {
    const el = (<Vue>item).$el ? (<Vue>item).$el : <HTMLElement>item;
    if (el === activeElement) {
      activeIndex = index;
      return true;
    }
    return false;
  });
  return activeIndex;
}

function isActiveItem(item: Item): boolean {
  if (!item) {
    return false;
  }
  const el = (<Vue>item).$el ? (<Vue>item).$el : <HTMLElement>item;
  return el === document.activeElement;
}

function focusItem(item: Item): any {
  if (item) {
    if (typeof item.focus === "function") {
      item.focus();
      return true;
    }
    if ((<Vue>item).$el && typeof (<Vue>item).$el.focus === "function") {
      (<Vue>item).$el.focus();
      return true;
    }
  }
}

function fireItemAction(item: Item): any {
  if (item && typeof (<Vue>item).fireAction === "function") {
    (<Vue>item).fireAction();
    return true;
  }
}

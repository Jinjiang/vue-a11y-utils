import { Ref } from "vue";

export type TravelHandler = <T>(
  event: KeyboardEvent,
  rawIndex: number,
  rawItems: T[]
) => boolean | void;

export type TravelConfig<T> = {
  index: Ref<number>;
  items: Ref<T[]>;

  orientation?: string;
  looped?: boolean;

  onAction?: TravelHandler;
  onEnter?: TravelHandler;
  onSpace?: TravelHandler;
  onEsc?: TravelHandler;

  onMove?(
    event: KeyboardEvent,
    rawIndex: number,
    oldRawIndex: number,
    rawItems: T[]
  ): boolean | void;

  supportTyping?: boolean;
  onType?(
    event: KeyboardEvent,
    keyword: string,
    rawIndex: number,
    rawItems: T[]
  ): boolean | void;

  supportPagination?: boolean;
  onNextPage?: TravelHandler;
  onPrevPage?: TravelHandler;
};

type Method = <T>(event: KeyboardEvent, config: TravelConfig<T>) => void;

const getData = <T>(
  config: TravelConfig<T>
): {
  index: number;
  items: T[];
  length: number;
} => {
  const index = config.index.value;
  const items = config.items.value;
  return {
    items,
    index,
    length: items.length,
  };
};

const callOnNonEmptyItems = <T>(
  method: TravelHandler | undefined,
  event: KeyboardEvent,
  rawIndex: number,
  rawItems: T[]
): boolean | void => {
  if (method && rawItems.length) {
    return method(event, rawIndex, rawItems);
  }
  return;
};

const genMethodForSimpleCalls = (
  names: Array<keyof TravelConfig<null>>
): Method => {
  return <T>(event: KeyboardEvent, config: TravelConfig<T>): void => {
    const { index, items } = getData(config);
    names.some((key) => {
      return callOnNonEmptyItems(
        config[key as keyof TravelConfig<T>] as TravelHandler | undefined,
        event,
        index,
        items
      );
    });
  };
};

const prev = <T>(event: KeyboardEvent, config: TravelConfig<T>): void => {
  const { index, items, length } = getData(config);
  if (config.onMove && length > 0) {
    if (length === 1 && index === 0) {
      return;
    }
    let newIndex = index === -1 ? length - 1 : index - 1;
    if (config.looped && index === 0) {
      newIndex = length - 1;
    }
    config.onMove(event, newIndex, index, items);
  }
};
const next = <T>(event: KeyboardEvent, config: TravelConfig<T>): void => {
  const { index, items, length } = getData(config);
  if (config.onMove && length > 0) {
    if (length === 1 && index === 0) {
      return;
    }
    let newIndex = index + 1;
    if (config.looped && newIndex === length) {
      newIndex = 0;
    }
    config.onMove(event, newIndex, index, items);
  }
};
const first = <T>(event: KeyboardEvent, config: TravelConfig<T>): void => {
  const { index, items, length } = getData(config);
  if (config.onMove && length > 0 && index !== 0) {
    config.onMove(event, 0, index, items);
  }
};
const last = <T>(event: KeyboardEvent, config: TravelConfig<T>): void => {
  const { index, items, length } = getData(config);
  if (config.onMove && length > 0 && index !== length - 1) {
    config.onMove(event, length - 1, index, items);
  }
};
const prevPage = genMethodForSimpleCalls(["onPrevPage"]);
const nextPage = genMethodForSimpleCalls(["onNextPage"]);
const enter = genMethodForSimpleCalls(["onEnter", "onAction"]);
const space = genMethodForSimpleCalls(["onSpace", "onAction"]);
const esc = genMethodForSimpleCalls(["onEsc"]);

const search = <T>(event: KeyboardEvent, config: TravelConfig<T>): void => {
  const { index, items } = getData(config);
  let keyword = "";
  if (event.key.match(/^Digit\d$/)) {
    keyword = event.key.slice(5);
  } else if (event.code.match(/^Key\w$/)) {
    keyword = event.code.slice(3).toLowerCase();
  }
  if (config.onType && keyword) {
    config.onType(event, keyword, index, items);
  }
};

type MethodMap = Record<string, Method>;

const generalKeyToMethod: MethodMap = {
  Home: first,
  End: last,
  Enter: enter,
  " ": space,
  Escape: esc,
};

const verticalKeyToMethod: MethodMap = {
  ArrowUp: prev,
  ArrowDown: next,
};

const horizontalKeyToMethod: MethodMap = {
  ArrowLeft: prev,
  ArrowRight: next,
};

const paginationKeyToMethod: MethodMap = {
  PageUp: prevPage,
  PageDown: nextPage,
};

export const useTravel = <T>(
  config: TravelConfig<T>
): ((event: KeyboardEvent) => void) => {
  const keyToMethod: MethodMap = Object.assign(
    {},
    generalKeyToMethod,
    config.orientation === "horizontal"
      ? horizontalKeyToMethod
      : verticalKeyToMethod,
    config.supportPagination ? paginationKeyToMethod : {}
  );

  const handler = (event: KeyboardEvent): void => {
    const method = keyToMethod[event.key];
    if (method) {
      method(event, config);
    } else if (config.supportTyping) {
      search(event, config);
    }
  };

  return handler;
};

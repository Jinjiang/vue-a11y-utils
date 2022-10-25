import { Directive } from "vue";

export type TruthyAriaValue = string | number | boolean | string[];
export type Aria = AriaFlat | AriaFlat[];
export type AriaFlat = Record<string, TruthyAriaValue | undefined>;
export type AriaAttrs = Record<string, string>;

/**
 * <Foo v-aria>
 */
export const directiveAria: Directive<any, Aria> = {
  mounted(el: HTMLElement, { value, oldValue }) {
    mergeAriaAttrsToElement(el, value, oldValue || {});
  },
  updated(el: HTMLElement, { value, oldValue }) {
    mergeAriaAttrsToElement(el, value, oldValue || {});
  }
};

/**
 * Ignore tabindex for non-functional roles.
 */
export const getTabindexByRole = (
  tabindex: number | undefined,
  role?: string
): string => {
  const isAppearance: boolean = role === "none" || role === "appearance";
  if (isAppearance || typeof tabindex === "undefined" || isNaN(tabindex)) {
    return "";
  }
  return tabindex.toString();
};

/**
 * Convert aria, tabindex, and role into final attributes.
 */
export const ariaToAttrs = (
  aria: Aria,
  role?: string,
  tabindex?: number
): AriaAttrs => {
  const attrs: AriaAttrs = {};
  if (role) {
    attrs.role = role;
  }
  const tabIndexByRole = getTabindexByRole(tabindex, role);
  if (tabIndexByRole) {
    attrs.tabindex = tabIndexByRole;
  }
  const flatAria = flattenAria(aria);
  travelAria(flatAria, (name, value) => {
    attrs[name] = value;
  });
  return attrs;
};

// merging functions

const mergeAriaAttrsToElement = (
  el: HTMLElement,
  aria: Aria,
  oldAria: Aria
) => {
  const flatAria = flattenAria(aria);
  const flatOldAria = flattenAria(oldAria);

  // 1. find attributes in value but not in oldValue and remove them
  for (const name in flatOldAria) {
    if (
      !isValidAttributeValue(flatAria[name]) &&
      isValidAttributeValue(flatOldAria[name])
    ) {
      el.removeAttribute(`aria-${name}`);
    }
  }

  // 2. set all attributes in value
  travelAria(flatAria, (name, value) => {
    el.setAttribute(name, value);
  });
};

// util functions

const travelAria = (
  aria: AriaFlat,
  handler: (name: string, value: string) => void
): void => {
  for (const name in aria) {
    const value = aria[name];
    if (isValidAttributeValue(value)) {
      if (Array.isArray(value)) {
        handler(`aria-${name}`, value.join(" "));
      } else {
        handler(`aria-${name}`, value.toString());
      }
    }
  }
};

const flattenAria = (aria: Aria): AriaFlat => {
  const result = {};
  if (aria) {
    if (Array.isArray(aria)) {
      aria.forEach(ariaItem => {
        Object.assign(result, ariaItem);
      });
    } else {
      Object.assign(result, aria);
    }
  }
  return result;
};

const isValidAttributeValue = (value: any): value is TruthyAriaValue => {
  if (typeof value === "undefined") {
    return false;
  }
  if (value === null) {
    return false;
  }
  return true;
};

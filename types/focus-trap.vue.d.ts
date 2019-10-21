import Vue from "vue";
/**
 * <VueFocusTrap>
 * - methods: open(), replace(), close(returnFocus)
 * - events: open, gofirst, golast
 * - slots: default slot
 */
export default class VueFocusTrap extends Vue {
  trapFocus(event: FocusEvent): void;
  open(): void;
  replace(): void;
  close(returnFocus: any): void;
}

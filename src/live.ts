import { inject, InjectionKey } from "vue";

export type Announce = (message: string, important: boolean) => void;
export type SetBusy = (busy: boolean) => void;

export const keyAnnounce: InjectionKey<Announce> = Symbol("announce");
export const keySetBusy: InjectionKey<SetBusy> = Symbol("setBusy");

export const useLive = (): [Announce?, SetBusy?] => {
  return [inject<Announce>(keyAnnounce), inject<SetBusy>(keySetBusy)];
};

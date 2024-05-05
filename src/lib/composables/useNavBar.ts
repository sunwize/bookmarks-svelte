import { onMount } from "svelte";
import { writable } from "svelte/store";

import { Route } from "$types/routes";

type Options = {
  backUrl?: string
  isVisible?: boolean
  isBackButtonVisible?: boolean
};

const DEFAULT_BACK_URL = Route.Home;
const DEFAULT_IS_VISIBLE = true;
const DEFAULT_IS_BACK_BUTTON_VISIBLE = true;

export const backUrl = writable<string>(DEFAULT_BACK_URL);
export const isVisible = writable(true);
export const isBackButtonVisible = writable(true);

export const useNavbar = (options: Options = {}) => {
  backUrl.set(options.backUrl ?? DEFAULT_BACK_URL);
  isVisible.set(options.isVisible ?? DEFAULT_IS_VISIBLE);
  isBackButtonVisible.set(options.isBackButtonVisible ?? DEFAULT_IS_BACK_BUTTON_VISIBLE);

  onMount(() => {
    return () => {
      backUrl.set(DEFAULT_BACK_URL);
      isVisible.set(DEFAULT_IS_VISIBLE);
      isBackButtonVisible.set(DEFAULT_IS_BACK_BUTTON_VISIBLE);
    };
  });
};

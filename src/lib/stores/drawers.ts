import { writable } from "svelte/store";

import type { Metadata } from "$types/bookmark";

export const isCreationDialogVisible = writable(false);
export const isCollectionSelectorVisible = writable(false);
export const metadata = writable<Metadata | null>(null);
export const creationTab = writable<"bookmark" | "collection">("bookmark");

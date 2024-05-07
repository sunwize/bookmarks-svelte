import { onMount } from "svelte";
import { derived, writable } from "svelte/store";

const modals = writable<string[]>([]);
export const openModalCount = derived(modals, value => value.length);

export const useModal = () => {
    const uuid = crypto.randomUUID();
    const isVisible = writable(false);

    const show = () => {
        modals.update((value) => [...value, uuid]);
        isVisible.set(true);
    };
    const hide = () => {
        modals.update((value) => value.filter((id) => id !== uuid));
        isVisible.set(false);
    };

    onMount(() => {
        const unsubscribe = isVisible.subscribe((value) => {
            value ? show() : hide();
        });

        return () => {
            unsubscribe();
            hide();
        };
    });

    return {
        isVisible,
    };
};

import { tick } from "svelte";
import { derived, get, writable } from "svelte/store";

const DEFAULT_LIMIT = 20;

export const usePagination = (limit = DEFAULT_LIMIT) => {
    const page = writable(0);
    const from = writable(0);
    const to = writable(0);

    const hasNextPage = derived(page, (value) => value !== -1);

    const getPagination = () => {
        from.set(get(page) * limit);
        to.set(get(from) + limit);

        return {
            from: get(from),
            to: get(to),
        };
    };

    const nextPage = (totalResultCount: number) => {
        page.set(totalResultCount < get(to) ? -1 : get(page) + 1);
    };

    const resetPagination = async () => {
        page.set(0);
        from.set(0);
        to.set(0);
        await tick();
    };

    return {
        page,
        hasNextPage,
        getPagination,
        resetPagination,
        nextPage,
    };
};

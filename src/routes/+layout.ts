import { user } from "$lib/stores/auth";

import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ data }) => {
    const { user: _user } = data;
    user.set(_user || null);

    return {
        user,
    };
};

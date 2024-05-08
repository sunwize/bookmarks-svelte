import { redirect, type RequestEvent } from "@sveltejs/kit";

import { isAuthenticatedRoute } from "$lib/utils/auth";
import { Route } from "$types/routes";

export const load = async ({ url, locals }: RequestEvent) => {
    if (!locals.user && isAuthenticatedRoute(url.pathname as Route)) {
        throw redirect(303, Route.Login);
    }

    return {
        user: locals.user,
    };
};

import type { Handle } from "@sveltejs/kit";

import { getCookieSession } from "$lib/utils/auth";

export const handle: Handle = async ({ event, resolve }) => {
    event.locals.user = await getCookieSession(event.cookies) ?? undefined;
    return resolve(event);
};

import { redirect, type RequestHandler } from "@sveltejs/kit";

import { supabase } from "$lib/services/supabase";
import { Route } from "$types/routes";

export const GET: RequestHandler = async ({ url }) => {
    const code = url.searchParams.get("code");
    const next = url.searchParams.get("next") ?? "/";

    if (code) {
        const { error, data } = await supabase.auth.exchangeCodeForSession(code);
        console.log(data);

        if (!error) {
            throw redirect(303, `/${next.slice(1)}`);
        }
    }

    throw redirect(303, Route.Login);
};

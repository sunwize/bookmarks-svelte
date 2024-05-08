import type { Cookies } from "@sveltejs/kit";
import jsCookie from "js-cookie";

import { goto } from "$app/navigation";
import { supabase } from "$lib/services/supabase";
import { user } from "$lib/stores/auth";
import { Route } from "$types/routes";

const ACCESS_TOKEN_KEY = "access-token";
const REFRESH_TOKEN_KEY = "refresh-token";

export const onAuthStateChange = async () => {
    supabase.auth.onAuthStateChange((event, session) => {
        if (!session || event === "SIGNED_OUT") {
            jsCookie.remove(ACCESS_TOKEN_KEY, { path: "/" });
            jsCookie.remove(REFRESH_TOKEN_KEY, { path: "/" });
            user.set(null);
            goto(Route.Login);
        } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
            jsCookie.set(ACCESS_TOKEN_KEY, session.access_token, { path: "/", expires: 365, sameSite: "Lax", secure: true });
            jsCookie.set(REFRESH_TOKEN_KEY, session.refresh_token, { path: "/", expires: 365, sameSite: "Lax", secure: true });
            user.set(session.user);
        }

        if (event === "SIGNED_IN") {
            goto(Route.Home);
        }
    });
};

export const getCookieSession = async (cookies: Cookies) => {
    const refreshToken = cookies.get(REFRESH_TOKEN_KEY);
    const accessToken = cookies.get(ACCESS_TOKEN_KEY);

    if (refreshToken && accessToken) {
        const { data: { user } } = await supabase.auth.setSession({
            refresh_token: refreshToken,
            access_token: accessToken,
        });

        return user;
    } else {
        return null;
    }
};

export const isAuthenticatedRoute = (pathname: Route) => {
    return ![
        Route.Login,
    ].includes(pathname);
};

<script lang="ts">
    import { onMount } from "svelte";

    import { goto } from "$app/navigation";
    import Button from "$components/ui/Button.svelte";
    import Image from "$components/ui/Image.svelte";
    import { supabase } from "$lib/services/supabase";
    import { user } from "$lib/stores/auth";
    import { Route } from "$types/routes";

    const loginWithGoogle = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: window.origin,
            },
        });
    };

    onMount(() => {
        if ($user) {
            goto(Route.Home);
        }
    });
</script>

<div class="flex flex-col items-center pt-16">
    <Button on:click={loginWithGoogle}>
        <Image
            src="https://www.google.com/s2/favicons?domain=google.com&sz=128"
            alt="google"
            width="32"
            height="32"
        />
        <span class="text-xl">Login with Google</span>
    </Button>
</div>

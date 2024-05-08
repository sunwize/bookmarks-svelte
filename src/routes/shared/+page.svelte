<script lang="ts">
    import { onMount } from "svelte";
    import { derived } from "svelte/store";

    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { creationTab, isCreationDialogVisible } from "$lib/stores/drawers";
    import { getSharedUrl } from "$lib/utils/metadata";
    import { Route } from "$types/routes";

    const params = derived(page, (value) => Array.from(value.url.searchParams.entries()));

    onMount(() => {
        const sharedUrl = getSharedUrl();

        if (!sharedUrl) {
            goto(Route.Home, { replaceState: true });
            return;
        }

        creationTab.set("bookmark");
        isCreationDialogVisible.set(true);
    });
</script>

<ul class="mt-6">
    {#each $params as [key, value]}
        <li>{key}: {value}</li>
    {/each}
</ul>

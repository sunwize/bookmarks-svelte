<script lang="ts">
    import { onMount } from "svelte";

    import HeroiconsChevronRight20Solid from "~icons/heroicons/chevron-right-20-solid";
    import MaterialSymbolsBookmarkAddOutlineRounded from "~icons/material-symbols/bookmark-add-outline-rounded";
    import Button from "$components/ui/Button.svelte";
    import Loader from "$components/ui/Loader.svelte";
    import { useNavbar } from "$lib/composables/useNavBar";
    import { supabase } from "$lib/services/supabase";
    import { isCreationDialogVisible } from "$lib/stores/drawers";
    import { Route } from "$types/routes";
    import type { Tables } from "$types/supabase";

    let bookmarkCollections: Tables<"bookmark_lists">[] = [];
    let isLoading = true;

    useNavbar({
        isBackButtonVisible: false,
    });

    const loadBookmarkCollections = async () => {
        isLoading = true;
        const { error, data } = await supabase
            .from("bookmark_lists")
            .select()
            .order("created_at", { ascending: false });

        if (error) {
            console.error(error);
            return;
        }

        bookmarkCollections = data;
        isLoading = false;
    };

    onMount(() => {
        loadBookmarkCollections();
    });
</script>

{#if isLoading}
    <div class="flex justify-center mt-16">
        <Loader />
    </div>
{:else}
    <div class="flex-1">
        <div class="flex items-center justify-between mb-6">
            <h2 class="text-3xl font-bold">Collections</h2>
            <Button on:click={() => isCreationDialogVisible.set(true)}>
                <MaterialSymbolsBookmarkAddOutlineRounded
                    width="24"
                    height="24"
                />
            </Button>
        </div>

        <ul class="grid grid-cols-1 gap-2">
            {#each bookmarkCollections as collection}
                <li>
                    <a
                        href={`${Route.Collections}/${collection.id}`}
                        class="flex justify-between w-full text-left border-2 border-dashed border-white/20 rounded-xl px-4 py-5 transition active:bg-white/10 md:hover:bg-white/10"
                    >
                        <span class="text-2xl font-medium tracking-wide truncate">{collection.title}</span>
                        <HeroiconsChevronRight20Solid
                            width="30"
                            height="30"
                            class="opacity-80 shrink-0"
                        />
                    </a>
                </li>
            {/each}
        </ul>
    </div>
{/if}

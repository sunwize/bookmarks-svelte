<script lang="ts">
    import { onMount } from "svelte";

    import HeroiconsEllipsisVertical20Solid from "~icons/heroicons/ellipsis-vertical-20-solid";
    import HeroiconsPlusSmall from "~icons/heroicons/plus-small";
    import { page } from "$app/stores";
    import BookmarkItem from "$components/BookmarkItem.svelte";
    import Button from "$components/ui/Button.svelte";
    import Loader from "$components/ui/Loader.svelte";
    import { supabase } from "$lib/services/supabase";
    import { creationTab, isCreationDialogVisible } from "$lib/stores/drawers";
    import type { Tables } from "$types/supabase";

    let collection: Tables<"bookmark_lists"> | null = null;
    let bookmarks: Tables<"bookmarks">[] = [];
    let isLoading = false;

    const openCreationDialog = () => {
        creationTab.set("bookmark");
        isCreationDialogVisible.set(true);
    };

    const loadBookmarks = async () => {
        const { error, data } = await supabase
            .from("bookmarks")
            .select()
            .eq("list_id", $page.params.id)
            .order("created_at", { ascending: false });

        if (error) {
            console.error(error);
            return;
        }

        bookmarks = data;
    };

    const loadCollection = async () => {
        const { error, data } = await supabase
            .from("bookmark_lists")
            .select()
            .eq("id", $page.params.id)
            .single();

        if (error) {
            console.error(error);
            return;
        }

        collection = data;
    };

    const load = async () => {
        isLoading = true;
        await Promise.all([loadCollection(), loadBookmarks()]);
        isLoading = false;
    };

    onMount(() => {
        load();
    });
</script>

{#if isLoading}
    <div class="flex justify-center mt-16">
        <Loader />
    </div>
{:else if collection}
    <div class="flex items-center justify-between mb-6">
        <h2 class="text-3xl font-bold truncate">{collection.title}</h2>
        <Button class="bg-transparent text-white/50 hover:text-white">
            <HeroiconsEllipsisVertical20Solid
                width="24"
                height="24"
            />
        </Button>
    </div>

    <div class="mb-3">
        <Button on:click={openCreationDialog}>
            <HeroiconsPlusSmall />
            <span>Add a bookmark</span>
        </Button>
    </div>
    <ul class="grid grid-cols-1 gap-2">
        {#each bookmarks as bookmark}
            <li>
                <a
                    href={bookmark.url}
                    target="_blank"
                >
                    <BookmarkItem {bookmark} />
                </a>
            </li>
        {/each}
    </ul>
{/if}

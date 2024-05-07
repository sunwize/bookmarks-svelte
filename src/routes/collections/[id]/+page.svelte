<script lang="ts">
    import { onMount } from "svelte";

    import HeroiconsEllipsisVertical20Solid from "~icons/heroicons/ellipsis-vertical-20-solid";
    import HeroiconsPlusSmall from "~icons/heroicons/plus-small";
    import MaterialSymbolsDeleteOutlineRounded from "~icons/material-symbols/delete-outline-rounded";
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import BookmarkItem from "$components/BookmarkItem.svelte";
    import Button from "$components/ui/Button.svelte";
    import ConfirmDialog from "$components/ui/ConfirmDialog.svelte";
    import EmptyPlaceholder from "$components/ui/EmptyPlaceholder.svelte";
    import Loader from "$components/ui/Loader.svelte";
    import { supabase } from "$lib/services/supabase";
    import { creationTab, isCollectionEditorVisible, isCreationDialogVisible } from "$lib/stores/drawers";
    import { Route } from "$types/routes";
    import type { Tables } from "$types/supabase";

    let collection: Tables<"bookmark_lists"> | null = null;
    let bookmarks: Tables<"bookmarks">[] = [];
    let isLoading = true;
    let isDeleteDialogVisible = false;
    let isDeleting = false;

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

    const deleteCollection = async () => {
        isDeleting = true;

        const { error } = await supabase
            .from("bookmark_lists")
            .delete()
            .eq("id", $page.params.id);

        isDeleting = false;

        if (error) {
            console.error(error);
            return;
        }

        await goto(Route.Home);
    };

    onMount(() => {
        load();

        const collectionEditorSubscription = isCollectionEditorVisible.subscribe((value) => {
            if (!value) {
                load();
            }
        });

        const creationDialogSubscription = isCreationDialogVisible.subscribe((value) => {
            if (!value) {
                load();
            }
        });

        return () => {
            collectionEditorSubscription();
            creationDialogSubscription();
        };
    });
</script>

{#if isLoading}
    <div class="flex justify-center mt-16">
        <Loader />
    </div>
{:else if collection}
    <div class="flex items-center justify-between mb-6">
        <h2 class="text-3xl font-bold truncate">{collection.title}</h2>
        <Button
            on:click={() => isCollectionEditorVisible.set(true)}
            class="bg-transparent text-white/50 hover:text-white"
        >
            <HeroiconsEllipsisVertical20Solid
                width="24"
                height="24"
            />
        </Button>
    </div>

    <div class="flex items-center justify-between mb-3">
        <Button on:click={openCreationDialog}>
            <HeroiconsPlusSmall />
            <span>Add a bookmark</span>
        </Button>
        <Button
            on:click={() => isDeleteDialogVisible = true}
            class="bg-transparent border-2 border-red-400/50 text-white"
        >
            <MaterialSymbolsDeleteOutlineRounded
                width="22"
                height="22"
                class="text-red-400"
            />
        </Button>
    </div>
    {#if bookmarks.length === 0}
        <div class="py-6">
            <EmptyPlaceholder>
                <p>No bookmarks here</p>
            </EmptyPlaceholder>
        </div>
    {:else}
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
{/if}

<ConfirmDialog
    bind:visible={isDeleteDialogVisible}
    on:confirm={deleteCollection}
    loading={isDeleting}
    dangerMode={true}
>
    <p>This action cannot be undone. This will permanently delete this collection.</p>
</ConfirmDialog>

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
    import InfiniteScroll from "$components/ui/InfiniteScroll.svelte";
    import Loader from "$components/ui/Loader.svelte";
    import { usePagination } from "$lib/composables/usePagination";
    import { supabase } from "$lib/services/supabase";
    import { creationTab, isCollectionEditorVisible, isCreationDialogVisible } from "$lib/stores/drawers";
    import { Route } from "$types/routes";
    import type { Tables } from "$types/supabase";

    let collection: Tables<"bookmark_lists"> | null = null;
    let bookmarks: Tables<"bookmarks">[] = [];
    let isLoading = true;
    let isDeleteDialogVisible = false;
    let isDeleting = false;

    const {
        hasNextPage,
        getPagination,
        nextPage,
        resetPagination,
    } = usePagination();

    const openCreationDialog = () => {
        creationTab.set("bookmark");
        isCreationDialogVisible.set(true);
    };

    const loadBookmarks = async () => {
        if (!$hasNextPage) {
            return;
        }

        const { from, to } = getPagination();

        const { error, data } = await supabase
            .from("bookmarks")
            .select()
            .eq("list_id", $page.params.id)
            .order("created_at", { ascending: false })
            .range(from, to);

        if (error) {
            console.error(error);
            return;
        }

        bookmarks = [...bookmarks, ...data];
        nextPage(bookmarks.length);
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

        let _isCollectionEditorInitialized = $isCollectionEditorVisible;
        const collectionEditorSubscription = isCollectionEditorVisible.subscribe(async (value) => {
            if (!_isCollectionEditorInitialized) {
                _isCollectionEditorInitialized = true;
                return;
            }

            if (!value) {
                await resetPagination();
                bookmarks = [];
                await load();
            }
        });

        let _isCreationDialogInitialized = $isCreationDialogVisible;
        const creationDialogSubscription = isCreationDialogVisible.subscribe(async (value) => {
            if (!_isCreationDialogInitialized) {
                _isCreationDialogInitialized = true;
                return;
            }

            if (!value) {
                await resetPagination();
                bookmarks = [];
                await load();
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
        <InfiniteScroll on:bottom={() => loadBookmarks()}>
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
        </InfiniteScroll>
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

<script lang="ts">
    import { onMount } from "svelte";
    import { derived } from "svelte/store";
    import { toast } from "svelte-sonner";

    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import Button from "$components/ui/Button.svelte";
    import Drawer from "$components/ui/Drawer.svelte";
    import Input from "$components/ui/Input.svelte";
    import { supabase } from "$lib/services/supabase";
    import { creationTab, isCollectionSelectorVisible, isCreationDialogVisible, metadata } from "$lib/stores/drawers";
    import { extractMetadata, getSharedUrl } from "$lib/utils/metadata";
    import { cn } from "$lib/utils/style";
    import type { Metadata } from "$types/bookmark";
    import { Route } from "$types/routes";

    let bookmarkUrl = "";
    let collectionTitle = "";
    let isExtractingBookmark = false;
    let isCreatingCollection = false;

    const collectionId = derived(page, (value) => value.url.pathname.startsWith(Route.Collections) ? value.params.id : null);

    const saveBookmarkToCollection = async (metadata: Metadata) => {
        if (!$collectionId) {
            return;
        }

        await supabase.from("bookmarks")
            .insert({
                list_id: $collectionId,
                title: metadata.title,
                description: metadata.description,
                url: metadata.url,
                image_url: metadata.image_url,
                sitename: metadata.sitename,
                domain: metadata.domain,
            });

        toast.success("Bookmark added to collection", { position: "bottom-center" });
    };

    const extractBookmark = async (url: string) => {
        try {
            isExtractingBookmark = true;
            const _metadata = await extractMetadata(url);

            if (!_metadata) {
                return;
            }

            metadata.set(_metadata);
            isCreationDialogVisible.set(false);

            const sharedUrl = getSharedUrl();

            if (!sharedUrl && $page.url.pathname.startsWith(Route.Collections)) {
                await saveBookmarkToCollection(_metadata);
            } else {
                isCollectionSelectorVisible.set(true);
            }

            toast.success("Bookmark created successfully", { position: "bottom-center" });
        } finally {
            isExtractingBookmark = false;
        }
    };

    const saveCollection = async () => {
        try {
            isCreatingCollection = true;
            const { data: collection, error } = await supabase
                .from("bookmark_lists")
                .insert({
                    title: collectionTitle,
                })
                .select()
                .single();

            if (error) {
                console.error(error);
                return;
            }

            isCreationDialogVisible.set(false);
            await goto(`${Route.Collections}/${collection.id}`);
        } finally {
            isCreatingCollection = false;
        }
    };

    onMount(() => {
        const unsubscribe = isCreationDialogVisible.subscribe((value) => {
            if (!value) {
                bookmarkUrl = "";
                collectionTitle = "";
            }
        });

        return () => {
            unsubscribe();
        };
    });
</script>

<Drawer bind:visible={$isCreationDialogVisible}>
    <div class="grid grid-cols-2 gap-2 p-3">
        <button
            on:click={() => creationTab.set("bookmark")}
            class={cn(`
                text-center font-medium flex-1 bg-white/10 rounded-xl outline-offset-2 outline-2 px-3 py-2
                md:hover:outline
            `, { "bg-white text-black": $creationTab === "bookmark" })}
        >
            New bookmark
        </button>
        <button
            on:click={() => creationTab.set("collection")}
            class={cn(`
                text-center font-medium flex-1 bg-white/10 rounded-xl outline-offset-2 outline-2 px-3 py-2
                md:hover:outline
            `, { "bg-white text-black": $creationTab === "collection" })}
        >
            New collection
        </button>
    </div>
    <hr class="opacity-20" />
    <div class="p-3">
        {#if $creationTab === "bookmark"}
            <label
                for="bookmark-url"
                class="block font-medium mb-1"
            >
                Bookmark URL
            </label>
            <Input
                bind:value={bookmarkUrl}
                disabled={isExtractingBookmark}
                placeholder="https://..."
                id="bookmark-url"
            />
        {:else}
            <label
                for="collection-title"
                class="block font-medium mb-1"
            >
                Collection title
            </label>
            <Input
                bind:value={collectionTitle}
                disabled={isCreatingCollection}
                placeholder="eg: Date ideas"
                id="collection-title"
            />
        {/if}
    </div>
    <div class="p-3">
        {#if $creationTab === "bookmark"}
            <Button
                on:click={() => extractBookmark(bookmarkUrl)}
                loading={isExtractingBookmark}
                disabled={isExtractingBookmark || !bookmarkUrl}
                class="w-full text-xl"
            >
                Create bookmark
            </Button>
        {:else}
            <Button
                on:click={saveCollection}
                loading={isCreatingCollection}
                disabled={isCreatingCollection || !collectionTitle}
                class="w-full text-xl"
            >
                Create collection
            </Button>
        {/if}
    </div>
</Drawer>

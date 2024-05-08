<script lang="ts">
    import { onMount } from "svelte";
    import { toast } from "svelte-sonner";

    import BiPlusCircle from "~icons/bi/plus-circle";
    import HeroiconsPlusSmall from "~icons/heroicons/plus-small";
    import { goto } from "$app/navigation";
    import BookmarkItem from "$components/BookmarkItem.svelte";
    import Button from "$components/ui/Button.svelte";
    import Drawer from "$components/ui/Drawer.svelte";
    import Loader from "$components/ui/Loader.svelte";
    import { supabase } from "$lib/services/supabase";
    import { isCollectionSelectorVisible, metadata } from "$lib/stores/drawers";
    import { Route } from "$types/routes";
    import type { Tables } from "$types/supabase";

    let collections: Tables<"bookmark_lists">[] = [];
    let isLoading = false;
    let isSaving = false;

    const loadCollections = async () => {
        isLoading = true;
        const { error, data } = await supabase
            .from("bookmark_lists")
            .select()
            .order("created_at", { ascending: false });

        if (error) {
            console.error(error);
            return;
        }

        collections = data;
        isLoading = false;
    };

    const saveBookmark = async (collectionId: string) => {
        try {
            if (!$metadata) {
                return;
            }

            isSaving = true;

            await supabase.from("bookmarks")
                .insert({
                    list_id: collectionId,
                    title: $metadata.title,
                    description: $metadata.description,
                    url: $metadata.url,
                    image_url: $metadata.image_url,
                    sitename: $metadata.sitename,
                    domain: $metadata.domain,
                });

            toast.success("Bookmark added to collection");
        } finally {
            isSaving = false;
            isCollectionSelectorVisible.set(false);
            await goto(`${Route.Collections}/${collectionId}`);
        }
    };

    onMount(() => {
        const unsubscribe = isCollectionSelectorVisible.subscribe((value) => {
            if (value) {
                loadCollections();
            }
        });

        return () => {
            unsubscribe();
        };
    });
</script>

<Drawer bind:visible={$isCollectionSelectorVisible}>
    {#if isLoading}
        <div class="flex justify-center my-16">
            <Loader />
        </div>
    {:else}
        <div class="pt-3 md:pt-6 px-3 md:px-6">
            {#if $metadata}
                <div class="mb-6">
                    <BookmarkItem bookmark={$metadata} />
                </div>
            {/if}
        </div>
        <div class="border-b-2 border-white/20" />
        <ul class="grid grid-cols-1 gap-2">
            {#each collections as collection}
                <li class="border-b-2 border-white/20 px-6 py-3">
                    <div class="flex items-center justify-between">
                        <p class="text-xl md:text-2xl font-bold truncate">{collection.title}</p>
                        <button
                            on:click={() => saveBookmark(collection.id)}
                            disabled={isSaving}
                            class="text-white/60 active:text-white md:hover:text-white"
                        >
                            <BiPlusCircle
                                width="40"
                                height="40"
                            />
                        </button>
                    </div>
                </li>
            {/each}
        </ul>
    {/if}
</Drawer>

<script lang="ts">
    import { onMount } from "svelte";
    import { derived } from "svelte/store";
    import { toast } from "svelte-sonner";

    import BiDashCircle from "~icons/bi/dash-circle";
    import { page } from "$app/stores";
    import Button from "$components/ui/Button.svelte";
    import Drawer from "$components/ui/Drawer.svelte";
    import EmptyPlaceholder from "$components/ui/EmptyPlaceholder.svelte";
    import Image from "$components/ui/Image.svelte";
    import Input from "$components/ui/Input.svelte";
    import Loader from "$components/ui/Loader.svelte";
    import { supabase } from "$lib/services/supabase";
    import { isCollectionEditorVisible } from "$lib/stores/drawers";
    import type { Tables } from "$types/supabase";

    let bookmarks: Tables<"bookmarks">[] = [];
    let isLoading = true;
    let collectionTitle = "";
    let bookmarkIdsToRemove: string[] = [];
    let isSaving = false;

    $: bookmarksFiltered = bookmarks.filter((bookmark) => !bookmarkIdsToRemove.includes(bookmark.id));

    const collectionId = derived(page, (value) => value.params.id);

    const loadBookmarks = async () => {
        const { error, data } = await supabase
            .from("bookmarks")
            .select()
            .eq("list_id", $collectionId)
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
            .select("title")
            .eq("id", $collectionId)
            .single();

        if (error) {
            console.error(error);
            return;
        }

        collectionTitle = data.title;
    };

    const load = async () => {
        if (!$collectionId) {
            return;
        }

        isLoading = true;
        await Promise.all([loadCollection(), loadBookmarks()]);
        isLoading = false;
    };

    const removeBookmark = (bookmarkId: string) => {
        bookmarkIdsToRemove = [...bookmarkIdsToRemove, bookmarkId];
    };

    const updateCollectionTitle = async () => {
        const { error } = await supabase.from("bookmark_lists")
            .update({
                title: collectionTitle,
            })
            .eq("id", $collectionId);

        if (error) {
            console.error(error);
            return;
        }
    };

    const deleteBookmarks = async () => {
        const { error } = await supabase.from("bookmarks")
            .delete({ count: "estimated" })
            .in("id", bookmarkIdsToRemove);

        if (error) {
            console.error(error);
            return;
        }

        bookmarks = bookmarksFiltered;
        bookmarkIdsToRemove = [];
    };

    const saveChanges = async () => {
        isSaving = true;
        await Promise.all([updateCollectionTitle(), deleteBookmarks()]);
        isSaving = false;
        isCollectionEditorVisible.set(false);
        toast.success("Collection updated");
    };

    onMount(() => {
        const unsubscribe = isCollectionEditorVisible.subscribe((value) => {
            if (value && !$collectionId) {
                isCollectionEditorVisible.set(false);
                return;
            }

            if (!value) {
                bookmarkIdsToRemove = [];
            } else {
                load();
            }
        });

        return () => {
            unsubscribe();
        };
    });
</script>

<Drawer
    bind:visible={$isCollectionEditorVisible}
    class="h-full"
>
    {#if isLoading}
        <div class="flex justify-center my-16">
            <Loader />
        </div>
    {:else}
        <div class="sticky top-0 bg-slate-950 z-[1] flex items-center justify-between border-b border-white/40 p-3">
            <Input
                bind:value={collectionTitle}
                placeholder="Collection name"
                class="text-xl"
            />
        </div>
        {#if bookmarks.length === 0}
            <div class="py-6">
                <EmptyPlaceholder>
                    <p>No bookmarks here</p>
                </EmptyPlaceholder>
            </div>
        {:else}
            <ul>
                {#each bookmarksFiltered as bookmark}
                    <li class="flex items-center justify-between gap-3 border-b border-white/20 last-of-type:border-b-0 p-3">
                        <div class="flex items-center gap-2 md:gap-3 flex-1 truncate">
                            <Image
                                src={bookmark.image_url}
                                alt={bookmark.title}
                                class="w-[50px] md:w-[70px] h-[50px] md:h-[70px] rounded-lg object-cover shrink-0"
                            />
                            <div class="truncate flex-1">
                                <p class="text-lg md:text-xl font-medium truncate">{bookmark.title}</p>
                                <p class="opacity-50 truncate">{bookmark.description}</p>
                            </div>
                            <button
                                on:click={() => removeBookmark(bookmark.id)}
                                class="opacity-50 active:opacity-100 md:hover:opacity-100 text-3xl shrink-0">
                                <BiDashCircle
                                    width="30"
                                    height="30"
                                />
                            </button>
                        </div>
                    </li>
                {/each}
            </ul>
        {/if}
        <div class="sticky bottom-0 bg-slate-950 border-t border-white/40 p-3">
            <div class="grid grid-cols-1 gap-3">
                <Button
                    on:click={saveChanges}
                    loading={isSaving}
                    disabled={isSaving}
                    class="w-full text-xl"
                >
                    Save changes
                </Button>
            </div>
        </div>
    {/if}
</Drawer>

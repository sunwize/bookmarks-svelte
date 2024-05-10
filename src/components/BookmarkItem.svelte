<script lang="ts">
    import Image from "$components/ui/Image.svelte";
    import { supabase } from "$lib/services/supabase";
    import { extractMetadata } from "$lib/utils/metadata";
    import type { Metadata } from "$types/bookmark";

    export let bookmark: Metadata;

    const updateImage = async () => {
        const metadata = await extractMetadata(bookmark.url);

        if (!metadata) {
            return;
        }

        await supabase.from("bookmarks")
            .update({
                image_url: metadata.image_url,
            })
            .eq("image_url", bookmark.image_url);

        bookmark.image_url = metadata.image_url;
    };
</script>

<div class="flex gap-2 bg-white/10 rounded-xl transition active:bg-white/20 md:hover:bg-white/20 p-2">
    <Image
        on:error={updateImage}
        src={bookmark.image_url}
        alt={bookmark.title}
        class="w-[70px] h-[70px] rounded-lg object-cover shrink-0"
    />
    <div class="truncate">
        <p class="text-lg font-bold truncate mb-1">{bookmark.title}</p>
        <p class="text-sm opacity-80 line-clamp-2">{bookmark.description}</p>
    </div>
</div>

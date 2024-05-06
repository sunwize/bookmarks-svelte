<script lang="ts">
    import HeroiconsChevronLeft20Solid from "~icons/heroicons/chevron-left-20-solid";
    import MaterialSymbolsBookmarksOutline from "~icons/material-symbols/bookmarks-outline";
    import { backUrl, isBackButtonVisible, isVisible } from "$lib/composables/useNavBar";
</script>

{#if $isVisible}
    <nav class="sticky top-0 z-10 bg-black w-full text-2xl md:text-3xl shrink-0 max-w-app mx-auto py-3 md:py-6">
        <h1 class="flex items-center justify-center tracking-wide font-black uppercase">
            <span>Bookm</span>
            <MaterialSymbolsBookmarksOutline class="mx-[-1px] mt-[3px] w-[25px] h-[25px] md:w-[30px] md:h-[30px]" />
            <span>rks</span>
        </h1>
        {#if $isBackButtonVisible}
            <a
                href={$backUrl}
                class="absolute top-1/2 left-2 md:left-6 -translate-y-1/2">
                <HeroiconsChevronLeft20Solid
                    width="30"
                    height="30"
                />
            </a>
        {/if}
    </nav>
{/if}

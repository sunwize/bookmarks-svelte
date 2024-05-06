<script lang="ts">
    import { createEventDispatcher } from "svelte";

    import EosIconsLoading from "~icons/eos-icons/loading";
    import { cn } from "$lib/utils/style";

    type Events = {
        click: void
    }

    export let loading = false;

    const dispatch = createEventDispatcher<Events>();
</script>

<button
    on:click={() => dispatch("click")}
    {...$$restProps}
    class={cn(
        `flex items-center justify-center gap-1 bg-white text-black rounded-xl font-medium transition active:scale-95 outline-white outline-2 outline-offset-2 hover:outline px-3 py-2
        disabled:opacity-50 disabled:pointer-events-none`,
        $$restProps.class,
    )}
>
    {#if loading}
        <EosIconsLoading
            width="24"
            height="24"
        />
    {/if}
    <slot />
</button>

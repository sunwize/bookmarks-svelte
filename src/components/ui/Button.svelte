<script lang="ts">
    import { createEventDispatcher } from "svelte";

    import { cn } from "$lib/utils/style";

    type Events = {
        click: void
    }

    const dispatch = createEventDispatcher<Events>();
</script>

<button
    on:click={() => dispatch("click")}
    disabled={$$restProps.disabled}
    class={cn(
        `bg-white text-black rounded-xl font-medium transition active:scale-95 outline-white outline-2 outline-offset-2 hover:outline px-3 py-2
        disabled:opacity-50 disabled:pointer-events-none`,
        $$restProps.class,
    )}
>
    <slot />
</button>

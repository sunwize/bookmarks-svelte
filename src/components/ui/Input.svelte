<script lang="ts">
    import { cn } from "$lib/utils/style";

    export let value: string;
</script>

<input
    bind:value
    {...$$restProps}
    class={cn("block w-full bg-white/10 border-2 border-white/50 rounded-xl outline-0 px-3 py-2 focus:border-white", $$restProps.class)}
/>

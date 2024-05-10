<script lang="ts">
    import { createEventDispatcher } from "svelte";

    import CarbonImage from "~icons/carbon/image";
    import { cn } from "$lib/utils/style";

    export let src: string;
    export let alt: string;

    let isImageLoaded = false;

    const dispatch = createEventDispatcher();
</script>

<img
    {...$$restProps}
    {src}
    {alt}
    class={cn({ "hidden": !isImageLoaded }, $$restProps.class)}
    on:load={() => isImageLoaded = true}
    on:error={() => dispatch("error")}
/>
<CarbonImage
    {...$$restProps}
    class={cn({ "hidden": isImageLoaded }, "opacity-50", $$restProps.class)}
/>

<script lang="ts">
    import SolarSleepingSquareLineDuotone from "~icons/solar/sleeping-square-line-duotone";
    import { cn } from "$lib/utils/style";
</script>

<div class={cn($$restProps.class)}>
    <div class={cn("flex justify-center opacity-20 mb-8", $$restProps.iconContainerClass)}>
        <SolarSleepingSquareLineDuotone
            width="152"
            height="152"
        />
    </div>
    <p class="text-center opacity-50">
        <slot />
    </p>
</div>

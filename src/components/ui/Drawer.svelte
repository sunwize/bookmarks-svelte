<script lang="ts">
    import { Drawer as DrawerPrimitive } from "vaul-svelte";

    import { cn } from "$lib/utils/style";

    export let visible: boolean;
</script>

<DrawerPrimitive.Root
    bind:open={visible}
    shouldScaleBackground={true}
>
    <DrawerPrimitive.Portal>
        <DrawerPrimitive.Overlay class="fixed inset-0 z-50 bg-black/80" />
        <DrawerPrimitive.Content
            class={cn(
                "w-full max-w-app max-h-[100dvh] fixed inset-x-0 bottom-0 z-50 flex flex-col rounded-t-xl border bg-slate-950 mx-auto border-white/20 focus-visible:outline-0",
                $$restProps.class,
            )}
        >
            <div class="h-8 shrink-0 w-full bg-white/10 rounded-t-xl flex items-center justify-center">
                <div class="h-2 w-20 bg-white/20 rounded" />
            </div>
            <div class="overflow-y-auto">
                <slot />
            </div>
        </DrawerPrimitive.Content>
    </DrawerPrimitive.Portal>
</DrawerPrimitive.Root>

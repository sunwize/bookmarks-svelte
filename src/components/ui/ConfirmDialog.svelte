<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { fly } from "svelte/transition";

    import Button from "$components/ui/Button.svelte";
    import { useModal } from "$lib/composables/useModal";
    import { cn } from "$lib/utils/style";

    type Events = {
        confirm: void;
        cancel: void;
    };

    export let visible: boolean;
    export let loading = false;
    export let dangerMode = false;

    const { isVisible } = useModal();

    $: isVisible.set(visible);

    const dispatch = createEventDispatcher<Events>();

    const onConfirm = () => {
        dispatch("confirm");
    };

    const onCancel = () => {
        dispatch("cancel");
        visible = false;
    };
</script>

{#if visible}
    <aside class="fixed z-[2] top-0 left-0 w-full h-full flex items-center justify-center p-6">
        <button
            on:click={() => visible = false}
            class={cn("absolute top-0 left-0 w-full h-full bg-black/50 backdrop-blur", { "pointer-events-none": loading })}
        />
        <div
            transition:fly={{ duration: 300, y: 300 }}
            class="relative bg-slate-950 rounded-2xl w-full max-w-[450px] shadow-app border border-white/20 p-5"
        >
            <header class="text-xl font-bold pb-5">
                Are you sure?
            </header>
            <main class="pb-7">
                <slot />
            </main>
            <footer class="grid grid-cols-2 gap-3">
                <Button
                    on:click={onCancel}
                    class={cn("col-span-1 bg-slate-950 text-white border border-white/50 px-4 py-2", { "pointer-events-none": loading })}
                >
                    Cancel
                </Button>
                <Button
                    on:click={onConfirm}
                    {loading}
                    class={cn("col-span-1 px-4 py-2", { "pointer-events-none": loading, "bg-red-500 text-white": dangerMode })}
                >
                    Confirm
                </Button>
            </footer>
        </div>
    </aside>
{/if}

<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";

    type Events = {
        bottom: void;
    };

    const dispatch = createEventDispatcher<Events>();

    let bottomEl: HTMLDivElement;

    onMount(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    dispatch("bottom");
                }
            });
        }, {
            threshold: 0,
            rootMargin: "30%",
        });

        observer.observe(bottomEl);

        return () => {
            observer.disconnect();
        };
    });
</script>

<div>
    <slot />
    <div bind:this={bottomEl} />
</div>

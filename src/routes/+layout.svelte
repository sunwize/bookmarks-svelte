<script lang="ts">
    import "../app.css";

    import Navbar from "$components/ui/Navbar.svelte";
</script>

<Navbar />
<main class="relative flex flex-col w-full flex-1 bg-white/10 text-white max-w-app mx-auto py-3 px-2 md:p-6">
    <slot />
</main>

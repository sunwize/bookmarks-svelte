<script lang="ts">
    import "../app.css";

    import CollectionEditor from "$components/drawers/CollectionEditor.svelte";
    import CollectionSelector from "$components/drawers/CollectionSelector.svelte";
    import CreationDialog from "$components/drawers/CreationDialog.svelte";
    import Navbar from "$components/ui/Navbar.svelte";
    import Toaster from "$components/ui/Toaster.svelte";
</script>

<Navbar />
<main class="relative flex flex-col w-full flex-1 bg-white/10 max-w-app mx-auto py-3 px-2 md:p-6">
    <slot />
</main>
<CreationDialog />
<CollectionSelector />
<CollectionEditor />

<Toaster />

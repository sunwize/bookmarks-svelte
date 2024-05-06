<script lang="ts">
    export let value: string;
</script>

<input
    bind:value
    class="block w-full bg-white/10 border-2 border-white/50 rounded-xl outline-0 px-3 py-2 focus:border-white"
    {...$$restProps}
/>

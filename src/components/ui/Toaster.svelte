<script lang="ts">
    import { Toaster as Sonner } from "svelte-sonner";
</script>

<Sonner
    theme="dark"
    position="bottom-center"
    toastOptions={{
        classes: {
            toast: "shadow bg-slate-800 border-2 rounded-2xl",
            success: "border-green-400",
            info: "border-blue-400",
            warning: "border-yellow-400",
            error: "border-red-400",
            description: "",
            actionButton: "",
            cancelButton: "",
        },
    }}
    {...$$restProps}
/>

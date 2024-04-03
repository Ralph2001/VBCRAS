<template>
    <div>
        <button
            type="button"
            :class="{
                'bg-green-500 hover:bg-green-600 focus:ring-green-300':
                    isFolder,
                'bg-blue-700 hover:bg-blue-800 focus:ring-blue-300': !isFolder,
            }"
            class="px-3 py-2 text-xs font-medium text-center text-white rounded focus:ring-1 focus:outline-none"
        >
            {{ label }}
        </button>
    </div>
</template>

<script setup>
const props = defineProps({
    label: {
        type: String,
        required: true,
    },
    isFolder: {
        type: Boolean,
        default: false,
    },
});
</script>

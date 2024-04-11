<template>
    <div>
        <button
            type="button"
            :class="{
                'bg-green-400 text-white hover:bg-green-500 hover:shadow-md tracking-wider focus:ring-green-300':
                    isFolder,
                'bg-white text-gray-900 border hover:text-blue-600 hover:shadow-sm tracking-widest border-gray-200 hover:bg-gray-100 focus:ring-blue-300':
                    !isFolder,
            }"
            class="px-2.5 py-1.5 text-xs font-medium text-center rounded focus:ring-1 focus:outline-none active:scale-90 transition-all"
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
})
</script>

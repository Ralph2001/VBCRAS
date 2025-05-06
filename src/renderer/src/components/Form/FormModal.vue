<template>
    <div class="fixed inset-0 bg-white z-50 flex flex-col h-screen shadow-2xl">
        <!-- Header / Toolbar -->
        <div class="p-4 border-b flex items-center justify-between bg-gray-100 shadow-sm">
            <h2 class="font-bold text-lg text-gray-800">{{ title }}</h2>
            <button @click="emits('exit-modal')" class="text-gray-500 hover:text-gray-700">
                <font-awesome-icon icon="fa-solid fa-xmark" class="text-xl" />
            </button>
        </div>

        <!-- Controls Section -->
        <div class="flex items-center gap-4 px-4 c bg-gray-50 border-b shadow-inner">
            <slot name="control"></slot>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-auto bg-white flex items-center justify-center relative">
            <slot name="content"></slot>
        </div>
    </div>
</template>


<script setup>
const props = defineProps({
    title: {
        type: String,
        required: true
    }
})

const emits = defineEmits(['exit-modal'])
</script>
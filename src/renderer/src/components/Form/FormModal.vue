<template>
    <div class="fixed inset-0 bg-white z-50 flex flex-col h-screen">
        <!-- Header / Toolbar -->
        <div class="p-4 flex items-center justify-between bg-gray-100 ">
            <h2 class="font-bold text-base text-gray-800">{{ title }}</h2>
            <button @click="emits('exit-modal')" class="text-gray-500 hover:text-gray-700">
                <font-awesome-icon icon="fa-solid fa-xmark" class="text-xl" />
            </button>
        </div>

        <!-- Controls Section -->
        <div class="flex items-center gap-4 px-4 border border-gray-300 bg-gray-200 ">
            <slot name="control"></slot>
        </div>

        <!-- Content -->
        <div
            class="flex-1 overflow-auto bg-gradient-to-t from-gray-100 via-white to-white flex items-center justify-center relative">
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
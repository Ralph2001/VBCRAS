<template>
    <div>
        <button type="button" :title="title"
            class="absolute bottom-1 right-1 text-gray-900 hover:bg-red-400 hover:text-white border active:scale-90 border-gray-200 focus:outline-none  font-medium rounded-full text-sm px-4 py-3 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
          
            <slot name="icon">
            </slot>
        </button>
    </div>
</template>


<script setup>

const props = defineProps({
    title: String
})
</script>
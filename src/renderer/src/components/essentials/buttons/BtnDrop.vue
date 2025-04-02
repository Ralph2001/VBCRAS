<template>
    <div class="relative">
        <button type="button" @click="dropdown = !dropdown"
            class="ml-auto text-white px-10 bg-blue-700 hover:bg-blue-800 focus:ring-0 active:scale-95 transition-all duration-200 focus:ring-blue-300 font-medium rounded-sm shadow text-sm  tracking-wider py-1.5  dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
            {{ label }}
        </button>
        <div v-if="dropdown"
            class="z-50 right-0 top-10 absolute border bg-white shadow-lg divide-y divide-gray-100 rounded-lg w-44 dark:bg-gray-700">
            <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                <li v-for="option in options" :key="option">
                    <a @click="emit('open-modal', option)"
                        class="cursor-pointer block px-4 py-2 font-semibold hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                        {{ option }}</a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

const dropdown = ref(false)
onClickOutside(dropdown, (event) => (dropdown.value = false))
const emit = defineEmits(['open-modal'])

const props = defineProps({
    label: {
        type: String,
        required: true,
    },
    options: {
        type: [Array, Object],
        required: true,
    },
})
</script>

<style lang="scss" scoped></style>

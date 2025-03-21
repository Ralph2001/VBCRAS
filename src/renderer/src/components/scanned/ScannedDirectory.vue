<template>
    <li v-for="file in data" :key="file" @click="emits('select-file', file)"
        class="text-md font-semibold antialiased flex items-center gap-1 hover:bg-blue-100 hover:cursor-pointer rounded-sm">
        <font-awesome-icon icon="fa-solid fa-folder" class="text-yellow-400/70 me-2 ms-3" />
        {{ file }}
    </li>
</template>

<script setup>
const props = defineProps({
    data: {
        type: Array,
        required: true
    }
})

const emits = defineEmits(['select-file'])
</script>
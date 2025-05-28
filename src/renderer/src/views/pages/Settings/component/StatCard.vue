<template>
    <div class="bg-white p-4 rounded-xl shadow-sm">
        <p class="text-gray-500 text-sm">{{ label }}</p>
        <p class="text-2xl font-bold text-[#695CFD]">{{ value }}</p>
    </div>

</template>
<script setup>

const props = defineProps({
    label: {
        type: String,
        required: true
    },
    value: {
        type: [String, Number],
        required: true
    }
})
</script>
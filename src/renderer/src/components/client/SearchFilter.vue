<template>
    <input type="text" class=" placeholder:text-gray-300 placeholder:text-sm placeholder:font-normal pl-8 rounded-lg border border-gray-300 font-semibold w-[27rem]" placeholder="Search"
        :value="modelValue" @input="emit('update:modelValue', $event.target.value)">
</template>

<script setup>
const emit = defineEmits(['update:modelValue'])

const props = defineProps({
    modelValue: String
})
</script>


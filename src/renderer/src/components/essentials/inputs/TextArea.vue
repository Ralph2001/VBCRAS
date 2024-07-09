<template>
    <label for="label" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{
        label }} <span class="text-red-600 italic text-sm">*</span></label>
    <textarea id="message" :value="modelValue" :rows="rows" @input="emit('update:modelValue', $event.target.value)"
        :class="[error ? 'border-red-400 border focus:border-red-400 focus:ring-red-400' : 'border border-gray-300 focus:border-green-500 focus:ring-green-500']"
        class="block py-6 outline-none ring-0 px-6 text-justify tracking-wider font-semibold w-full text-md text-gray-900 bg-gray-50 rounded-sm "></textarea>
</template>

<script setup>

const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
    label: String,
    rows: Number,
    modelValue: String,
    error: Boolean
})
</script>

<style lang="scss" scoped></style>
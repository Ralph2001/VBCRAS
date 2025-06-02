<template>
    <div class="flex flex-col gap-2 ">
        <label for="" class="font-medium text-sm text-neutral-800">{{ props.label }}</label>
        <input type="text" class="border border-gray-300 bg-gray-100 py-1 rounded  font-medium p-2 text-sm">
    </div>
</template>

<script setup>
const props = defineProps({
    label: {
        type: String,
        default: " ",
        required: false,
    },

});
</script>

<style lang="scss" scoped></style>
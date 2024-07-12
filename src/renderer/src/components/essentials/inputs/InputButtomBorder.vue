<template>
    <div class="w-full flex flex-row gap-2 items-center">
        <label :for="label" class="text-md">{{ label }}</label>
        <input :id="label"
            class="border-t-0 border-l-0 border-e-0 border-b text-center font-bold border-gray-400 focus:bg-yellow-50 bg-transparent outline-none focus:ring-0 ring-0 ">
    </div>
</template>

<script setup>
const props = defineProps({
    label: String
})
</script>

<style lang="scss" scoped></style>
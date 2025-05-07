<template>
    <div :class="{ 'flex flex-row': twoInput, 'grid grid-cols-3': !twoInput }" class=" text-md  items-center font-medium ">
        <p :class="{ 'basis-[25%] ': twoInput}">{{ label }}</p>
        <div :class="{ 'grow ': twoInput }" class="flex flex-row  col-span-2 items-center gap-1 w-full">
            <slot></slot>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    label: String,
    twoInput: {
        type: Boolean,
        default: false
    }
})
</script>

<style lang="scss" scoped></style>
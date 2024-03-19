<template>
    <div :class="width"
        class="relative mt-2 p-4 flex flex-wrap items-center  bg-white  rounded-lg border  transition-all ">
        <p
            class="z-10 -top-[0.75rem] text-gray-800 left-3 absolute bg-white leading-2 font-base italic text-sm tracking-wide">
            {{ title }}
        </p>
        <slot></slot>
    </div>
</template>

<script setup>
const props = defineProps({
    title: {
        type: String,
        required: true
    },
    width: {
        type: String,
        default: 'w-fit'
    }
})
</script>

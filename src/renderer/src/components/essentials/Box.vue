<template>
    <!-- <div :class="width"
        class="relative mt-2 p-4 flex flex-wrap items-center bg-blue-50/10 border-2 border-blue-200 rounded-md h-full">
        <p
            class="z-10 px-1 -top-[0.75rem] text-black left-3 absolute bg-white leading-2 font-bold italic text-sm tracking-wide">
            {{ title }}
        </p>
        <slot></slot>
    </div> -->
    <fieldset :class="width"
        class="border border-solid border-gray-300 shadow-sm rounded-sm h-full flex items-center flex-wrap px-4 pt-4 pb-7">
        <legend class=" text-blackabsolute bg-white leading-2 font-bold italic text-sm tracking-wide"> {{ title
            }} <span class="ms-4 text-red-500 italic text-xs" v-if="error">{{ error }}</span></legend>
        <slot></slot>
    </fieldset>
</template>

<script setup>
const props = defineProps({
    title: {
        type: String,
        required: true,
    },
    width: {
        type: String,
        default: 'w-fit',
    },
    error: {
        type: String
    }
})
</script>
// box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px
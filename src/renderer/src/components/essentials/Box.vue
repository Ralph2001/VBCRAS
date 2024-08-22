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
        class=" border border-gray-300  bg-gray-50  rounded h-full flex items-center flex-wrap px-10 py-8 ">
        <legend class=" z-50  px-2  bg-transparent leading-2 font-semibold italic text-sm tracking-wide text-gray-600">
            {{ title
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

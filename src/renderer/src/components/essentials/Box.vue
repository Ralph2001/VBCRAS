<template>
    <fieldset :class="width" class="  bg-white  rounded h-full flex items-center flex-wrap  custom-shadow-box">
        <legend class="  px-2   bg-yellow-300 uppercase  font-bold italic text-xs tracking-wide text-neutral-900">
            {{ title
            }} <span class="ms-4 text-red-500 italic text-xs" v-if="error">{{ error }}</span></legend>

        <div class="px-10 py-8 w-full">
            <slot></slot>
        </div>
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

<style scoped>
.custom-shadow-box{
    box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
}
</style>
// box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px

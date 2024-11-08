<style>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>

<template>
    <div class="flex flex-col items-center  relative " :class="[`w-[${props.width}] bg-none`]">
        <label for="" class="absolute text-sm italic text-red-500 -right-0 -top-2" v-if="error">*</label>
        <label for="" class="text-[10px] font-medium  text-zinc-800" v-if="label && top_label">({{ props.label
            }})</label>
        <input :disabled="disabled" :type="type" :tabindex="skip ? -1 : 1" :id="label" @input="emitValue"
            :value="modelValue"
            :class="[props.error ? 'bg-red-100' : props.modelValue ? 'bg-yellow-50'
                : ' bg-blue-50', middle ? 'text-center ' : 'text-start', page_2 ? 'text-md font-normal' : 'text-xs  font-bold'], $attrs['text-position', 'weigth']"
            class="border-t-0 border-l-0 w-full disabled:bg-blue-50 disabled:cursor-not-allowed  border-e-0 border-b-0 focus:bg-blue-200   py-0   tracking-wide   border-gray-400 outline-none focus:ring-0 ring-0 ">
        <label for="" class="text-xs italic text-zinc-400" v-if="label && !top_label">({{ props.label }})</label>

        <!-- <div class="absolute bottom-0 right-0 left-0 bg-white  h-[10rem]  top-4 rounded-sm  shadow border border-gray-700 z-50">
            HELLO
        </div> -->
    </div>
</template>

<script setup>
import { ref, useAttrs } from 'vue'

const attrs = useAttrs()

const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
    label: String,
    type: {
        type: String,
        default: "text"
    },
    width: {
        type: String,
        default: "100%"
    },
    modelValue: String,
    skip: {
        type: Boolean,
        default: false
    },
    isBold: {
        type: Boolean,
        default: false
    },
    error: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    },
    top_label: {
        type: Boolean,
        default: false
    },
    middle: {
        type: Boolean,
        default: false
    },
    page_2: {
        type: Boolean,
        default: false
    }

})


const emitValue = (e) => {
    if (props.isBold) {
        emit('update:modelValue', e.target.value.toUpperCase())
        return
    }

    emit('update:modelValue', e.target.value)
}

</script>

<style lang="scss" scoped></style>
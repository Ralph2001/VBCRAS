<template>
    <div>
        <label v-if="!nolabel" :for="label" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{
            label }}
            <span v-if="error" class="text-red-600">*</span></label>
        <input ref="date_of" :type="type" :id="label" :value="modelValue"
            @input="emit('update:modelValue', $event.target.value)" :tabindex="skip ? '-1' : ''" :readonly="readonly"
            :class="{
                'border-red-400 focus:ring-red-500 focus:border-red-500 focus:bg-red-50': error,
                'focus:ring-green-500 focus:border-green-500 focus:bg-green-50': !error,
            }"
            class="bg-gray-50 tracking-wide rounded read-only:bg-gray-100 read-only:text-gray-400 read-only:focus-within:bg-gray-100 read-only:focus-within:ring-gray-300 read-only:focus-within:border-gray-200 border border-gray-300 font-bold focus:ring-green-500 focus:border-green-500 focus:bg-green-50 text-gray-900 text-sm  block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
const emit = defineEmits(["update:modelValue"]);
import Datepicker from 'flowbite-datepicker/Datepicker';

const date_of = ref(null)
const datepickerEl = date_of.value
new Datepicker(datepickerEl, {
    // options
});



const props = defineProps({
    label: {
        type: String,
        default: " ",
        required: false,
    },
    modelValue: {
        required: false,
        type: [String, Number, Boolean],
        default: "",
    },
    type: {
        type: String,
        required: false,
        default: "text",
    },
    readonly: Boolean,
    skip: {
        type: Boolean,
        default: false,
    },
    error: {
        type: Boolean,
        default: false,
    },
    nolabel: {
        type: Boolean,
        default: false,
    },

});
</script>

<style lang="scss" scoped></style>
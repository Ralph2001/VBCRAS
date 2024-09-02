<template>
    <div class="relative">
        <label v-if="!nolabel" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{ label }}
        </label>
        <input @input="typing_input" :type="type" :id="label" :value="modelValue" :tabindex="skip ? '-1' : ''"
            :readonly="readonly" :class="{
                'border-red-400 focus:ring-red-500 focus:border-red-500 focus:bg-red-50': error,
                'focus:ring-green-500 focus:border-green-500 focus:bg-green-50': !error,
            }"
            class="bg-gray-50 tracking-wide rounded read-only:bg-gray-100 read-only:text-gray-400 read-only:focus-within:bg-gray-100 read-only:focus-within:ring-gray-300 read-only:focus-within:border-gray-200 border border-gray-300 font-bold focus:ring-green-500 focus:border-green-500 focus:bg-green-50 text-gray-900 text-sm  block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500" />

        <div v-if="suggestions_ && result.length > 0" ref="suggestion_box"
            class="absolute w-full z-[9999999999] bg-white    max-h-40 overflow-y-scroll scroll-m-0 flex flex-col border shadow-md">
            <button v-for="suggestion in result" :key="suggestion + '_unique'" @click="i_choose_this(suggestion)"
                class="w-full flex items-center hover:bg-gray-200  h-8 text-sm py-1 justify-start px-2 font-medium outline-none focus:bg-green-200">{{
                    suggestion
                }}</button>
        </div>

    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { onClickOutside, useDebounceFn } from '@vueuse/core'


// Example Array of Data
// import countryList from '../utils/country.js';
// const countries = countryList

const emit = defineEmits(['update:modelValue'])
const props = defineProps({
    suggestion_data: {
        type: Array
    },
    label: {
        type: String,
        default: " ",
        required: false,
    },
    modelValue: {
        required: false,
        type: [String, Number, Boolean, Date],
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
    cap: {
        type: Boolean,
        default: false,
    },
    wait: {
        type: Boolean,
        default: false,
    },


})

const suggestion_box = ref(null)
const suggestions_ = ref(false)
const result = ref()

//Hide Suggestion Box when click outside
onClickOutside(suggestion_box, event => suggestions_.value = false)

const typing_input = (e) => {
    emit('update:modelValue', e.target.value)
    genereate_suggestions(e.target.value)
}
function i_choose_this(value) {
    suggestions_.value = false
    emit('update:modelValue', value)

}
function hide_suggestions_() {
    suggestions_.value = false
}

function genereate_suggestions(e) {
    if (props.suggestion_data) {
        suggestions_.value = true
        result.value = props.suggestion_data.filter(suggestion_item => suggestion_item.toLowerCase().includes(e.toLowerCase()))
    }
}


</script>




<style lang="scss" scoped></style>
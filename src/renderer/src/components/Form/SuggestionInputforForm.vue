<template>
    <div class="relative w-full">
        <input @input="typing_input" :type="type" :value="modelValue" :tabindex="skip ? '-1' : ''" :class="[
            baseClasses,
            {
                'text-center': middle,
                'border-0 ring-0 focus:outline-none focus:ring-0': unbordered,
                'border border-gray-300 focus:ring-blue-500 focus:border-blue-500': !unbordered,
                'italic': italic,
                'font-bold': bold,
                'bg-transparent': isTransparent,
                'focus:ring-red-400 focus:border-red-400': she,
                'border-red-500 ring-0 focus:ring-red-500 focus:border-red-500': error,
                ' cursor-help': isReadOnly
            }
        ]" :readonly="isReadOnly">


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
    wait: {
        type: Boolean,
        default: false
    },
    type: String,
    width: {
        type: String,
        default: 'auto',
    },
    middle: Boolean,
    unbordered: {
        type: Boolean,
        default: false
    },
    italic: Boolean,
    bold: {
        type: Boolean,
        default: false
    },
    isTransparent: { type: Boolean, default: false },
    she: {
        type: Boolean,
        default: false
    },
    modelValue: {
        required: false,
        type: [String, Number, Boolean],
        default: "",
    },
    error: {
        type: Boolean,
        default: false
    },
    isReadOnly: {
        type: Boolean,
        default: false
    },
    skip: {
        type: Boolean,
        default: false
    }


})

const suggestion_box = ref(null)
const suggestions_ = ref(false)
const result = ref()

//Hide Suggestion Box when click outside
onClickOutside(suggestion_box, event => suggestions_.value = false)

const typing_input = (e) => {

    if (props.suggestion_data) {
        console.log('hi')
    }
    emit('update:modelValue', e.target.value)
    generate_suggestions(e.target.value)
}
function i_choose_this(value) {
    suggestions_.value = false
    emit('update:modelValue', value)

}

// Define the debounced function once
const debouncedFn = useDebounceFn((e) => {
    result.value = props.suggestion_data.filter(suggestion_item =>
        suggestion_item.toLowerCase().includes(e.toLowerCase())
    );
    suggestions_.value = true;
}, 1000);

function generate_suggestions(e) {
    if (props.suggestion_data) {
        if (props.wait) {
            debouncedFn(e);
            return;
        }

        result.value = props.suggestion_data.filter(suggestion_item =>
            suggestion_item.toLowerCase().includes(e.toLowerCase())
        );
        suggestions_.value = true;
    }
}

const baseClasses = computed(() => [
    `w-[${props.width}]`,
    !props.bold ? 'font-semibold' : '',
    !props.isTransparent ? 'bg-white' : '',
    !props.she ? 'focus:ring-blue-500 focus:border-blue-500 ' : '',
    'items-center text-gray-900 text-sm rounded px-2 py-1.5'
]);

</script>

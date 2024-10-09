<style>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>

<template>
    <div class="flex flex-col items-center  relative" :class="[`w-[${props.width}] bg-none`]">
        <label for="" class="absolute text-sm italic text-red-500 -right-0 -top-2" v-if="error">*</label>
        <input @keydown.up="focusPreviousInput" @keydown.enter="focusNextInput" @keydown.down="focusNextInput"
            @input="typing_input" :type="type" :id="label" :value="modelValue" :tabindex="skip ? '-1' : ''"
            :readonly="readonly"
            :class="[props.error ? 'bg-red-100' : props.modelValue ? 'bg-blue-50' : ' bg-yellow-50'], $attrs['text-position']"
            class="border-t-0 border-l-0 w-full disabled:bg-blue-50 disabled:cursor-not-allowed   border-e-0 border-b text-center py-0.5 font-bold tracking-wide focus:border-b-gray-400  border-gray-400 outline-none focus:ring-0 ring-0 ">
        <label for="" class="text-xs italic text-zinc-400" v-if="label">({{ props.label }})</label>

        <div v-if="suggestions_ && result.length > 0" ref="suggestion_box"
            class="absolute w-full z-[9999999999] bg-white top-8   max-h-40 overflow-y-scroll scroll-m-0 flex flex-col border shadow-md">
            <button :tabindex="suggestions_ ? '0' : '-1'" @keydown.down="focusNextInput"
                @keydown.enter="selectSuggestion(value, index, $event)" @keydown.up="focusPreviousInput"
                v-for="(value, index) in result" :key="value + '_unique'" @click="i_choose_this(value, index, $event)"
                class="w-full flex items-center hover:bg-gray-200  h-8 text-sm py-1 justify-start px-2 font-medium outline-none focus:bg-green-200">{{
                    value
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

const emit = defineEmits(['update:modelValue', 'change_value'])
const props = defineProps({
    suggestion_data: {
        type: Array
    },
    label: {
        type: String,
        default:'',
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
    center: {
        type: Boolean,
        default: false,
    },
    skip_next_count: {
        type: Boolean,
        default: false,
    },
    width: {
        type: String,
        default: "100%"
    },

})

const suggestion_box = ref(null)
const suggestions_ = ref(false)
const result = ref()

//Hide Suggestion Box when click outside
onClickOutside(suggestion_box, event => suggestions_.value = false)

const typing_input = (e) => {
    const splitted = e.target.value.split(' ')

    // Capitalize only the first letter of the first word
    if (splitted.length > 0) {
        splitted[0] = splitted[0].charAt(0).toUpperCase() + splitted[0].slice(1)
    }
    let main_value = ''
    if (props.cap) {
        main_value = splitted.join(' ').toUpperCase()
    } else {
        // Join the words back together into a string
        main_value = splitted.join(' ')
    }


    emit('update:modelValue', main_value)
    generate_suggestions(main_value)
}
function i_choose_this(value, index, e) {
    suggestions_.value = false; // Hide suggestions
    emit('update:modelValue', value);
    emit('change_value')

    const to_minus = index + 1
    if (props.skip_next_count) {
        stay_count_result(e, to_minus)
        return
    }
    const to_add = result.value.length - index
    focus_count_result(e, to_add); // Focus the next input
}

const focus_count_result = (event, to_add) => {

    event.preventDefault();

    const inputs = Array.from(document.querySelectorAll('input, button, [tabindex]'))
        .filter(input => input.tabIndex >= 0);

    const index = inputs.indexOf(event.target);
    if (index > 0) {
        inputs[index + to_add].focus();
    }
}
const stay_count_result = (event, to_minus) => {
    console.log(to_minus)
    event.preventDefault();
    const inputs = Array.from(document.querySelectorAll('input, button, [tabindex]'))
        .filter(input => input.tabIndex >= 0);

    const index = inputs.indexOf(event.target);
    if (index > 0) {
        inputs[index - to_minus].focus();
    }
}


const selectSuggestion = (value, index, e) => {
    suggestions_.value = false; // Hide suggestions

    emit('update:modelValue', value);
    emit('change_value')

    const to_minus = index + 1
    if (props.skip_next_count) {
        stay_count_result(e, to_minus)
        return
    }


    const to_add = result.value.length - index
    focus_count_result(e, to_add); // Focus the next input
};


function hide_suggestions_() {
    suggestions_.value = false
}

// Define the debounced function once
const debouncedFn = useDebounceFn((e) => {
    result.value = props.suggestion_data.filter(suggestion_item =>
        suggestion_item.toLowerCase().includes(e.toLowerCase())
    );
    suggestions_.value = true;
}, 1000);



function generate_suggestions(e) {
    const input = e.toLowerCase();

    if (input === '') {
        result.value = [];  // Clear results when input is empty
        suggestions_.value = false; // Hide suggestions
        return;
    }

    if (props.suggestion_data) {
        if (props.wait) {
            debouncedFn(input);
            return;
        }

        // Filter and set results
        result.value = props.suggestion_data.filter(suggestion_item =>
            suggestion_item.toLowerCase().includes(input)
        );

        suggestions_.value = result.value.length > 0; // Show suggestions only if there are results
    }
}



const focusPreviousInput = (event) => {
    event.preventDefault();

    // Select only focusable elements (input, button, and elements with tabindex >= 0)
    const inputs = Array.from(document.querySelectorAll('input, button, [tabindex]'))
        .filter(input => input.tabIndex >= 0);

    const index = inputs.indexOf(event.target);
    if (index > 0) {
        inputs[index - 1].focus();
    }
}

const focusNextInput = (event) => {
    event.preventDefault();

    // Select only focusable elements (input, button, and elements with tabindex >= 0)
    const inputs = Array.from(document.querySelectorAll('input, button, [tabindex]'))
        .filter(input => input.tabIndex >= 0);

    const index = inputs.indexOf(event.target);
    if (index >= 0 && index < inputs.length - 1) {
        inputs[index + 1].focus();
    }
}

</script>




<style lang="scss" scoped></style>
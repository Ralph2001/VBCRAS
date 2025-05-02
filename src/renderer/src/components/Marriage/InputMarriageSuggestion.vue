<template>
    <div class="relative" ref="focushereonly">
        <label v-if="!nolabel" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{ label }}
        </label>
        <input :placeholder="props.holder" @focus="scrollToView" ref="suggestion_input_field"
            @keydown.up="focusPreviousInput" @keydown.enter="focusNextInputEnter" @keydown.down="focusNextInput"
            @input="StartTyping" :type="type" :id="label" :value="modelValue" :tabindex="skip ? '-1' : ''"
            :readonly="readonly" :class="{
                'border-red-400 focus:ring-red-500 focus:border-red-500 focus:bg-red-50': error,
                'focus:ring-green-500 focus:border-green-500 focus:bg-green-50': !error,
                'text-center': center
            }"
            class="bg-gray-50 placeholder:italic placeholder:font-normal placeholder:text-xs tracking-wide rounded read-only:bg-gray-100 read-only:text-gray-400 read-only:focus-within:bg-gray-100 read-only:focus-within:ring-gray-300 read-only:focus-within:border-gray-200 border border-gray-300 font-bold focus:ring-green-500 focus:border-green-500 focus:bg-green-50 text-gray-900 text-sm  block w-full p-2.5  " />

        <div v-if="suggestions_ && result.length > 0" ref="suggestion_box"
            class="absolute  z-[99999999999999] w-full mt-1 flex flex-col bg-white rounded  listShadow border border-gray-400 max-h-[8rem] overflow-y-auto ">
            <button @keydown="TypingInputButton" :tabindex="suggestions_ ? '0' : '-1'"
                @keydown.down="focusNextInput($event, index)" @keydown.enter="selectSuggestion(value, index, $event)"
                @keydown.up="focusPreviousInput" v-for="(value, index) in result" :key="value + '_unique'"
                @click="SelectOption(value, index, $event)"
                class="px-3 py-1.5 text-start cursor-pointer transition-colors font-normal text-sm hover:bg-[#3D6C8E]/90 hover:text-white focus:text-white active:text-white active:bg-[#3D6C8E]  w-full outline-none ring-0 focus:bg-[#3D6C8E] ">{{
                    value.toUpperCase()
                }}</button>
        </div>

    </div>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue';
import { onClickOutside, onStartTyping, useDebounceFn, useFocusWithin } from '@vueuse/core'

const focushereonly = ref()
const { focused } = useFocusWithin(focushereonly)



const scrollToView = (event) => {
    nextTick(() => {
        event.target.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest"
        });
    });
};

// Example Array of Data
// import countryList from '../utils/country.js';
// const countries = countryList

const suggestion_input_field = ref(null)

const emit = defineEmits(['update:modelValue', 'change_value'])
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
    holder: {
        type: String,
        required: false,
        default: "",
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




})

const suggestion_box = ref(null)
const suggestions_ = ref(false)
const result = ref([])





onStartTyping(() => {

    if (focused.value) {
        suggestion_input_field.value.focus()
    }
    return
})


onClickOutside(suggestion_box, event => suggestions_.value = false)


const TypingInputButton = (e) => {
    if (e.code === 'Tab' || e.code === 'ArrowUp' || e.code === 'ArrowDown') {
        return
    }
    suggestion_input_field.value.focus()
}

const StartTyping = (e) => {
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
function SelectOption(value, index, e) {
    suggestions_.value = false; // Hide suggestions
    emit('update:modelValue', value.toUpperCase());
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

    emit('update:modelValue', value.toUpperCase());
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
}, 500);



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

        suggestions_.value = result.value.length > 0;


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

// watch(x, (newX) => {

// })

const how_many_downs = ref(1)
const focusNextInput = (event, index_num) => {
    event.preventDefault();

    // Select only focusable elements (input, button, and elements with tabindex >= 0)
    const inputs = Array.from(document.querySelectorAll('input, button, [tabindex]'))
        .filter(input => input.tabIndex >= 0);

    const index = inputs.indexOf(event.target);
    if (index >= 0 && index < inputs.length - 1) {
        inputs[index + 1].focus();
    }
}
const focusNextInputEnter = (event, index_num) => {
    if (result.value.length > 0) {
        result.value = ''
        suggestions_.value = false
    }

    event.preventDefault();


    const inputs = Array.from(document.querySelectorAll('input'))
        .filter(input => input.tabIndex >= 0);

    const index = inputs.indexOf(event.target);
    if (index >= 0 && index < inputs.length - 1) {
        inputs[index + 1].focus();
    }

}

</script>

<style scoped>
.listShadow {
    box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
}
</style>
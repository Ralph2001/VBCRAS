<template>
    <div class="w-full relative" ref="focus_form_address">
        <input ref="input_field_form" :tabindex="skip ? '-1' : ''" type="text" :value="modelValue"
            @keydown.enter="focusNextInput" @keydown.down="handleInputDown" @keydown.up="handleInputUp"
            @input="InputValueData($event.target)" :class="[
                baseClasses,
                {
                    'text-center': middle,
                    'border-0 ring-0 focus:outline-none focus:ring-0': unbordered,
                    'border  border-gray-300  focus:ring-blue-500 focus:border-blue-500': !unbordered,
                    italic: italic,
                    'font-bold': bold,
                    'bg-transparent': isTransparent,
                    'focus:ring-red-400 focus:border-red-400': she,
                    'border-red-500 ring-0 focus:ring-red-500 focus:border-red-500': error,
                    'cursor-help': isReadOnly
                }
            ]" :readonly="isReadOnly" />
        <div v-if="suggestion_box && suggestion_data.length"
            class="absolute  z-50 w-full mt-1 flex flex-col bg-white rounded-md shadow-lg border border-gray-300 max-h-[8rem] overflow-auto">
            <button ref="items" v-for="(option, index) in suggestion_data" :key="index"
                @click="selectOption($event, option)" @keydown.down="handleSuggestionDown(index, $event)"
                @keydown.up="handleSuggestionUp(index, $event)" @keydown.enter="selectOption($event, option)"
                tabindex="-1"
                class="px-3 py-1.5 text-start cursor-pointer transition-colors w-full hover:bg-gray-100 outline-none ring-0 focus:bg-gray-200 active:bg-gray-200">
                {{ option }}
            </button>
        </div>
    </div>
</template>


<script setup>
import { computed, nextTick, ref, shallowRef, watch } from 'vue';
import { all_address, formMunicipalityProvinceAddress } from '../../utils/Address';
import { onStartTyping, useFocusWithin, useFocus } from '@vueuse/core'
const emit = defineEmits(["update:modelValue"]);
const showDropdown = ref(true)
const municipality_with_province = ref(formMunicipalityProvinceAddress());
const suggestion_data = ref([])
const suggestion_box = ref(false)

const focus_form_address = ref(null)
const input_field_form = ref(null)
const { focused } = useFocusWithin(focus_form_address)
const items = shallowRef(null)

watch(focused, (focused) => {
    if (!focused) {
        suggestion_data.value = []
        suggestion_box.value = false
    }
})
onStartTyping(() => {
    if (focused.value)
        input_field_form.value.focus()
})

const props = defineProps({
    isPlace: {
        type: Boolean,
        default: false,
    },
    options: {
        type: Array,
        default: []
    },
    width: {
        type: String,
        default: 'auto'
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
    isTransparent: {
        type: Boolean,
        default: false
    },
    she: {
        type: Boolean,
        default: false
    },
    modelValue: {
        type: [String, Number, Boolean],
        default: ""
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
    },
    isUpperCase: {
        type: Boolean,
        default: false
    }
});


const selectOption = (e, value) => {
    emit('update:modelValue', props.isUpperCase ? value.toUpperCase() : value);
    suggestion_box.value = false
    setTimeout(() => {
        focusNextInput(e)
    }, 500);
};

const handleInputDown = (event) => {
    if (suggestion_box.value && suggestion_data.value.length) {
        event.preventDefault()
        nextTick(() => {
            if (items.value.length > 0) {
                items.value[0].focus()
            }
        })
    } else {
        focusNextInput(event)
    }
}

const handleInputUp = (event) => {
    if (suggestion_box.value && suggestion_data.value.length) {
        event.preventDefault()
        nextTick(() => {
            if (items.value.length > 0) {
                items.value[items.value.length - 1].focus()
            }
        })
    } else {
        focusPreviousInput(event)
    }
}

const handleSuggestionDown = (index, event) => {
    event.preventDefault()
    if (index < items.value.length - 1) {
        items.value[index + 1].focus()
    } else {
        focusNextInput(event)
    }
}

const handleSuggestionUp = (index, event) => {
    event.preventDefault()
    if (index > 0) {
        items.value[index - 1].focus()
    } else {
        input_field_form.value.focus()
    }
}


const focusPreviousInput = (event) => {
    event.preventDefault();
    const inputs = Array.from(document.querySelectorAll('input, button, [tabindex]'))
        .filter(input => input.tabIndex >= 0);

    const index = inputs.indexOf(event.target);
    if (index > 0) {
        inputs[index - 1].focus();
    }
}
const focusNextInput = (event) => {
    event.preventDefault();
    if (props.skipnext) {
        return;
    }

    const inputs = Array.from(document.querySelectorAll('input, button, [tabindex]'))
        .filter(input => input.tabIndex >= 0);

    const index = inputs.indexOf(event.target);
    if (index >= 0 && index < inputs.length - 1) {
        inputs[index + 1].focus();
    }
}

const baseClasses = computed(() => [
    `w-[${props.width}]`,
    !props.bold ? 'font-semibold' : '',
    !props.isTransparent ? 'bg-neutral-50' : '',
    !props.she ? 'focus:ring-blue-500 focus:border-blue-500' : '',
    'items-center text-gray-900 text-sm rounded px-2 py-1.5'
]);
const InputValueData = (target) => {
    let value = target.value;

    if (props.isUpperCase) {
        value = value.toUpperCase();
    }

    const start = target.selectionStart;
    const end = target.selectionEnd;

    emit('update:modelValue', value);
    if (props.isPlace) {
        filterPlaceSuggestions(value)
    } else {
        suggestion_data.value = props.options.filter(items =>
            items.toLowerCase().includes(value.toLowerCase())
        );
        if (suggestion_data.value.length) {
            suggestion_box.value = true
        }
    }


    nextTick(() => {
        target.setSelectionRange(start, end);
    });
}


// const all_ = ref(all_address())

function filterPlaceSuggestions(placeBirth) {
    if (!placeBirth) {
        return;
    }
    


    const searchTerm = placeBirth.trim().toLowerCase();
    const inputParts = searchTerm.split(/,\s*/).map(part => part.trim());

    const mergedSuggestions = new Set();

    municipality_with_province.value.forEach(entry => {
        const entryParts = entry.split(', ').map(part => part.trim());
        const entryPartsLower = entryParts.map(part => part.toLowerCase());

        let matchedIndex = -1;
        let matchedInputIndex = -1;

        for (let i = 0; i < inputParts.length; i++) {
            const index = entryPartsLower.indexOf(inputParts[i]);
            if (index !== -1) {
                matchedIndex = index;
                matchedInputIndex = i;
                break;
            }
        }

        if (matchedIndex === -1) return;

        const mergedParts = [
            ...inputParts.slice(0, matchedInputIndex).map(part =>
                formatWithRomanNumerals(part)
            ),
            entryParts[matchedIndex],
            ...entryParts.slice(matchedIndex + 1)
        ];

        mergedSuggestions.add(mergedParts.join(', '));
    });

    suggestion_data.value = Array.from(mergedSuggestions);
    if (suggestion_data.value.length) {
        suggestion_box.value = true
    }


}

function formatWithRomanNumerals(text) {
    return text.split(' ')
        .map(word => {
            const upperWord = word.toUpperCase();
            return isRomanNumeral(upperWord)
                ? upperWord
                : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(' ');
}

function isRomanNumeral(str) {
    return /^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/.test(str);
}


</script>
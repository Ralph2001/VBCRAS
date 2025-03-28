<template>

        <input @keydown.enter="focusNextInput" @keydown.down="focusNextInput" @keydown.up="focusPreviousInput"
            :tabindex="skip ? '-1' : ''" type="text" :value="modelValue" @input="InputValueData($event.target)" :class="[
                baseClasses,
                {
                    'text-center': middle,
                    'border-0 ring-0 focus:outline-none focus:ring-0': unbordered,
                    'border  border-gray-300  focus:ring-blue-500 focus:border-blue-500': !unbordered,
                    italic: italic,
                    'font-bold': bold,
                    'bg-transparent': isTransparent,
                    'focus:ring-red-400 focus:border-red-400': she,
                    'border-red-500 ring-0 focus:ring-red-500 focus:border-red-500 ': error,
                    'cursor-help': isReadOnly
                }
            ]" :readonly="isReadOnly" />
        <!-- <font-awesome-icon v-if="isTextShouldSmaller" icon="fa-solid fa-circle-exclamation"
            class="absolute   top-2 bottom-0 right-2 text-yellow-300"
            title="The text is too long. The font will be reduced automatically, or you can change the position in the settings." />
  -->
</template>

<script setup>
import { format, isValid, parse } from 'date-fns';
import { computed, nextTick } from 'vue';

const emit = defineEmits(["update:modelValue"]);

const isTextShouldSmaller = computed(() => {
    if (props.modelValue.length > 40) {
        return true
    }
    return false
})

const props = defineProps({
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
    // New prop: when true, the value will be forced to uppercase
    isUpperCase: {
        type: Boolean,
        default: false
    },
    isDate: {
        type: Boolean,
        default: false
    }
});

const baseClasses = computed(() => [
    `w-[${props.width}]`,
    !props.bold ? 'font-semibold' : '',
    !props.isTransparent ? 'bg-neutral-50' : '',
    !props.she ? 'focus:ring-blue-500 focus:border-blue-500' : '',
    'items-center text-gray-900 text-sm rounded px-2 py-1.5'
]);

// Computed property for v-model handling uppercase transformation if needed
const InputValueData = (target) => {
    let value = target.value;


    if (props.isDate) {
        dateFormatter(value)
        return
    }


    // If Props Uppercase the Result will be uppercase
    if (props.isUpperCase) {
        value = value.toUpperCase();
    }

    // Save cursor position before update
    const start = target.selectionStart;
    const end = target.selectionEnd;

    emit('update:modelValue', value);

    // Restore cursor position after DOM update
    nextTick(() => {
        target.setSelectionRange(start, end);
    });
}


function dateFormatter(data) {

    const dateFormats = [
        'MM/dd/',    // Format: 11/20/24
        'MM-dd-',    // Format: 11-20-24  
    ];

    let parsedDate = null
    for (let formatString of dateFormats) {
        parsedDate = parse(data, formatString, new Date())
        if (isValid(parsedDate)) {
            const formattedDate = format(parsedDate, 'MMMM dd, ');
            console.log(formattedDate)
            emit('update:modelValue', formattedDate);
            return
        }
        emit('update:modelValue', data);

    }
}


const focusPreviousInput = (event) => {
    event.preventDefault();

    // Select only focusable elements (input, button, and elements with tabindex >= 0)
    const inputs = Array.from(document.querySelectorAll('input, select, [tabindex]'))
        .filter(input => input.tabIndex >= 0);

    const index = inputs.indexOf(event.target);
    if (index > 0) {
        inputs[index - 1].focus();
    }
}

const focusNextInput = (event) => {
    if (props.skipnext) {
        return;
    }
    event.preventDefault();

    // Select only focusable elements (input, select, and elements with tabindex >= 0)
    const inputs = Array.from(document.querySelectorAll('input, select, [tabindex]'))
        .filter(input => input.tabIndex >= 0);

    const index = inputs.indexOf(event.target);
    if (index >= 0 && index < inputs.length - 1) {
        inputs[index + 1].focus();
    }
}

</script>

<template>
    <div class="relative" ref="focushereonly">
        <label v-if="!nolabel" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            {{ label }}
        </label>
        <input ref="suggestion_input_field" :type="type" :id="label" :value="modelValue" :placeholder="holder"
            :readonly="readonly" :tabindex="skip ? -1 : 0" @focus="scrollToView" @input="handleTyping"
            @keydown.up.prevent="focusPreviousInput" @keydown.down.prevent="focusNextInput"
            @keydown.enter.prevent="focusNextInputEnter" :class="[
                'bg-gray-50 border font-bold text-sm text-gray-900 block w-full p-2.5 rounded tracking-wide',
                'placeholder:italic placeholder:font-normal placeholder:text-xs',
                'border-gray-300 focus:ring-green-500 focus:border-green-500 focus:bg-green-50',
                {
                    'border-red-400 focus:ring-red-500 focus:border-red-500 focus:bg-red-50': error,
                    'focus:ring-green-500 focus:border-green-500 focus:bg-green-50': !error,
                    'text-center': center,
                    'read-only:bg-gray-100 read-only:text-gray-400': readonly,
                }
            ]" />

        <div v-if="suggestions_ && result.length" ref="suggestion_box"
            class="absolute z-50 w-full mt-1 flex flex-col bg-white border border-gray-300 rounded shadow-xl max-h-32 overflow-auto">
            <button v-for="(value, index) in result" :key="value + '_unique'"
                @click="selectSuggestion(value, index, $event)" @keydown.down.prevent="focusNextInput"
                @keydown.up.prevent="focusPreviousInput" @keydown.enter.prevent="selectSuggestion(value, index, $event)"
                :tabindex="suggestions_ ? 0 : -1"
                class="px-3 py-1.5 text-start text-sm font-normal cursor-pointer transition-colors hover:bg-[#3D6C8E]/60 hover:text-white focus:bg-[#3D6C8E] focus:text-white active:bg-[#3D6C8E] active:text-white outline-none">
                {{ value.toUpperCase() }}
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { onClickOutside, onStartTyping, useDebounceFn, useFocusWithin } from '@vueuse/core'

const emit = defineEmits(['update:modelValue', 'change_value'])

const props = defineProps({
    suggestion_data: Array,
    label: { type: String, default: '' },
    modelValue: { type: [String, Number, Boolean, Date], default: '' },
    type: { type: String, default: 'text' },
    holder: { type: String, default: '' },
    readonly: Boolean,
    skip: Boolean,
    error: Boolean,
    nolabel: Boolean,
    cap: Boolean,
    wait: Boolean,
    center: Boolean,
    skip_next_count: Boolean,
})

const focushereonly = ref()
const suggestion_input_field = ref()
const suggestion_box = ref()
const suggestions_ = ref(false)
const result = ref([])

const { focused } = useFocusWithin(focushereonly)

onStartTyping(() => {
    if (focused.value) suggestion_input_field.value?.focus()
})

onClickOutside(suggestion_box, () => {
    suggestions_.value = false
})

const scrollToView = (event) => {
    nextTick(() => {
        event.target.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
}

const handleTyping = (e) => {
    const words = e.target.value.split(' ')
    if (words.length > 0) words[0] = capitalizeFirstLetter(words[0])
    const value = props.cap ? words.join(' ').toUpperCase() : words.join(' ')
    emit('update:modelValue', value)
    generateSuggestions(value)
}

const capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1)

const generateSuggestions = (input) => {
    const lower = input.toLowerCase()
    if (!lower) {
        result.value = []
        suggestions_.value = false
        return
    }

    if (props.wait) {
        debouncedFn(lower)
    } else {
        result.value = props.suggestion_data || []
        suggestions_.value = result.value.length > 0
    }
}

const debouncedFn = useDebounceFn((query) => {
    result.value = props.suggestion_data?.filter(item =>
        item.toLowerCase().includes(query)
    ) || []
    suggestions_.value = true
}, 500)

const selectSuggestion = (value, index, e) => {
    emit('update:modelValue', value.toUpperCase())
    emit('change_value')
    suggestions_.value = false

    if (props.skip_next_count) {
        focusPreviousCount(e, index + 1)
    } else {
        focusNextCount(e, result.value.length - index)
    }
}

const focusNextCount = (event, count) => {
    const inputs = getFocusableElements()
    const index = inputs.indexOf(event.target)
    if (index >= 0 && index + count < inputs.length) {
        inputs[index + count]?.focus()
    }
}

const focusPreviousCount = (event, count) => {
    const inputs = getFocusableElements()
    const index = inputs.indexOf(event.target)
    if (index - count >= 0) {
        inputs[index - count]?.focus()
    }
}

const getFocusableElements = () =>
    Array.from(document.querySelectorAll('input, button, [tabindex]')).filter(
        el => el.tabIndex >= 0
    )

const focusNextInput = (event) => {
    if (suggestions_.value && result.value.length) {
        const buttons = suggestion_box.value?.children;
        if (!buttons?.length) return;

        // From input to first suggestion
        if (event.target === suggestion_input_field.value) {
            buttons[0]?.focus();
            return;
        }

        // Circular navigation within suggestions
        const currentIndex = Array.from(buttons).indexOf(event.target);
        if (currentIndex > -1) {
            const nextIndex = (currentIndex + 1) % buttons.length;
            buttons[nextIndex]?.focus();
        }
    } else {
        // Default behavior when no suggestions
        const inputs = getFocusableElements();
        const index = inputs.indexOf(event.target);
        if (index >= 0 && index + 1 < inputs.length) {
            inputs[index + 1]?.focus();
        }
    }
};

const focusPreviousInput = (event) => {
    if (suggestions_.value && result.value.length) {
        const buttons = suggestion_box.value?.children;
        if (!buttons?.length) return;

        // From input to last suggestion
        if (event.target === suggestion_input_field.value) {
            buttons[buttons.length - 1]?.focus();
            return;
        }

        // Circular navigation within suggestions
        const currentIndex = Array.from(buttons).indexOf(event.target);
        if (currentIndex > -1) {
            const prevIndex = (currentIndex - 1 + buttons.length) % buttons.length;
            buttons[prevIndex]?.focus();
        }
    } else {
        // Default behavior when no suggestions
        const inputs = getFocusableElements();
        const index = inputs.indexOf(event.target);
        if (index > 0) {
            inputs[index - 1]?.focus();
        }
    }
};

const focusNextInputEnter = (event) => {
    if (result.value.length > 0) {
        result.value = []
        suggestions_.value = false
    }
    const inputs = getFocusableElements()
    const index = inputs.indexOf(event.target)
    if (index >= 0 && index + 1 < inputs.length) inputs[index + 1]?.focus()
}
</script>

<template>
    <div class="relative" ref="containerRef">
        <label v-if="!nolabel" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            {{ label }}
        </label>

        <input ref="inputRef" :placeholder="holder" :type="type" :id="label" :value="modelValue" :readonly="readonly"
            :tabindex="skip ? '-1' : ''" @focus="scrollIntoView" @input="handleInput" @keydown.up="focusPrev"
            @keydown.down="focusNext" @keydown.enter="handleEnterKey" :class="[
                'bg-gray-50 border font-bold text-gray-900 text-sm block w-full p-2.5',
                {
                    'border-red-400 focus:ring-red-500 focus:border-red-500 focus:bg-red-50': error,
                    'focus:ring-green-500 focus:border-green-500 focus:bg-green-50': !error,
                    'text-center': center,
                    'read-only:bg-gray-100 read-only:text-gray-400 read-only:focus-within:bg-gray-100': readonly
                }
            ]"
            class="placeholder:italic placeholder:font-normal placeholder:text-xs tracking-wide rounded border-gray-300" />

        <div v-if="showSuggestions && suggestions.length" ref="suggestionBoxRef"
            class="absolute z-[99999999999999] w-full mt-1 flex flex-col bg-white rounded shadow-xl border border-gray-300 max-h-[8rem] overflow-y-auto">
            <button v-for="(item, index) in suggestions" :key="item + '_unique'"
                class="px-3 py-1.5 text-start cursor-pointer transition-colors font-normal text-sm hover:bg-[#3D6C8E]/60 hover:text-white focus:text-white active:text-white active:bg-[#3D6C8E] w-full outline-none ring-0 focus:bg-[#3D6C8E]"
                @click="selectSuggestion(item, index, $event)" @keydown="handleButtonKey"
                @keydown.down="focusNext($event, index)" @keydown.up="focusPrev"
                @keydown.enter="selectSuggestion(item, index, $event)" :tabindex="showSuggestions ? '0' : '-1'">
                {{ item }}
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
    label: { type: String, default: ' ' },
    modelValue: [String, Number, Boolean, Date],
    type: { type: String, default: 'text' },
    holder: String,
    readonly: Boolean,
    skip: Boolean,
    error: Boolean,
    nolabel: Boolean,
    cap: Boolean,
    wait: Boolean,
    center: Boolean,
    skip_next_count: Boolean
})

const containerRef = ref()
const inputRef = ref()
const suggestionBoxRef = ref()
const showSuggestions = ref(false)
const suggestions = ref([])

const { focused } = useFocusWithin(containerRef)

onStartTyping(() => {
    if (focused.value) inputRef.value?.focus()
})

onClickOutside(suggestionBoxRef, () => (showSuggestions.value = false))

const scrollIntoView = (event) => {
    nextTick(() => {
        event.target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
    })
}

const handleInput = (e) => {
    const words = e.target.value.split(' ')
    if (words.length > 0) words[0] = capitalizeFirst(words[0])
    let inputValue = props.cap ? words.join(' ').toUpperCase() : words.join(' ')
    emit('update:modelValue', inputValue)
    updateSuggestions(inputValue)
}

const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1)

const handleButtonKey = (e) => {
    if (['Tab', 'ArrowUp', 'ArrowDown'].includes(e.code)) return
    inputRef.value?.focus()
}

const updateSuggestions = (input) => {
    if (!input) {
        suggestions.value = []
        showSuggestions.value = false
        return
    }

    const filterFn = () =>
    (suggestions.value = props.suggestion_data.filter((item) =>
        item.toLowerCase().includes(input.toLowerCase())
    ))

    if (props.wait) debouncedFilter(input)
    else {
        filterFn()
        showSuggestions.value = suggestions.value.length > 0
    }
}

const debouncedFilter = useDebounceFn((input) => {
    suggestions.value = props.suggestion_data.filter((item) =>
        item.toLowerCase().includes(input.toLowerCase())
    )
    showSuggestions.value = suggestions.value.length > 0
}, 500)

const selectSuggestion = (value, index, e) => {
    emit('update:modelValue', value)
    emit('change_value')
    showSuggestions.value = false
    props.skip_next_count ? moveFocusBackward(e, index + 1) : moveFocusForward(e, suggestions.value.length - index)
}

const moveFocusForward = (event, step = 1) => {
    event.preventDefault()
    const inputs = getFocusableElements()
    const idx = inputs.indexOf(event.target)
    if (idx >= 0 && idx + step < inputs.length) inputs[idx + step].focus()
}

const moveFocusBackward = (event, step = 1) => {
    event.preventDefault()
    const inputs = getFocusableElements()
    const idx = inputs.indexOf(event.target)
    if (idx >= step) inputs[idx - step].focus()
}

const focusPrev = (event) => {
    event.preventDefault()

    if (showSuggestions.value && suggestions.value.length) {
        const buttons = suggestionBoxRef.value?.children
        if (!buttons?.length) return

        const idx = Array.from(buttons).findIndex((btn) => btn === event.target)
        const prevIdx = (idx - 1 + buttons.length) % buttons.length
        buttons[prevIdx]?.focus()
    } else {
        const inputs = getFocusableElements()
        const idx = inputs.indexOf(event.target)
        if (idx > 0) inputs[idx - 1].focus()
    }
}

const focusNext = (event) => {
    event.preventDefault()

    if (showSuggestions.value && suggestions.value.length) {
        const buttons = suggestionBoxRef.value?.children
        if (!buttons?.length) return

        const idx = Array.from(buttons).findIndex((btn) => btn === event.target)
        const nextIdx = (idx + 1) % buttons.length
        buttons[nextIdx]?.focus()
    } else {
        const inputs = getFocusableElements()
        const idx = inputs.indexOf(event.target)
        if (idx < inputs.length - 1) inputs[idx + 1].focus()
    }
}

const handleEnterKey = (event) => {
    if (suggestions.value.length) {
        suggestions.value = []
        showSuggestions.value = false
    }

    event.preventDefault()
    const inputs = getFocusableElements()
    const idx = inputs.indexOf(event.target)
    if (idx >= 0 && idx < inputs.length - 1) inputs[idx + 1].focus()
}

const getFocusableElements = () =>
    Array.from(document.querySelectorAll('input, button, [tabindex]')).filter((el) => el.tabIndex >= 0)
</script>

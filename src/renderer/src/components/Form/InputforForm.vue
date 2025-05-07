<template>
    <input ref="containerRef" type="text" :value="modelValue" :tabindex="skip ? '-1' : ''"
        @input="handleInput($event.target)" @keydown.enter="focusNextField" @keydown.down="focusNextField"
        @keydown.up="focusPreviousField" @focus="smoothScrollIntoView" :readonly="isReadOnly" :class="[
            baseClasses,
            {
                'text-center': middle,
                'border-0 ring-0 focus:outline-none focus:ring-0': unbordered,
                'border border-gray-300 focus:ring-blue-500 focus:border-blue-500': !unbordered,
                italic,
                'font-bold': bold,
                'bg-transparent': isTransparent,
                'focus:ring-red-400 focus:border-red-400': she,
                'border-red-500 ring-0 focus:ring-red-500 focus:border-red-500': error,
                'cursor-help': isReadOnly
            }
        ]" />
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { onStartTyping, useFocusWithin } from '@vueuse/core'
import { format, parse, isValid } from 'date-fns'

const emit = defineEmits(['update:modelValue'])

const containerRef = ref()
const { focused } = useFocusWithin(containerRef)

onStartTyping(() => {
    if (focused.value) containerRef.value?.focus()
})

const props = defineProps({
    width: { type: String, default: 'auto' },
    middle: Boolean,
    unbordered: Boolean,
    italic: Boolean,
    bold: Boolean,
    isTransparent: Boolean,
    she: Boolean,
    modelValue: [String, Number, Boolean],
    error: Boolean,
    isReadOnly: Boolean,
    skip: Boolean,
    isUpperCase: Boolean,
    isDate: Boolean,
    skipnext: Boolean
})

const baseClasses = computed(() => [
    `w-[${props.width}]`,
    !props.bold && 'font-semibold',
    !props.isTransparent && 'bg-neutral-50',
    !props.she && 'focus:ring-blue-500 focus:border-blue-500',
    'items-center text-gray-900 text-sm rounded px-2 py-1.5'
].filter(Boolean))

const handleInput = (target) => {
    let value = target.value

    if (props.isDate) {
        formatDateInput(value)
        return
    }

    if (props.isUpperCase) {
        value = value.toUpperCase()
    }

    const start = target.selectionStart
    const end = target.selectionEnd

    emit('update:modelValue', value)

    nextTick(() => {
        target.setSelectionRange(start, end)
    })
}

const formatDateInput = (input) => {
    const dateFormats = ['MM/dd/', 'MM-dd-']
    for (const fmt of dateFormats) {
        const parsed = parse(input, fmt, new Date())
        if (isValid(parsed)) {
            const formatted = format(parsed, 'MMMM dd, ')
            emit('update:modelValue', formatted)
            return
        }
    }
    emit('update:modelValue', input)
}

const smoothScrollIntoView = (event) => {
    nextTick(() => {
        event.target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
    })
}

const focusPreviousField = (event) => {
    event.preventDefault()
    const inputs = Array.from(document.querySelectorAll('input, select, [tabindex]'))
        .filter(el => el.tabIndex >= 0)
    const index = inputs.indexOf(event.target)
    if (index > 0) inputs[index - 1].focus()
}

const focusNextField = (event) => {
    if (props.skipnext) return
    event.preventDefault()
    const inputs = Array.from(document.querySelectorAll('input, select, [tabindex]'))
        .filter(el => el.tabIndex >= 0)
    const index = inputs.indexOf(event.target)
    if (index >= 0 && index < inputs.length - 1) inputs[index + 1].focus()
}
</script>
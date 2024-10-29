<template>
    <div :class="containerClass">
        <label :for="inputId" class="text-nowrap font-medium text-sm" v-if="props.labelPosition === 'side'">{{ label
            }}:</label>
        <input type="text"
            class="w-full border-0 border-b uppercase text-center text-sm font-bold items-center flex justify-center outline-none py-1  bg-gray-200 border-gray-400 focus:ring-0 ring-0"
            :id="inputId" />
        <label :for="inputId" class="text-nowrap font-normal text-xs italic text-gray-500"
            v-if="props.labelPosition === 'below'">({{ label
            }})</label>
    </div>
</template>

<script setup>
const props = defineProps({
    label: {
        type: String,
        default: '',
        required: true
    },
    labelPosition: {
        type: String,
        default: 'side', // Set default to 'side'
        validator: value => ['below', 'side'].includes(value)
    },
})

const inputId = `${props.label.replace(/\s+/g, '_').toLowerCase()}`; // Generate a unique ID for the input

const containerClass = props.labelPosition === 'below'
    ? 'flex flex-col gap-1 w-full items-center'
    : 'flex flex-row gap-2 items-center w-full';
</script>

<style lang="scss" scoped></style>

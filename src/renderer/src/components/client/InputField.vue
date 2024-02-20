<template>
    <div class="mb-5 w-[18rem] h-20">
        <label :for="label" :class="{ 'text-red-500': error }" class="block mb-2 text-sm font-medium text-gray-900 ">{{
            label }}</label>
        <input :type="type" :id="label" :value="modelValue" @input="emit('update:modelValue', $event.target.value)"
            :class="{ 'border border-red-300 focus:ring-red-400 focus:border-red-500': error }"
            class="bg-white border font-bold border-gray-300 focus:ring-1 focus:ring-blue-400 focus:outline-none focus:border-blue-500 text-gray-900 text-sm rounded-sm block w-full p-2.5 " />
        <slot>
        </slot>
    </div>
</template>

<script setup>

const emit = defineEmits(['update:modelValue'])
const props = defineProps({
    label: {
        type: String,
        required: true
    },
    type: {
        type: String,
        default: 'text',
        required: true
    },
    modelValue: {
        type: String,
        default: '',
        required: true
    },
    error: {
        type: Boolean,
        default: false
    }
})
</script>


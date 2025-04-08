<template>
    <div class="w-full flex relative flex-row h-12 items-center">
        <!-- Clear Icon -->
        <font-awesome-icon v-if="modelValue" @click="clearInput" icon="fa-solid fa-xmark"
            class="absolute right-3 text-gray-500 hover:text-gray-700 cursor-pointer " />

        <!-- Search Icon -->
        <font-awesome-icon @click="focusInput" icon="fa-solid fa-magnifying-glass"
            class="text-gray-300 pointer-events-none absolute ml-2" />

        <!-- Search Input -->
        <input :value="props.modelValue" @input="emit('update:modelValue', $event.target.value);" type="text"
            ref="input"
            class="placeholder:text-gray-300 placeholder:text-sm placeholder:font-normal pl-8 rounded-lg border border-gray-300 font-semibold w-full select-none"
            placeholder="Search" />
    </div>
</template>

<script setup>
const props = defineProps({
    modelValue: {
        type: [String],
        default: ""
    }
});

const emit = defineEmits(['update:modelValue']);

// Clear the input value when the clear (x) icon is clicked
const clearInput = () => {
    emit('update:modelValue', ''); // Clears the value
};

// Focus the input when the search (magnifying glass) icon is clicked
const focusInput = () => {
    const inputElement = $refs.input;
    if (inputElement) {
        inputElement.focus(); // Focus the input element when the magnifying glass is clicked
    }
};
</script>
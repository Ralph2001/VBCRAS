<template>
    <div class="flex items-center gap-2" v-for="(value, key) in options" :key="key">

        <button @keydown.down="focusNextInput" @keydown.up="focusPreviousInput" @keydown.right="focusNextInput"
            @keydown.left="focusPreviousInput" @click="select_this(key)"
            :class="[key === props.modelValue ? 'bg-blue-300' : 'bg-gray-100']"
            class="flex items-center justify-center h-6 rounded w-6   border border-gray-300 theselector">
            <font-awesome-icon class="text-gray-800 text-sm" v-if="key === props.modelValue" icon="fa-solid fa-xmark" />
        </button>
        <p class=" font-medium text-sm hover:cursor-pointer" @click="select_this(key)">{{ value }}</p>



    </div>
</template>

<script setup>


const emit = defineEmits(["update:modelValue", 'change_']);

const select_this = (value) => {

    emit('update:modelValue', value)
    emit('change_')

}
const props = defineProps({
    options: {
        type: [Array, Object],
        default: []
    },
    modelValue: {
        required: false,
        type: [String, Number],
        default: "",
    },
})

const focusNextInput = (event) => {
    event.preventDefault();

    const inputs = document.querySelectorAll('input, button, [tabindex]');
    const index = Array.from(inputs).indexOf(event.target);
    if (index >= 0 && index < inputs.length - 1) {
        inputs[index + 1].focus();
    }
};
const focusPreviousInput = (event) => {
    event.preventDefault();


    const inputs = document.querySelectorAll('input, button, [tabindex]');
    const index = Array.from(inputs).indexOf(event.target);
    if (index >= 0 && index < inputs.length - 1) {
        inputs[index - 1].focus();
    }
};

</script>
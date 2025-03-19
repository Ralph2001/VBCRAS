<template>
    <div class="flex items-center gap-2" v-for="(value, key) in options" :key="key">

        <button @focus="scrollToView" @keydown.down="focusNextInput" @keydown.up="focusPreviousInput" @keydown.right="focusNextInput"
            @keydown.left="focusPreviousInput" @click="select_this(key)"
            :class="[key === props.modelValue ? 'bg-blue-300' : 'bg-gray-100']"
            class="flex items-center justify-center h-6 rounded w-6   border border-gray-300 theselector">
            <font-awesome-icon class="text-gray-800 text-sm" v-if="key === props.modelValue" icon="fa-solid fa-xmark" />
        </button>
        <p class=" font-medium text-sm hover:cursor-pointer" @click="select_this(key)">{{ value }}</p>



    </div>
</template>

<script setup>
import { nextTick } from 'vue';



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

const focusNextInput = (event) => {
  event.preventDefault();

  // Select only focusable elements (input, button, and elements with tabindex >= 0)
  const inputs = Array.from(document.querySelectorAll('input, button, [tabindex]'))
    .filter(input => input.tabIndex >= 0);

  const index = inputs.indexOf(event.target);
  if (index >= 0 && index < inputs.length - 1) {
    inputs[index + 1].focus();
  }
}

const scrollToView = (event) => {

  nextTick(() => {
    event.target.scrollIntoView({
      behavior: "smooth",   // Smooth scrolling
      block: "center",      // Scroll to center of the screen
      inline: "nearest"     // Scroll inline if necessary
    });
  });
};



</script>
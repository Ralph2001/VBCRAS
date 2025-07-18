<template>
  <div class="flex items-center">
    <input :disabled="props.readonly" @keydown.down="focusNextInput" @keydown.up="focusPreviousInput"
      :tabindex="skip ? '-1' : '0'" :id="id" type="checkbox" :checked="modelValue" :class="{
        'border-red-400 focus:ring-red-500 focus:border-red-500 focus:bg-red-50': error,
      }" @change="$emit('update:modelValue', !modelValue)"
      class="w-8 h-6 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
      @focus="scrollToView" />
  </div>
</template>

<script setup>
import { defineProps, defineEmits, nextTick } from "vue";

const props = defineProps({
  id: {
    type: String,
    default: "default-checkbox",
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: Boolean,
    default: false,
  },
  error: Boolean,
  skip: {
    type: Boolean,
    default: false,
  }
});

const emit = defineEmits(["update:modelValue"]);

// Focus handling functions
const focusNextInput = (event) => {
  event.preventDefault();
  const inputs = Array.from(document.querySelectorAll('input, button, [tabindex]:not([tabindex="-1"])'));
  const index = inputs.indexOf(event.target);
  if (index >= 0 && index < inputs.length - 1) {
    inputs[index + 1].focus();
  }
};

const focusPreviousInput = (event) => {
  event.preventDefault();
  const inputs = Array.from(document.querySelectorAll('input, button, [tabindex]:not([tabindex="-1"])'));
  const index = inputs.indexOf(event.target);
  if (index > 0) {
    inputs[index - 1].focus();
  }
};

// Scroll to the focused input
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

<template>
  <div class="w-full">
    <label v-if="!nolabel" :for="label" class="block mb-1.5 text-sm font-medium text-gray-800 dark:text-white">{{ label }}
      <span v-if="error" class="text-red-600">*</span></label>
    <input @keydown.tab="handleTab" :placeholder="props.holder" @keydown.enter="focusNextInput"
      @keydown.down="focusNextInput" @keydown.up="focusPreviousInput" :type="type" :id="label" :value="modelValue"
      @input="value_toUpperCase($event.target)" :tabindex="skip ? '-1' : ''" :readonly="readonly" :class="{
        'border-red-400 focus:ring-red-500 focus:border-red-500 focus:bg-red-50': error,
        'focus:ring-green-500 focus:border-green-500 focus:bg-green-50': !error,
        'flex items-center text-center': center
      }"
      class="bg-gray-50 placeholder:italic placeholder:font-normal placeholder:text-xs tracking-wide rounded read-only:bg-gray-100 read-only:text-gray-400 read-only:focus-within:bg-gray-100 read-only:focus-within:ring-gray-300 read-only:focus-within:border-gray-200 border border-gray-300 font-bold focus:ring-green-500 focus:border-green-500 focus:bg-green-50 text-gray-900 text-sm  block w-full p-2.5 ="
      @focus="scrollToView" />
  </div>
</template>

<script setup>
import { nextTick } from 'vue';

const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
  label: {
    type: String,
    default: " ",
    required: false,
  },
  modelValue: {
    required: false,
    type: [String, Number, Boolean, Date],
    default: "",
  },
  type: {
    type: String,
    required: false,
    default: "text",
  },
  readonly: Boolean,
  skip: {
    type: Boolean,
    default: false,
  },
  error: {
    type: Boolean,
    default: false,
  },
  nolabel: {
    type: Boolean,
    default: false,
  },
  cap: {
    type: Boolean,
    default: false,
  },
  skipnext: {
    type: Boolean,
    default: false,
  },
  center: {
    type: Boolean,
    default: false,
  }
  ,
  holder: {
    type: String,
    required: false,
    default: "",
  }
});

const value_toUpperCase = (target) => {
  let value = target.value;

  if (props.cap) {
    value = value.toUpperCase();
  }

  // Save cursor position before update
  const start = target.selectionStart;
  const end = target.selectionEnd;

  emit('update:modelValue', value);

  // Restore cursor position after DOM update
  nextTick(() => {
    const selectableTypes = ['text', 'search', 'tel', 'url', 'password', 'email'];
    if (selectableTypes.includes(props.type)) {
      try {
        target.setSelectionRange(start, end);
      } catch (err) {
        console.warn('setSelectionRange failed:', err);
      }
    }
  });

}

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
const handleTab = (event) => {
  if (props.type === 'date' && !event.shiftKey) {
    event.preventDefault();
    focusNextInput(event);

  }
};

const focusNextInput = (event) => {
  if (props.skipnext) {
    return;
  }
  event.preventDefault();

  // Select only focusable elements (input, button, and elements with tabindex >= 0)
  const inputs = Array.from(document.querySelectorAll('input, button, [tabindex]'))
    .filter(input => input.tabIndex >= 0);

  const index = inputs.indexOf(event.target);
  if (index >= 0 && index < inputs.length - 1) {
    inputs[index + 1].focus();
  }
}

// Scroll to the focused input
const scrollToView = (event) => {
  nextTick(() => {
    event.target.scrollIntoView({
      behavior: "smooth",   // Smooth scrolling
      block: "center",      // Scroll to center of the screen
      inline: "nearest"     // Scroll inline if necessary
    });
  });
}
</script>
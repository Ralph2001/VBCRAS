<template>
  <div>
    <label v-if="!nolabel" :for="label" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{ label }}
      <span v-if="error" class="text-red-600">*</span></label>
    <input @keydown.enter="focusNextInput" @keydown.down="focusNextInput" @keydown.up="focusPreviousInput" :type="type"
      :id="label" :value="modelValue" @input="value_toUpperCase($event.target)" :tabindex="skip ? '-1' : ''"
      :readonly="readonly" :class="{
        'border-red-400 focus:ring-red-500 focus:border-red-500 focus:bg-red-50': error,
        'focus:ring-green-500 focus:border-green-500 focus:bg-green-50': !error,
        'flex items-center text-center': center
      }"
      class="bg-gray-50 tracking-wide rounded read-only:bg-gray-100 read-only:text-gray-400 read-only:focus-within:bg-gray-100 read-only:focus-within:ring-gray-300 read-only:focus-within:border-gray-200 border border-gray-300 font-bold focus:ring-green-500 focus:border-green-500 focus:bg-green-50 text-gray-900 text-sm  block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500" />
  </div>
</template>

<script setup>
import { nextTick } from 'vue';  // Import nextTick function from Vue

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
    target.setSelectionRange(start, end);
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
const focusNextInput = (event) => {
  if (props.skipnext) {
    return
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

</script>
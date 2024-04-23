<template>
  <div>
    <label
      v-if="!nolabel"
      :for="label"
      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >{{ label }} <span class="text-red-500" v-if="error">*</span></label
    >
    <input
      :type="type"
      :id="label"
      :value="formattedValue"
      @change="handleInput($event.target.value)"
      :tabindex="skip ? '-1' : ''"
      :readonly="readonly"
      :class="{
        'border-red-400 focus:ring-red-500 focus:border-red-500 focus:bg-red-50': error,
        'focus:ring-green-500 focus:border-green-500 focus:bg-green-50': !error,
      }"
      class="bg-gray-50 read-only:bg-gray-100 read-only:text-gray-400 read-only:focus-within:bg-gray-100 read-only:focus-within:ring-gray-300 read-only:focus-within:border-gray-200 border border-gray-300 font-bold focus:ring-green-500 focus:border-green-500 focus:bg-green-50 text-gray-900 text-sm rounded-sm block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";

const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
  label: {
    type: String,
    default: " ",
    required: false,
  },
  modelValue: {
    type: [String, Number],
    default: "",
  },
  type: {
    type: String,
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
});

const formattedValue = ref(formatCurrency(props.modelValue));

function formatCurrency(value) {
  const numberValue = parseFloat(value);
  if (isNaN(numberValue)) {
    return "";
  }

  return new Intl.NumberFormat("fil-PH", {
    style: "currency",
    currency: "PHP",
  }).format(numberValue);
}

function handleInput(newValue) {
  formattedValue.value = formatCurrency(newValue);
  emit("update:modelValue", formattedValue.value);
}
</script>

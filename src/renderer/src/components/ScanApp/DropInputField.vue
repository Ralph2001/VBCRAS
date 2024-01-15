<template>
  <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
    {{ label }}
  </label>
  <input
    :type="type"
    :id="id"
    :value="modelValue"
    :class="className"
    @input="$emit('update:modelValue', $event.target.value)"
    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm font-semibold rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
  />
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  type: {
    type: String,
    default: "text",
  },
  className:{
    type: String,
  },
  id: {
    type: String,
    default: "",
  },
  modelValue: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "label",
  },
});
</script>

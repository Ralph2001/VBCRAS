<template>
  <div class="flex items-center">
    <input
      :id="id"
      type="checkbox"
      :checked="modelValue"
      :class="{
        'border-red-400 focus:ring-red-500 focus:border-red-500 focus:bg-red-50': error,
      }"
      @change="$emit('update:modelValue', !modelValue)"
      class="w-8 h-6 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
    />
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  id: {
    type: String,
    default: "default-checkbox",
  },
  modelValue: {
    type: Boolean,
    default: false,
  },
  error: Boolean,
});

const emit = defineEmits(["update:modelValue"]);
</script>

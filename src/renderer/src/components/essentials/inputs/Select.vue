<template>
  <div class="w-[10rem]">
    <label
      for="countries"
      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >{{ label }} <span v-if="error" class="text-red-600">*</span></label
    >
    <select
      id="countries"
      @change="emit('update:modelValue', $event.target.value)"
      :tabindex="skip ? '-1' : ''"
      :class="{
        'border-red-400 focus:ring-red-500 focus:border-red-500 focus:bg-red-50': error,
        'focus:ring-green-500 focus:border-green-500 focus:bg-green-50': !error,
      }"
      class="bg-gray-50 border font-bold border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    >
      <option selected disabled></option>
      <option
        v-for="option in options"
        :key="option"
        :value="option"
        :selected="modelValue === option"
      >
        {{ option }}
      </option>
    </select>
  </div>
</template>

<script setup>
const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  options: {
    type: [Object, Array],
    required: true,
  },
  label: String,
  modelValue: {
    type: String,
    required: true,
  },
  skip: Boolean,
  error: Boolean,
});
</script>

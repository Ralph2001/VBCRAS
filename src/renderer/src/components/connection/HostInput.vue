<template>
  <div class="w-[20rem]">
    <label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{ label }}</label>
    <input type="text" id="first_name" @change="hostAddress" autofocus
      :class="{ 'bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500': error }"
      class="bg-gray-50 font-bold border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      required>
    <ul v-if="error"
      class="max-w-md space-y-1 mt-2 text-red-500  text-sm font-semibold list-disc list-inside dark:text-gray-400">
      <li>
        {{ errormessage }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { defineProps, ref, defineEmits } from 'vue';

const emit = defineEmits(['hostInput'])

const hostAddress = (e) => {
  emit('hostInput', e.target.value)
}
const props = defineProps({
  label: {
    type: String,
    required: true
  },
  error: {
    type: Boolean,
    default: false
  },
  errormessage: {
    type: String,
    default: null
  }
})
</script>


<template>
  <div>
    <label :for="id" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" >
      <p v-if="Province">Province <span v-if="error" class="text-red-600">*</span></p>
      <p v-if="City">City/Municipality <span v-if="error" class="text-red-600">*</span></p>
      <p v-if="Barangay">Barangay <span v-if="error" class="text-red-600">*</span></p>
    </label>

    <select
      :id="id"
      @change="emit('update:modelValue', $event.target.value)"
      :class="{
        'border-red-400 focus:ring-red-500 focus:border-red-500 focus:bg-red-50': error,
        'focus:ring-green-500 focus:border-green-500 focus:bg-green-50': !error,
      }"
      class="bg-gray-50 border font-bold border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    >
      <option disabled selected></option>
      <option
        class="font-medium"
        v-if="Province || City"
        v-for="(value, key) in options"
        :value="key"
        :key="key"
      >
        {{ key }}
      </option>
      <option
        class="font-medium"
        v-if="Barangay"
        v-for="(value, key) in options"
        :value="value"
        :key="key"
      >
        {{ value }}
      </option>
    </select>
  </div>
</template>

<script setup>
const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
  id: String,
  options: {
    type: [Array, Object],
    required: false,
  },
  Province: {
    type: Boolean,
    default: false,
  },
  City: {
    type: Boolean,
    default: false,
  },
  Barangay: {
    type: Boolean,
    default: false,
  },
  error: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div class="flex items-center" v-for="(value, key) in options" :key="key">
    <input type="radio"  :checked="key === props.modelValue" :value="key" :name="name" :class="{
      'border-red-400   active:border-blue-500': error,
      'focus:ring-blue-500': !error,
    }" @input="update_"
      class="w-4 h-4 text-blue-600 rounded bg-gray-100 border-gray-300 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
    <label class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">{{ value }} <span v-if="error && nolabel"
        class="text-red-600">*</span></label>
  </div>
</template>

<script setup>

const emit = defineEmits(["update:modelValue", 'change_']);

const update_ = (e) => {
  emit('update:modelValue', e.target.value)
  emit('change_')
}


const props = defineProps({
  options: {
    type: [Object, Array],
    required: true,
  },
  name: String,
  modelValue: {
    required: false,
    type: [String, Number],
    default: "",
  },
  error: Boolean,
  nolabel: {
    type: Boolean,
    default: false,
  },
  for: {
    type: [String, Number],
  },
});

</script>

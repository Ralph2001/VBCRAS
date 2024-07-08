<template>
  <div class="w-full flex flex-col">
    <label class="text-sm font-semibold tracking-wide mb-2" :for="label">{{ label }}</label>
    <input :id="label" type="text" :value="modelValue" @change="validateInput($event.target.value)"
      class="border border-gray-300 rounded placeholder:text-sm bg-gray-50 font-semibold ring-0 outline-none focus:ring-green-500 focus:bg-green-50 focus:border-green-500"
      placeholder="mm/dd/yyyy" />
  </div>
</template>

<script setup>
import { format } from 'date-fns';


const emit = defineEmits(["update:modelValue"]);

const validateInput = (e) => {
  if (e === "Now" || e === "now") {
    const date = format(new Date(), 'MMMM dd, yyyy')
    emit('update:modelValue', date)
    return
  }
  const date = format(new Date(e), 'MMMM dd, yyyy')
  emit('update:modelValue', date)
}

const props = defineProps({
  label: String,
  modelValue: String
});
</script>

<style lang="scss" scoped></style>

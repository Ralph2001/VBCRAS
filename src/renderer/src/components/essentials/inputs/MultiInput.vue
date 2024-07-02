<template>
  <div class="flex flex-row sm:w-[80%] md:lg:w-[60%] relative">
    <input
      :value="props.type"
      disabled
      class="bg-blue-100 select-none border border-e-0 font-bold text-gray-500 text-sm focus:ring-green-500 focus:border-green-500 block w-full active:ring-green-500 p-2.5"
    />

    <input
      :value="props.petition_number_value"
      @input="$emit('petitionNumber', $event.target.value)"
      class="bg-gray-50 border border-s-0 border-e-0 items-center font-bold text-gray-800 text-sm focus:ring-green-500 focus:border-green-500 flex justify-center text-center w-full active:ring-green-500 p-2.5"
    />

    <input
      @input="$emit('yearInput', $event.target.value)"
      :class="[props.isRa10172 === '10172' ? 'border-e-transparent' : '']"
      v-model="year"
      class="bg-gray-50 border border-s-0 font-bold text-gray-500 text-sm focus:ring-green-500 focus:border-green-500 flex justify-center text-center w-full active:ring-green-500 p-2.5"
    />
    <input
      value="R.A. 10172"
      disabled
      v-if="props.isRa10172 === '10172'"
      class="border font-bold border-s-transparent bg-yellow-200 select-none text-gray-500 text-sm focus:ring-green-500 focus:border-green-500 w-full flex justify-center text-center active:ring-green-500 p-2.5"
    />
  </div>
</template>
<script setup>
import { ref } from "vue";

const type = ref();
const petition_number = ref();
const ra10172 = ref();
const date = new Date();
const year = ref(date.getFullYear());

const props = defineProps({
  type: String,
  isRa10172: String,
  modelValue: String,
  petition_number_value: String,
});
</script>

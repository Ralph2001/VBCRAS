<template>
  <div class="flex flex-row sm:w-[80%] md:lg:w-[60%] relative">
    <input :value="props.type" disabled
      class="bg-blue-100 select-none border border-e-0 font-bold text-gray-500 text-sm focus:ring-green-500 focus:border-green-500 block w-full active:ring-green-500 p-2.5" />

    <input :tabindex="skip ? '-1' : '0'" :value="props.petition_number_value"
      @input="input_petition_number($event.target.value)"
      class="bg-gray-50 border outline-none ring-0   border-s-0 border-e-0 items-center font-bold text-gray-800 text-sm focus:ring-green-500 focus:border-green-500 flex justify-center text-center w-full active:ring-green-500 p-2.5" />

    <input :tabindex="skip ? '-1' : '0'" @input="emit('type-year', $event.target.value)"
      :class="[props.republic_act === '10172' ? 'border-e-transparent' : '']" v-model="year"
      class="bg-gray-50 border outline-none ring-0  border-s-0 font-semibold text-gray-500 text-sm focus:ring-green-500 focus:border-green-500 flex justify-center text-center w-full active:ring-green-500 p-2.5" />
    <input value="R.A. 10172" disabled v-if="props.republic_act === '10172'"
      class="border font-bold border-s-transparent bg-yellow-200 select-none text-gray-500 text-sm focus:ring-green-500 focus:border-green-500 w-full flex justify-center text-center active:ring-green-500 p-2.5" />
  </div>
</template>
<script setup>
import { ref } from "vue";

const emit = defineEmits(['type-petition-number', 'type-year'])

const date = new Date();
const year = ref(date.getFullYear());

const props = defineProps({
  type: String,
  republic_act: String,
  modelValue: String,
  petition_number_value: String,
  skip: Boolean
});


const input_petition_number = (e) => {
  emit('type-petition-number', e)
}

</script>

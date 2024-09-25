<template>
  <div class="grid grid-cols-4 sm:px-5 md:lg:px-20 relative">
    <input :value="type" disabled :class="[props.type === 'CCE' ? 'bg-[#4A90E2]' : 'bg-[#2C7A7B]']"
      class=" select-none border border-e-0 font-bold text-sm block w-full text-white  p-2.5" />

    <input  :value="props.petition_number_value"
      @input="input_petition_number($event.target.value)"
      class="bg-gray-50 border outline-none ring-0   border-s-0 border-e-0 items-center font-bold text-gray-800 text-sm focus:ring-green-500 focus:border-green-500 flex justify-center text-center w-full active:ring-green-500 p-2.5" />

    <input disabled :tabindex="skip ? '-1' : '0'" @input="emit('type-year', $event.target.value)"
      :class="[props.republic_act === '10172' ? 'border-e-transparent' : '']" v-model="year"
      class="bg-gray-50 border outline-none ring-0  border-s-0 font-bold text-gray-800 text-sm focus:ring-green-500 focus:border-green-500 flex justify-center text-center w-full active:ring-green-500 p-2.5" />
    <input value="R.A. 10172" disabled v-if="props.republic_act === '10172'"
      class="border font-bold border-s-transparent bg-gray-200 select-none text-gray-500 text-sm focus:ring-green-500 focus:border-green-500 w-full flex justify-center text-center active:ring-green-500 p-2.5" />
  </div>
</template>
<script setup>
import { computed, ref } from "vue";

const emit = defineEmits(['type-petition-number', 'type-year'])

const date = new Date();
const year = ref(date.getFullYear());

const props = defineProps({
  type: String,
  republic_act: String,
  modelValue: String,
  petition_number_value: String,
  skip: Boolean,
  migrant: Boolean
});


const type = computed(() => {
  if(props.migrant){
    return 'MP' + props.type
  }
  return props.type
})

const input_petition_number = (e) => {
  emit('type-petition-number', e)
}

</script>

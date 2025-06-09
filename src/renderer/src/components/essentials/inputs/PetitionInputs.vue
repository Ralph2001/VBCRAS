<template>
  <div class="grid grid-cols-4 sm:px-5 md:lg:px-20 relative">
    <input :value="type" disabled :class="[props.type === 'CCE' ? 'bg-[#4A90E2]' : 'bg-[#2C7A7B]']"
      class=" select-none border border-e-0 font-bold text-sm block w-full text-white  p-2.5" />

    <input @keydown.tab="handleTab" @keydown.enter="focusNextInput" @keydown.up="focusPreviousInput"
      @keydown.down="focusNextInput" :value="props.petition_number_value"
      @input="input_petition_number($event.target.value)" ref="input"
      class="bg-gray-50 border outline-none ring-0   border-s-0 border-e-0 items-center font-bold text-gray-800 text-sm border-t-2 border-b-2 focus:ring-green-500 focus:border-green-500 flex justify-center text-center w-full active:ring-green-500 p-2.5" />

    <input disabled :tabindex="skip ? '-1' : '0'" @input="emit('type-year', $event.target.value)"
      :class="[props.republic_act === '10172' ? 'border-e-transparent' : '']" v-model="year"
      class=" border  disabled:cursor-not-allowed disabled:bg-gray-200 outline-none ring-0  border-s-0 font-bold text-gray-800 text-sm focus:ring-green-500 focus:border-green-500 flex justify-center text-center w-full active:ring-green-500 p-2.5" />
    <input value="R.A. 10172" disabled v-if="props.republic_act === '10172'"
      class="border font-bold disabled:cursor-not-allowed border-s-transparent bg-gray-200 select-none text-gray-500 text-sm focus:ring-green-500 focus:border-green-500 w-full flex justify-center text-center active:ring-green-500 p-2.5" />
  </div>
</template>
<script setup>
import { computed, onMounted, ref } from "vue";

const emit = defineEmits(['type-petition-number', 'type-year'])
const input = ref(null);

onMounted(() => {

  input.value.focus();

});

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
  if (props.migrant) {
    return 'MP' + props.type
  }
  return props.type
})

const input_petition_number = (e) => {
  emit('type-petition-number', e)
}

const focusPreviousInput = (event) => {
  event.preventDefault();

  // Select only focusable elements (input, button, and elements with tabindex >= 0)
  const inputs = Array.from(document.querySelectorAll('input, button, [tabindex]'))
    .filter(input => input.tabIndex >= 0);

  const index = inputs.indexOf(event.target);
  if (index > 0) {
    inputs[index - 1].focus();
  }
}
const handleTab = (event) => {
  if (props.type === 'date' && !event.shiftKey) {
    event.preventDefault();
    focusNextInput(event);

  }
};

const focusNextInput = (event) => {
  if (props.skipnext) {
    return;
  }
  event.preventDefault();

  // Select only focusable elements (input, button, and elements with tabindex >= 0)
  const inputs = Array.from(document.querySelectorAll('input, button, [tabindex]'))
    .filter(input => input.tabIndex >= 0);

  const index = inputs.indexOf(event.target);
  if (index >= 0 && index < inputs.length - 1) {
    inputs[index + 1].focus();
  }
}


</script>

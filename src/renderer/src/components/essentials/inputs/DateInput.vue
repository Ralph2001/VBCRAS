<template>
  <div class="w-full flex flex-col">
    <label class="text-sm font-semibold tracking-wide mb-2" :for="label">{{ label }}</label>
    <input  :tabindex="skip ? '-1' : ''" :id="label" type="text" :value="modelValue" @input="handleInput($event.target.value)"
      @blur="validateInput($event.target.value)"
      class="border border-gray-300 rounded placeholder:text-sm bg-gray-50 font-bold text-sm py-2.5 text-gray-800 ring-0 outline-none focus:ring-green-500 focus:bg-green-50 focus:border-green-500"
      placeholder="mm/dd/yyyy" />
  </div>
</template>

<script setup>
import { format } from 'date-fns';


const emit = defineEmits(["update:modelValue"]);


function formatDate(value) {

  const isWhatType = /^\w/.test(value) && !/^\d/.test(value);

  if (isWhatType) {
    return value
  }

  const input = value.replace(/\D\/$/g, '');
  const values = input.split('/').map(v => v.replace(/\D/g, '').slice(0, 2));

  if (values[0] = checkValue(values[0], 12));
  if (values[1]) values[1] = checkValue(values[1], 31);


  const formatted = values.map((v, i) => (v.length === 2 && i < 2 ? `${v}/` : v));
  return formatted.join('').slice(0, 14);

}


function checkValue(str, max) {
  if (str.charAt(0) !== '0' || str == '00') {
    var num = parseInt(str);
    if (isNaN(num) || num <= 0 || num > max) num = 1;
    str = num > parseInt(max.toString().charAt(0)) && num.toString().length == 1 ? '0' + num : num.toString();
  };
  return str;
};


const handleInput = (e) => {
  emit('update:modelValue', formatDate(e));
};



const validateInput = (e) => {
  if (e === '' || e == null) {
    return
  }
  const date = format(new Date(e.trim()), 'MMMM dd, yyyy')
  emit('update:modelValue', date)
}

const props = defineProps({
  label: String,
  modelValue: String,
  skip: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss" scoped></style>

<template>
  <div class="relative w-full">
    <label
      :for="label"
      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >{{ label }} <span v-if="error" class="text-red-600">*</span></label
    >
    <input
      type="text"
      :readonly="readonly"
      ref="input"
      :id="label"
      :value="modelValue"
      @input="onChange"
      :tabindex="skip ? '-1' : ''"
      @keydown.down="ArrowDown"
      @keydown.up="ArrowUp"
      @keydown.enter="Enter"
      @keydown.tab="Tab"
      :class="{
        'border-red-400 focus:ring-red-500 focus:border-red-500 focus:bg-red-50': error,
        'focus:ring-green-500 focus:border-green-500 focus:bg-green-50': !error,
      }"
      class="bg-gray-50 read-only:text-gray-400 read-only:bg-gray-100 read-only:focus-within:bg-gray-100 read-only:focus-within:ring-gray-300 read-only:focus-within:border-gray-200 border border-gray-300 font-bold focus:ring-green-500 focus:border-green-500 focus:bg-green-50 text-gray-900 text-sm rounded-sm block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
    />
    <ul
      v-if="isOpen && props.modelValue && results.length"
      class="absolute shadow z-50 bg-white w-full border p-1 h-auto"
    >
      <li
        v-for="(result, i) in results"
        :key="i"
        :class="{ 'bg-blue-100': i === arrowCounter }"
        class="p-3 cursor-pointer hover:bg-blue-100 w-full font-semibold text-sm"
        @click="setResult(result)"
      >
        {{ result }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { onKeyStroke, onClickOutside } from "@vueuse/core";

const input = ref("");

function ArrowDown() {
  if (arrowCounter.value < results.value.length) {
    arrowCounter.value++;
    changeValue(results.value[arrowCounter.value]);
  }
}
function ArrowUp() {
  if (arrowCounter.value > 0) {
    arrowCounter.value--;
    changeValue(results.value[arrowCounter.value]);
  }
}

function Enter() {
  changeValue(results.value[arrowCounter.value]);
  isOpen.value = false;
  arrowCounter.value = -1;
}
function Tab() {
  isOpen.value = false;
  arrowCounter.value = -1;
}

function changeValue(val) {
  emit("update:modelValue", val);
}

const search = ref("");
const isOpen = ref(false);
const results = ref([]);
const arrowCounter = ref(-1);

onClickOutside(input, (event) => (isOpen.value = false));

const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
  label: String,
  readonly: Boolean,
  skip: {
    type: Boolean,
    default: false,
  },
  items: {
    type: Array,
    required: false,
  },
  readonly: Boolean,
  modelValue: {
    required: false,
    type: [String, Number],
    default: "",
  },
  error: Boolean,
});

function filterResults() {
  results.value = props.items.filter(
    (item) => item.toLowerCase().indexOf(props.modelValue.toLowerCase()) > -1
  );
}

function onChange(e) {
  filterResults();
  isOpen.value = true;
  emit("update:modelValue", e.target.value);
}

function setResult(result) {
  isOpen.value = false;
  emit("update:modelValue", result);
}
</script>

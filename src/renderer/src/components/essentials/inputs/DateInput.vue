<template>
  <div class="w-full">
    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{
      props.label
    }}</label>
    <div class="flex flex-row gap-[0.05rem]">
      <input
        v-model="month"
        :onblur="validateMonth"
        class="w-[50%] border rounded-s-sm border-gray-300 text-sm font-semibold placeholder:text-xs"
        type="text"
        placeholder="Month"
      />
      <input
        ref="ref_day"
        v-model="day"
        :onblur="validateDay"
        maxlength="2"
        class="w-[50%] border border-gray-300 text-sm font-semibold placeholder:text-xs"
        type="text"
        placeholder="Day"
      />
      <input
        ref="ref_year"
        v-model="year"
        class="w-[50%] border border-gray-300 text-sm font-semibold rounded-e-sm placeholder:text-xs"
        type="text"
        placeholder="Year"
      />
    </div>
  </div>
</template>

<script setup>
// import { esbuildVersion } from "vite";
import { ref, watch } from "vue";

const day = ref();
const year = ref();
const month = ref();
const ref_day = ref();
const ref_year = ref();

const props = defineProps({
  label: {
    type: String,
    default: "",
  },
});

const months = ref([
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]);

const month_num = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
];

const validateMonth = () => {
  if (month.value === null && month.value === "") {
    return;
  }
  const validate = months.value.some(
    (item) => item.toLowerCase() === month.value.toLowerCase()
  );
  if (!validate) {
    month.value = "";
  }
  month.value = month.value.charAt(0).toUpperCase() + month.value.slice(1);
};

const validateDay = () => {
  const year = new Date().getFullYear();
  const month = new Date().getMonth();
  const maxDate = new Date(year, month + 1, 0).getDate();

  const split = day.value.split("");
  if (day.value > maxDate) {
    day.value = "";
  }
  if (split.length == 1) {
    day.value = 0 + day.value;
  }
};

watch(day, (dayvalue) => {
  const year = new Date().getFullYear();
  const month = new Date().getMonth();
  const maxDate = new Date(year, month + 1, 0).getDate();

  const split = dayvalue.split("");
  if (split.length >= 2 && dayvalue <= maxDate) {
    ref_year.value.focus();
  }
});

watch(month, (monthvalue) => {
  const isToNext = months.value.some(
    (item) => item.toLowerCase() === month.value.toLowerCase()
  );
  if (isToNext) {
    ref_day.value.focus();
  }
});
</script>

<style lang="scss" scoped></style>

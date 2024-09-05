<style></style>

<template>

  <div v-if="isMenuVisible"
    class="fixed top-0 bottom-0 right-0 left-0 w-full  h-full flex flex-col justify-center items-center z-[99999] backdrop-blur-sm backdrop-brightness-50">
    <div class="absolute top-0 right-0 p-10 font-mono text-gray-200">
      Crtl + F to close
    </div>
    <p class="text-2xl uppercase font-mono text-white px-2 rounded-sm font-medium">
      All Links
    </p>
    <div class="sm:w-full md:lg:w-[45%] h-auto flex flex-wrap  items-center p-4 gap-2" @click="isMenuVisible = false">
      <router-link active-class="border-green-400 border-2" inactive-class="bg-blue-400" v-for="item in data"
        :to="item.link"
        class=" grow duration-300 text-start shadow-lg border text-sm grid grid-rows-2 font-medium text-wrap tracking-wider p-4 rounded-sm h-[9em]  hover:bg-gray-200 bg-white">
        <p class="text-gray-800 text-md "> {{ item.title }}</p>
        <div>
          <p v-for="list in item.text" @click="isMenuVisible = false"
            class="text-gray-600 font-normal font-mono text-xs text-start">
            {{ list }}
          </p>
        </div>
      </router-link>
    </div>
  </div>

</template>

<script setup>
import { onKeyStroke } from "@vueuse/core";
import { ref } from "vue";
import MenuButton from "./essentials/menu/MenuButton.vue";
const isMenuVisible = ref(false);

const isCtrlF = (event) => event.ctrlKey && (event.key === "f" || event.key === "F");
onKeyStroke(isCtrlF, (event) => {
  event.preventDefault();
  isMenuVisible.value = !isMenuVisible.value;
  console.log(isMenuVisible.value);
});

const data = ref([
  {
    title: "Home", text: [
      'Return Home',
    ], link: "/pages/welcome"
  },
  {
    title: "CCE & CFN",
    text: [
      'Republic Act. 10172 & Republic Act. 9048',
      'Correction of Clerical Error',
      'Change of First Name',

    ],
    link: "/pages/cce",
  },
  {
    title: "Forms", text:
      [
        'Form 1 (Birth Available, Birth-not-available, Birth Destroyed)',
        'Form 2 (Death Available, Death-not-available, Death Destroyed)',
        'Form 3 (Marriage Available, Marriage-not-available, Marriage Destroyed)'
      ],
    link: "/pages/forms"
  },
  {
    title: "AFFIDAVIT TO USE THE SURNAME OF THE FATHER", text:
      [
        'AUSF',
      ],
    link: "/pages/ausf"
  },
  {
    title: "Registry Record",
    text: [
      'All Registry Records',
    ],
    link: "/pages/data_record",
  },
  {
    title: "Scanned Documents", text: [
      'All Scanned Documents',
    ], link: "/pages/scanned"
  },
]);
</script>

<style lang="scss" scoped></style>

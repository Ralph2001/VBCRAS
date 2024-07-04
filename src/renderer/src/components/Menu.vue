<template>
  <Transition mode="out-in">
    <div
      v-if="isMenuVisible"
      class="fixed top-0 bottom-0 right-0 left-0 w-full h-full flex flex-col justify-center items-center z-[99999] backdrop-blur-sm backdrop-brightness-50"
    >
      <div class="absolute top-0 right-0 p-10 font-mono text-gray-200">
        Crtl + F to close
      </div>
      <p class="text-2xl uppercase font-mono text-white px-2 rounded-sm font-medium">
        All Links
      </p>
      <div class="w-[45%] h-auto flex flex-wrap items-center p-4 gap-2">
        <router-link
          @click="isMenuVisible = false"
          v-for="item in data"
          active-class="border-blue-500 bg-gray-300"
          :to="item.link"
          class="hover:border-blue-500 bg-white grow border-2 border-gray-600 duration-300 text-start shadow-md text-sm grid grid-rows-2 font-medium text-wrap tracking-wider p-4 rounded h-[10rem] text-gray-900 hover:bg-gray-200"
        >
          {{ item.title }}
          <p
            @click="isMenuVisible = false"
            class="text-gray-500 font-normal font-mono text-xs text-start"
          >
            {{ item.text }}
          </p>
        </router-link>
      </div>
    </div>
  </Transition>
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
  { title: "Home", text: "Return Home", link: "/client/welcome" },
  {
    title: "CCE & CFN",
    text: "Correction in Clerrical Error and Change  of First Name ",
    link: "/client/cce",
  },
  { title: "Forms", text: "Create 1(A,B,C), 2(A,B,C), 3(A,B,C) ", link: "/client/forms" },
  {
    title: "Registry Record",
    text: "All Registry Records Here",
    link: "/client/data_record",
  },
  { title: "Scanned Documents", text: "All Scanned Documents", link: "/client/scanned" },
]);
</script>

<style lang="scss" scoped></style>

<template>
  <div v-if="isMenuVisible"
    class="fixed inset-0 z-[99999] backdrop-blur-md bg-black/40 flex items-center justify-center px-6 py-10">
    <!-- Shortcut Info -->
    <div class="absolute top-6 right-6 text-xs text-white/70 font-mono">
      Press <kbd class="kbd">Ctrl</kbd> + <kbd class="kbd">F</kbd> to close
    </div>

    <!-- Modal Box -->
    <div class="w-full max-w-5xl  p-8 transition-all">
      <h2 class="text-center text-2xl sm:text-3xl font-semibold text-gray-900 tracking-wide mb-8">
        Navigation Menu
      </h2>

      <!-- Menu Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" @click="isMenuVisible = false">
        <router-link v-for="item in data" :key="item.title" :to="item.link"
          class="group bg-white rounded-2xl h-32 border border-gray-200 hover:border-blue-500 shadow-sm hover:shadow-md transition duration-200 p-6 flex items-center justify-center text-center">
          <p class="text-base sm:text-lg font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
            {{ item.title }}
          </p>
        </router-link>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { onKeyStroke } from "@vueuse/core";

const isMenuVisible = ref(false);

const isCtrlF = (event) => event.ctrlKey && (event.key === "f" || event.key === "F");
onKeyStroke(isCtrlF, (event) => {
  event.preventDefault();
  isMenuVisible.value = !isMenuVisible.value;
});

const data = ref([
  {
    title: "Home",
    link: "/pages/welcome",
  },
  {
    title: "Correction",
    link: "/pages/cce",
  },
  {
    title: "Local Copy / Forms",
    link: "/pages/forms",
  },
  {
    title: "Application for Marriage License",
    link: "/pages/marriage-license",
  },
  {
    title: "Scanned Documents",
    link: "/pages/scanned",
  },
]);
</script>

<style>
.kbd {
  @apply inline-block px-1.5 py-0.5 bg-gray-800 text-white text-xs rounded shadow-sm;
}
</style>
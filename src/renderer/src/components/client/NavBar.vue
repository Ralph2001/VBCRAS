<template>
  <div>
    <nav class="bg-[#0D1B2A] shadow-lg text-sm font-sans tracking-tighter border-gray-200">
      <div class="max-w-screen-2xl mx-auto p-2 flex items-center justify-between relative">
        <router-link to="/pages/welcome" class="flex items-center space-x-3">
          <span class="text-lg font-semibold whitespace-nowrap text-gray-300">VBCRAS</span>
        </router-link>

        <!-- Burger Button (shown on small screens) -->
        <button @click="isMenuOpen = !isMenuOpen" class="text-gray-300 md:hidden focus:outline-none">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
            stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <!-- Main Menu -->
        <div
          :class="['flex-col md:flex-row md:flex', isMenuOpen ? 'flex' : 'hidden', 'md:items-center', 'w-full', 'md:w-auto', 'z-50', 'bg-[#0D1B2A]', 'md:bg-transparent', 'absolute', 'md:relative', 'top-full', 'left-0', 'md:top-auto', 'md:left-auto']">
          <ul
            class="flex flex-col md:flex-row gap-4 md:items-center   font-medium p-2 md:p-1   shadow-lg md:shadow-none">
            <li>
              <router-link to="/pages/cce" active-class="text-white bg-[#1B263B]"
                class="p-2 h-10  w-24  hover:bg-[#1B263B]/50 text-neutral-200 rounded">Correction</router-link>
            </li>
            <li>
              <router-link to="/pages/forms" active-class="text-white bg-[#1B263B]"
                class="p-2 h-10  w-24 hover:bg-[#1B263B]/50 text-neutral-200 rounded">Forms</router-link>
            </li>
            <li>
              <router-link to="/pages/marriage-license" active-class="text-white bg-[#1B263B]"
                class="p-2 h-10  w-24 hover:bg-[#1B263B]/50 text-neutral-200 rounded">Marriage License</router-link>
            </li>
            <li>
              <router-link to="/pages/Legitimation" active-class="text-white bg-[#1B263B]"
                class="p-2 h-10  w-24 hover:bg-[#1B263B]/50 text-neutral-200 rounded">Legal Instrument</router-link>
            </li>
            <li>
              <router-link to="/pages/scanned" active-class="text-white bg-[#1B263B]"
                class="p-2 h-10  w-24 hover:bg-[#1B263B]/50 text-neutral-200 rounded">Scanned Documents</router-link>
            </li>
            <div class="hidden md:block h-full bg-[#1B263B] w-1"></div>
            <li class="ml-0 md:ml-2">
              <button @click="dropdownmenu" class="flex items-center w-full py-2 px-3 text-neutral-200">
                Menu
                <svg class="w-2.5 h-2.5 ml-2" viewBox="0 0 10 6" fill="none">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="m1 1 4 4 4-4" />
                </svg>
              </button>

              <div v-if="dropdown" ref="target"
                class="z-50 absolute mt-2 font-normal  md:right-0 bg-white border divide-y divide-gray-100 rounded-lg shadow w-44">
                <ul class="py-2 text-sm text-gray-700">
                  <li>
                    <button class="w-full px-4 py-2 hover:bg-gray-100">{{ auth.user }}</button>
                  </li>
                  <li>
                    <router-link to="/settings/dashboard"
                      class="w-full block px-4 py-2 hover:bg-gray-100 font-medium text-center">System
                      Overview</router-link>
                  </li>
                </ul>
                <button @click="logout"
                  class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-500 hover:text-white rounded-b-lg">
                  <font-awesome-icon icon="fa-solid fa-right-from-bracket" class="me-2" />
                  Sign out
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { initFlowbite } from "flowbite";
import { AuthStore } from "../../stores/Authentication";
import { onClickOutside } from "@vueuse/core";

const auth = AuthStore();
const dropdown = ref(false);
const isMenuOpen = ref(false);

const target = ref(null);
onClickOutside(target, () => dropdown.value = false);

const dropdownmenu = () => {
  dropdown.value = !dropdown.value;
};

const logout = () => {
  auth.logout();
};

onMounted(() => {
  initFlowbite();
  auth.isAuthenticated();
});
</script>

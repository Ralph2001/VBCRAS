<template>
  <div>
    <nav tabindex="-1"
      class="bg-white  shadow-sm text-sm font-sans tracking-tighter  border-gray-200 dark:bg-gray-900 dark:border-gray-700">
      <div tabindex="-1" class="w-full flex flex-wrap items-center justify-between mx-auto p-3.5 relative">
        <a tabindex="-1" href="#" class="flex items-center space-x-3 rtl:space-x-reverse">
          <img tabindex="-1" src="../../assets/logo.png" class="h-12" alt="Local Civil Registry" />
          <span tabindex="-1"
            class="self-center text-lg text-gray-800 font-semibold whitespace-nowrap dark:text-white">VBCRAS</span>
        </a>

        <!-- itong button ahhh -->
        <button type="button" ref="target"
          class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          @click="dropdownmenu">
          <span class="sr-only">Open main menu</span>
          <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M1 1h15M1 7h15M1 13h15" />
          </svg>
        </button>

        <div :class="{ hidden: !dropdown }" tabindex="-1" ref="target"
          class="w-full md:block md:w-auto absolute top-[3.5rem] md:static right-0 md:top-0 z-50">
          <ul tabindex="-1"
            class="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-200 rounded bg-gray-50 shadow-lg md:shadow-none md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <router-link tabindex="-1" to="/client/welcome"
                active-class="text-white bg-blue-700 hover:bg-blue-600 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500 dark:bg-blue-600 md:dark:bg-transparent"
                class=" block py-2 px-3 text-gray-900 rounded md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                Home
              </router-link>
            </li>

            <li>
              <router-link tabindex="-1" to="/client/cce"
                active-class="text-white bg-blue-700 hover:bg-blue-600  rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500 dark:bg-blue-600 md:dark:bg-transparent"
                class="  block py-2 px-3 text-gray-900 rounded md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                Correction in Clerical Error & Change of First Name
              </router-link>
            </li>
            <li>
              <router-link tabindex="-1" to="/client/forms"
                active-class="text-white bg-blue-700 hover:bg-blue-600  rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500 dark:bg-blue-600 md:dark:bg-transparent"
                class="block py-2 px-3 text-gray-900 rounded md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                Forms
              </router-link>
            </li>
            <li>
              <router-link tabindex="-1" to="/client/data_record"
                active-class="text-white bg-blue-700 hover:bg-blue-600  rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500 dark:bg-blue-600 md:dark:bg-transparent"
                class="block py-2 px-3 text-gray-900 rounded md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                Registry Record
              </router-link>
            </li>
            <li v-if="auth.user_details.permissions.scanned">
              <router-link tabindex="-1" to="/client/scanned"
                active-class="text-white bg-blue-700 hover:bg-blue-600  rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500 dark:bg-blue-600 md:dark:bg-transparent"
                class="block py-2 px-3 text-gray-900 rounded md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                Scanned Documents
              </router-link>
            </li>

            <li>
              <button tabindex="-1" id="dropdownNavbarLink" data-dropdown-toggle="dropdownNavbar"
                class="flex items-center justify-between w-full py-2 px-3 text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white dark:hover:bg-gray-700 md:dark:hover:bg-transparent">
                Menu
                <svg class="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 10 6">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="m1 1 4 4 4-4" />
                </svg>
              </button>

              <div id="dropdownNavbar"
                class="z-50 hidden absolute font-normal bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
                <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownLargeButton">
                  <li>
                    <button
                      class="w-full  text-left px-4 block py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                      <!-- <font-awesome-icon icon="fa-solid fa-user" class="me-2" /> -->
                      {{ auth.user }}
                    </button>
                  </li>
                  <li>
                    <a href="#"
                      class="items-center w-full block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                      <font-awesome-icon icon="fa-solid fa-gear" class="me-2" />
                      Settings</a>
                  </li>
                </ul>
                <div class="">
                  <button @click="logout()"
                    class="w-full text-left px-4 block py-2 text-sm text-gray-700 rounded-bl-lg rounded-br-lg dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white hover:bg-red-500 hover:text-white">
                    <font-awesome-icon icon="fa-solid fa-right-from-bracket" class="me-2" />
                    Sign out
                  </button>
                </div>

              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { initFlowbite } from "flowbite";
import { AuthStore } from "../../stores/clientAuth";
import { onClickOutside } from '@vueuse/core'

const auth = AuthStore();
const dropdown = ref(false);
const target = ref(null)
onClickOutside(target, event => dropdown.value = false)

const dropdownmenu = () => {
  dropdown.value = !dropdown.value;
};

const logout = () => {
  auth.UserLogout();
};


onMounted(() => {
  initFlowbite();
  auth.isAuthenticated();
});
</script>

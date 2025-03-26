<template>
  <div>
    <nav tabindex="-1"
      class="bg-[#0D1B2A]  flex flex-row shadow-lg text-sm font-sans tracking-tighter  border-gray-200 ">
      <div tabindex="-1" class="w-full flex flex-row items-center  mx-auto p-2 relative">
        <router-link tabindex="-1" to="/pages/welcome" class="flex items-center space-x-3 rtl:space-x-reverse">
          <span tabindex="-1" class="self-center text-lg font-semibold whitespace-nowrap text-gray-300 ">VBCRAS</span>
        </router-link>



        <div class="w-auto ml-auto flex z-50">
          <ul tabindex="-1"
            class="flex flex-row  gap-2 items-center font-medium p-1 px-6  border-gray-200 rounded  shadow-lg  ">


            <li>
              <router-link tabindex="-1" to="/pages/cce" active-class="text-white bg-[#1B263B] "
                class="   p-4 h-7 w-fit    hover:bg-[#1B263B]/50 transition-all duration-100 flex items-center justify-center  text-neutral-200 hover:text-neutral-300  rounded">
                Correction
              </router-link>
            </li>
            <li>
              <router-link tabindex="-1" to="/pages/forms" active-class="text-white bg-[#1B263B] "
                class="   p-4 h-7 w-fit    hover:bg-[#1B263B]/50 transition-all duration-100 flex items-center justify-center  text-neutral-200 hover:text-neutral-300  rounded">
                Forms
              </router-link>

            </li>
            <li>
              <router-link tabindex="-1" to="/pages/marriage-license" active-class="text-white bg-[#1B263B] "
                class="   p-4 h-7 w-fit    hover:bg-[#1B263B]/50 transition-all duration-100 flex items-center justify-center  text-neutral-200 hover:text-neutral-300  rounded">
                Marriage License
              </router-link>

            </li>
            <li>
              <router-link tabindex="-1" to="/pages/Legitimation" active-class="text-white bg-[#1B263B] "
                class="   p-4 h-7 w-fit    hover:bg-[#1B263B]/50 transition-all duration-100 flex items-center justify-center  text-neutral-200 hover:text-neutral-300  rounded">
                Legitimation
              </router-link>

            </li>
            <!-- <li>
              <router-link tabindex="-1" to="/pages/supplemental" active-class="text-white bg-[#1B263B] "
                class="   p-4 h-7 w-fit    hover:bg-[#1B263B]/50 transition-all duration-100 flex items-center justify-center  text-neutral-200 hover:text-neutral-300  rounded">
                Supplemental
              </router-link>

            </li> -->
     
            <li>
              <router-link tabindex="-1" to="/pages/scanned" active-class="text-white bg-[#1B263B] "
                class="   p-4 h-7 w-fit    hover:bg-[#1B263B]/50 transition-all duration-100 flex items-center justify-center  text-neutral-200 hover:text-neutral-300  rounded">
                Scanned Documents
              </router-link>

            </li>

            <div class="block h-full bg-[#1B263B] w-1"></div>
            <li class="ml-2">
              <button tabindex="-1" id="dropdownNavbarLink" data-dropdown-toggle="dropdownNavbar"
                class="flex items-center justify-between w-full py-2 px-3 text-neutral-200  ">
                Menu
                <svg class="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 10 6">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="m1 1 4 4 4-4" />
                </svg>
              </button>

              <div id="dropdownNavbar"
                class="z-50 hidden absolute font-normal bg-white border divide-y divide-gray-100 rounded-lg shadow w-44 ">
                <ul class="py-2 text-sm text-gray-700 " aria-labelledby="dropdownLargeButton">

                  <li>
                    <button class="w-full  items-center px-4 block py-2 hover:bg-gray-100 ">
                      <!-- <font-awesome-icon icon="fa-solid fa-user" class="me-2" /> -->
                      {{ auth.user }}
                    </button>
                  </li>
                  <!-- <li>
                    <router-link to="/settings/dashboard"
                      class="w-full text-center  items-center px-4 block py-2 hover:bg-gray-100  font-medium">
                      Settings
                    </router-link>
                  </li> -->


                </ul>
                <div class="">
                  <button @click="logout()"
                    class="w-full text-left px-4 block py-2 text-sm text-gray-700 rounded-bl-lg rounded-br-lg  hover:bg-red-500 hover:text-white">
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
import { computed, onMounted, ref, version } from "vue";
import { initFlowbite } from "flowbite";
import { AuthStore } from "../../stores/Authentication";
import { onClickOutside } from '@vueuse/core'

const auth = AuthStore();
const dropdown = ref(false);
const target = ref(null)
onClickOutside(target, event => dropdown.value = false)

const dropdownmenu = () => {
  dropdown.value = !dropdown.value;
};

const logout = () => {
  auth.logout();
};


onMounted(async () => {
  initFlowbite();
  auth.isAuthenticated();


});
</script>

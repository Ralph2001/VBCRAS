<template>
    <aside id="sidebar-multi-level-sidebar"
        class="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar">
        <div class="h-full px-3 py-4 overflow-y-auto flex flex-col bg-gray-50 dark:bg-gray-800">
            <ul class="space-y-2 font-medium  h-full">
                <li>
                    <router-link to="/settings/dashboard" active-class="bg-blue-500 text-white group hover:bg-blue-600"
         
                        class="flex items-center p-2 text-gray-900 rounded  ">
                        <svg class="w-5 h-5  transition duration-75 " aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 21">
                            <path
                                d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                            <path
                                d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                        </svg>
                        <span class="ms-3">Dashboard</span>
                    </router-link>
                </li>
                <li class="items-center flex justify-center bg-gray-300 p-1">
                    <p class="text-sm text-gray-600">Configure</p>
                </li>

                <li>
                    <button @click="toggleDropdown('cceCFN')"
                        class="flex items-center w-full p-2 text-base text-gray-900  transition duration-75 rounded group hover:bg-gray-200 ">
                        <span class="flex-1 ms-3 text-left">CCE & CFN</span>
                        <svg class="w-3 h-3" aria-hidden="true" fill="none" viewBox="0 0 10 6">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="m1 1 4 4 4-4" />
                        </svg>
                    </button>
                    <ul v-show="dropdowns.cceCFN" class="py-2 space-y-2">
                        <router-link to="/settings/cce-date-counts"
                            class="flex items-center p-2 pl-11 text-gray-900  text-sm rounded "
                            active-class="bg-blue-500 text-white group hover:bg-blue-600">
                            <span class="ms-3">Date Counts</span>
                        </router-link>
                        <router-link to="/settings/cce-holidays"
                            class="flex items-center p-2 pl-11 text-gray-900  text-sm rounded "
                            active-class="bg-blue-500 text-white group hover:bg-blue-600">
                            <span class="ms-3">Holidays</span>
                        </router-link>
                        <router-link to="/settings/cce-templates"
                            class="flex items-center p-2 pl-11 text-gray-900  text-sm rounded "
                            active-class="bg-blue-500 text-white group hover:bg-blue-600">
                            <span class="ms-3">Templates</span>
                        </router-link>

                    </ul>
                </li>

                <li>
                    <button @click="toggleDropdown('forms')"
                        class="flex items-center w-full p-2 text-base text-gray-900  transition duration-75 rounded group  hover:bg-gray-200">
                        <span class="flex-1 ms-3 text-left">Forms</span>
                        <svg class="w-3 h-3" aria-hidden="true" fill="none" viewBox="0 0 10 6">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="m1 1 4 4 4-4" />
                        </svg>
                    </button>
                    <ul v-show="dropdowns.forms" class="py-2 space-y-2">
                        <router-link to="/settings/default-form-value"
                            class="flex items-center p-2 pl-11 text-gray-900  rounded text-sm ">
                            <span class="ms-3">Adjustments</span>
                        </router-link>
                    </ul>
                </li>

                <li>
                    <button @click="toggleDropdown('ausf')"
                        class="flex items-center w-full p-2 text-base text-gray-900  transition duration-75 rounded group hover:bg-gray-200 ">
                        <span class="flex-1 ms-3 text-left">AUSF</span>
                        <svg class="w-3 h-3" aria-hidden="true" fill="none" viewBox="0 0 10 6">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="m1 1 4 4 4-4" />
                        </svg>
                    </button>
                    <ul v-show="dropdowns.ausf" class="py-2 space-y-2">
                        <router-link to="/settings/default-form-value"
                            class="flex items-center p-2 pl-11 text-gray-900  rounded text-sm  ">
                            <span class="ms-3">Adjustments</span>
                        </router-link>
                    </ul>
                </li>
                <li>
                    <button @click="toggleDropdown('scanned')"
                        class="flex items-center w-full p-2 text-base text-gray-900  transition duration-75 rounded group  hover:bg-gray-200">
                        <span class="flex-1 ms-3 text-left">Scanned</span>
                        <svg class="w-3 h-3" aria-hidden="true" fill="none" viewBox="0 0 10 6">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="m1 1 4 4 4-4" />
                        </svg>
                    </button>
                    <ul v-show="dropdowns.scanned" class="py-2 space-y-2">
                        <router-link to="/settings/default-form-value"
                            class="flex items-center p-2 pl-11 text-gray-900  rounded text-sm  ">
                            <span class="ms-3">Logs</span>
                        </router-link>
                    </ul>
                </li>

            </ul>
            <div class="w-full flex items-center justify-center">
                <router-link to="/pages/welcome"
                    class="border w-full p-2 font-medium text-md justify-center items-center flex text-gray-600 hover:bg-red-400 hover:text-white bg-white shadow-md">
                    Return
                </router-link>

            </div>
        </div>
    </aside>
</template>

<script setup>
import { ref } from 'vue';

const dropdowns = ref({
    cceCFN: false,
    forms: false
});

const toggleDropdown = (key) => {
    dropdowns.value[key] = !dropdowns.value[key];
};
</script>

<style>
/* Add any additional styles if needed */
</style>
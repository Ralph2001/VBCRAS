<template>
    <aside id="sidebar-multi-level-sidebar"
        class="fixed top-0 left-0 z-40 w-64 border-r border-gray-300 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar">
        <div class="h-full px-3 py-4 overflow-y-auto flex flex-col bg-gray-50 dark:bg-gray-800">
            <p class="text-center font-bold text-gray-600 py-10 font-mono">VBRAS</p>
            <ul class="font-medium flex flex-col  h-full gap-2">
                <li>
                    <router-link to="/settings/dashboard" active-class="bg-[#695CFD] text-white group hover:bg-blue-600"
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


                <li class="">
                    <router-link to="correction-report" active-class="bg-[#695CFD] text-white group hover:bg-blue-600"
                        class="flex items-center p-2 text-gray-900 rounded ">
                        <span class="flex-1 ms-3 text-left">Corrections</span>
                    </router-link>

                </li>
                <li>
                    <router-link to="form-report" active-class="bg-[#695CFD] text-white group hover:bg-blue-600"
                        class="flex items-center p-2 text-gray-900 rounded ">
                        <span class="flex-1 ms-3 text-left">Forms</span>
                    </router-link>
                </li>
                <li>
                    <router-link to="marriage-report" active-class="bg-[#695CFD] text-white group hover:bg-blue-600"
                        class="flex items-center p-2 text-gray-900 rounded ">
                        <span class="flex-1 ms-3 text-left">Marriage License</span>
                    </router-link>
                </li>
                <li>
                    <router-link to="legitimation-report" active-class="bg-[#695CFD] text-white group hover:bg-blue-600"
                        class="flex items-center p-2 text-gray-900 rounded ">
                        <span class="flex-1 ms-3 text-left">Legitimation</span>
                    </router-link>
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
import { AuthStore } from '../../../../stores/Authentication';

const auth = AuthStore()
const dropdowns = ref({
    cceCFN: false,
    forms: false
});

const toggleDropdown = (key) => {
    dropdowns.value[key] = !dropdowns.value[key];
};

const logout = () => {
    auth.logout();
};


</script>

<style>
/* Add any additional styles if needed */
</style>
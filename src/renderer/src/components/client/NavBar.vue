<template>
    <div>
        <nav class="bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700 ">
            <div class="max-w-screen-2xl flex flex-wrap items-center justify-between mx-auto p-4 relative ">
                <a href="#" class="flex items-center space-x-3 rtl:space-x-reverse">
                    <img src="../../assets/logo.png" class="h-12" alt="Local Civil Registry" />
                    <span class="self-center text-lg font-semibold whitespace-nowrap dark:text-white">Civil Registry Archive
                        System</span>
                </a>
                <button data-collapse-toggle="navbar-dropdown" type="button"
                    class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                    aria-controls="navbar-dropdown" aria-expanded="false">
                    <span class="sr-only">Open main menu</span>
                    <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 17 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M1 1h15M1 7h15M1 13h15" />
                    </svg>
                </button>
                <div class="hidden w-full md:block md:w-auto absolute top-[3.5rem] md:static md:top-0" id="navbar-dropdown">
                    <ul
                        class="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                        <li>
                            <router-link to="/client/welcome"
                                active-class="text-white bg-blue-700 hover:bg-blue-600 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500 dark:bg-blue-600 md:dark:bg-transparent"
                                class="block py-2 px-3 text-gray-900 rounded md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">

                                Home
                            </router-link>
                        </li>
                        <li>
                            <router-link to="/client/scanned"
                                active-class="text-white bg-blue-700 hover:bg-blue-600  rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500 dark:bg-blue-600 md:dark:bg-transparent"
                                class="block py-2 px-3 text-gray-900 rounded md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">

                                Scanned Documents
                            </router-link>
                        </li>
                        <li>
                            <button id="dropdownNavbarLink" data-dropdown-toggle="dropdownNavbar"
                                class="flex items-center justify-between w-full py-2 px-3 text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white dark:hover:bg-gray-700 md:dark:hover:bg-transparent">Menu
                                <svg class="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                    fill="none" viewBox="0 0 10 6">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                        stroke-width="2" d="m1 1 4 4 4-4" />
                                </svg></button>

                            <div id="dropdownNavbar"
                                class="z-50 hidden absolute font-normal bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">

                                <ul class="py-2 text-sm text-gray-700 dark:text-gray-200"
                                    aria-labelledby="dropdownLargeButton">
                                    <li>
                                        <button
                                            class="w-full text-left px-4 block py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                            {{ auth.user }}
                                        </button>
                                    </li>
                                    <li>
                                        <a href="#"
                                            class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                            <font-awesome-icon icon="fa-solid fa-gear" class="me-2" /> Settings</a>
                                    </li>
                                </ul>
                                <div class="">
                                    <button @click="logout()"
                                        class="w-full text-left px-4 block py-2 text-sm text-gray-700 rounded-bl-lg rounded-br-lg dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white hover:bg-red-500  hover:text-white">
                                        <font-awesome-icon icon="fa-solid fa-right-from-bracket" class="me-2" /> Sign
                                        out</button>
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
import { onMounted } from 'vue'
import { initFlowbite } from 'flowbite'
import { AuthStore } from '../../stores/clientAuth';


const auth = AuthStore();

const logout = () => {
    auth.UserLogout()
}
onMounted(() => {
    initFlowbite();
    auth.isAuthenticated();
})
</script>



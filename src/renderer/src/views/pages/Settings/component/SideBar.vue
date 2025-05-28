<template>
    <aside id=" sidebar-multi-level-sidebar"
        class="fixed top-0 left-0 z-40 w-64 border-r hidden md:block border-gray-300 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar">
        <div class="h-full  px-3 py-4 overflow-y-auto flex flex-col bg-gray-50 dark:bg-gray-800">
            <p class="text-center font-bold text-gray-600 py-4 font-mono">VBRAS</p>
            <ul class="font-medium flex flex-col  h-full gap-2 py-2">
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
                        class="flex items-center p-2 text-gray-900 rounded  hover:bg-blue-600 hover:text-white">
                        <span class="flex-1 ms-3 text-left">Corrections</span>
                    </router-link>

                </li>
                <li>
                    <router-link to="form-report" active-class="bg-[#695CFD] text-white group hover:bg-blue-600"
                        class="flex items-center p-2 text-gray-900 rounded  hover:bg-blue-600 hover:text-white">
                        <span class="flex-1 ms-3 text-left">Forms</span>
                    </router-link>
                </li>
                <li>
                    <router-link to="marriage-report" active-class="bg-[#695CFD] text-white group hover:bg-blue-600"
                        class="flex items-center p-2 text-gray-900 rounded  hover:bg-blue-600 hover:text-white">
                        <span class="flex-1 ms-3 text-left">Marriage License</span>
                    </router-link>
                </li>
                <li>
                    <router-link to="legitimation-report" active-class="bg-[#695CFD] text-white group hover:bg-blue-600"
                        class="flex items-center p-2 text-gray-900 rounded  hover:bg-blue-600 hover:text-white">
                        <span class="flex-1 ms-3 text-left">Legitimation</span>
                    </router-link>
                </li>
                <li class="mt-auto">
                    <router-link to="system_setting" active-class="bg-[#695CFD] text-white group hover:bg-blue-600"
                        class="flex items-center p-2 text-gray-900 rounded  bg-gray-100 hover:bg-gray-200 border border-gray-400 justify-center gap-2">
                        <font-awesome-icon icon="fa-solid fa-gear" c />
                        <span class="">System Setting</span>
                    </router-link>
                </li>
            </ul>
            <div class="w-full flex items-center justify-center">
                <router-link to="/pages/welcome"
                    class=" w-full p-2 font-medium rounded text-md justify-center items-center flex flex-row gap-4 bg-gray-100  text-gray-900 border border-gray-400 hover:bg-green-400 hover:text-white">
                    <font-awesome-icon icon="fa-solid fa-right-from-bracket" /> View All Apps
                </router-link>

            </div>
        </div>
    </aside>
</template>

<script setup>

</script>

<template>
    <div class="p-4 h-full overflow-y-scroll py-10 sm:ml-64 flex flex-col">
        <div class="flex">
            <router-link to="/server/users" class="active:scale-95">
                <font-awesome-icon icon="fa-solid fa-circle-arrow-left"
                    class="text-2xl text-gray-500 antialiased hover:text-gray-600" />
            </router-link>
        </div>
        <div class="grid grid-cols-2 mt-5 px-10">
            <div class="flex gap-2 items-center flex-row ">
                <div>
                    <img src="../../../assets/logo.png" class="h-9 " alt="">
                </div>
                <div class="flex flex-col ms-2">
                    <p class="text-2xl font-bold text-gray-700">Ralph A. Villanueva</p>
                    <p class="text-md italic text-gray-600">Adminstrative Aide I</p>
                </div>
            </div>
            <div class="flex items-center justify-end  px-10">
                <button type="button"
                    class="bg-blue-500 px-2 py-1 rounded-full text-sm font-normal text-white font-mono">
                    Member
                </button>
            </div>
        </div>
        <div class="flex mt-10 ">
            <div
                class=" w-full text-sm font-medium text-center text-gray-700 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
                <ul class="flex flex-wrap -mb-px">
                    <li class="me-2">
                        <a href="#"
                            class="inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500"
                            aria-current="page">Scanned Documents</a>
                    </li>
                    <li>
                        <a
                            class="inline-block p-4 text-gray-400 rounded-t-lg cursor-not-allowed dark:text-gray-500">Forms</a>
                    </li>
                    <li>
                        <a
                            class="inline-block p-4 text-gray-400 rounded-t-lg cursor-not-allowed dark:text-gray-500">Collections</a>
                    </li>
                    <li>
                        <a
                            class="inline-block p-4 text-gray-400 rounded-t-lg cursor-not-allowed dark:text-gray-500">CCE</a>
                    </li>
                    <li>
                        <a class="inline-block p-4 text-gray-400 rounded-t-lg cursor-not-allowed dark:text-gray-500"><font-awesome-icon
                                icon="fa-solid fa-gear" class="me-1" /> General</a>
                    </li>
                </ul>
            </div>

        </div>

        <div class="flex flex-col mt-2 bg-gray-50/50 p-10 w-full h-full ">
            <p class="text-lg font-semibold text-gray-800 flex items-center">
                <font-awesome-icon icon="fa-solid fa-user-check" class="me-1 text-sm text-gray-600" /> User Permissions
            </p>

            <div class="lg:flex lg:flex-row md:grid md:grid-cols-2 sm:grid sm:grid-cols-2 gap-2  mt-5">
                <div
                    class="flex w-[13.5rem] bg-white gap-2 items-center px-5 py-2 rounded-lg h-[4rem] border hover:scale-[0.95] transition-all cursor-pointer">
                    <div>
                        <input type="checkbox" class="border-gray-300 rounded-lg" checked>
                    </div>
                    <div class="flex flex-col justify-start">
                        <p class="text-md ms-2 font-semibold text-gray-700">Access this App</p>
                        <p class="text-xs ms-2 font-semibold text-gray-500">Able to use this app</p>
                    </div>
                </div>
                <div
                    class="flex w-[13.5rem] bg-white gap-2 items-center px-5 py-2 rounded-lg h-[4rem] border hover:scale-[0.95] transition-all cursor-pointer">
                    <div>
                        <input type="checkbox" class="border-gray-300 rounded-lg" checked>
                    </div>
                    <div class="flex flex-col justify-start">
                        <p class="text-md ms-2 font-semibold text-gray-700">View Records</p>
                        <p class="text-xs ms-2 font-semibold text-gray-500">Able to View Records</p>
                    </div>
                </div>
                <div
                    class="flex w-[13.5rem] bg-white gap-2 items-center px-5 py-2 rounded-lg h-[4rem] border hover:scale-[0.95] transition-all cursor-pointer">
                    <div>
                        <input type="checkbox" class="border-gray-300 rounded-lg">
                    </div>
                    <div class="flex flex-col justify-start">
                        <p class="text-md ms-2 font-semibold text-gray-700">Add Records</p>
                        <p class="text-xs ms-2 font-semibold text-gray-500">Able to Add Records</p>
                    </div>
                </div>
                <div
                    class="flex w-[13.5rem] bg-white gap-2 items-center px-5 py-2 rounded-lg h-[4rem] border hover:scale-[0.95] transition-all cursor-pointer">
                    <div>
                        <input type="checkbox" class="border-gray-300 rounded-lg">
                    </div>
                    <div class="flex flex-col justify-start">
                        <p class="text-md ms-2 font-semibold text-gray-700">Remove Records</p>
                        <p class="text-xs ms-2 font-semibold text-gray-500">Able to Remove Records</p>
                    </div>
                </div>
            </div>
            <p class="text-lg font-semibold text-blue-600 mt-10 flex items-center">
                <font-awesome-icon icon="fa-solid fa-chart-line" class="me-1 text-sm text-blue-600 " /> Activity
            </p>

            <div class="h-full mb-10 mt-5">
                <TableDataStack :data="serverData.scanned_logs" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import TableDataStack from '../../../components/server/TableDataStack.vue';
import { useServerDataStore } from '../../../stores/serverData.js'

const serverData = useServerDataStore()

onMounted(() => {
    serverData.getScannedLog()
})
</script>

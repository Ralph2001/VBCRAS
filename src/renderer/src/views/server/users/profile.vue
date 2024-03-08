<template>
    <div class="p-4 h-full  py-10 sm:ml-64 ">
        <div class="flex">
            <router-link to="/server/users" class="active:scale-95">
                <font-awesome-icon icon="fa-solid fa-circle-arrow-left"
                    class="text-2xl text-gray-500 antialiased hover:text-gray-600" />
            </router-link>
        </div>
        <div class="flex flex-row justify-between mt-5 px-10">
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
        <div class="flex mt-10">
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

        <div class="flex flex-col  bg-gray-50/50 p-10 gap-5">
            <p class="text-lg font-semibold text-gray-800 flex items-center">
                <font-awesome-icon icon="fa-solid fa-user-check" class="me-1 text-sm text-gray-600" /> User Permissions
            </p>

            <div class="flex flex-wrap flex-row items-center justify-evenly gap-2 ">
                <div
                    class="flex basis-[14rem] sm:flex-grow bg-white gap-2 items-center px-5 py-2 rounded-lg h-[4rem] border hover:shadow-sm transition-all cursor-pointer">
                    <div>
                        <input type="checkbox" class="border-gray-300 rounded-full" checked>
                    </div>
                    <div class="flex flex-col justify-start">
                        <p class="text-md ms-2 font-semibold text-gray-700">Access this App</p>
                        <p class="text-xs ms-2 font-semibold text-gray-500">Able to use this app</p>
                    </div>
                </div>
                <div
                    class="flex  basis-[14rem] sm:flex-grow bg-white gap-2 items-center px-5 py-2 rounded-lg h-[4rem] border hover:shadow-sm transition-all cursor-pointer">
                    <div>
                        <input type="checkbox" class="border-gray-300  rounded-full" checked>
                    </div>
                    <div class="flex flex-col justify-start">
                        <p class="text-md ms-2 font-semibold text-gray-700">View Records</p>
                        <p class="text-xs ms-2 font-semibold text-gray-500">Able to View Records</p>
                    </div>
                </div>
                <div
                    class="flex  basis-[14rem] sm:flex-grow bg-white gap-2 items-center px-5 py-2 rounded-lg h-[4rem] border hover:shadow-sm transition-all cursor-pointer">
                    <div>
                        <input type="checkbox" class="border-gray-300  rounded-full">
                    </div>
                    <div class="flex flex-col justify-start">
                        <p class="text-md ms-2 font-semibold text-gray-700">Add Records</p>
                        <p class="text-xs ms-2 font-semibold text-gray-500">Able to Add Records</p>
                    </div>
                </div>
                <div
                    class="flex basis-[14rem] sm:flex-grow bg-white gap-2 items-center px-5 py-2 rounded-lg h-[4rem] border hover:shadow-sm transition-all cursor-pointer">
                    <div>
                        <input type="checkbox" class="border-gray-300  rounded-full">
                    </div>
                    <div class="flex flex-col justify-start">
                        <p class="text-md ms-2 font-semibold text-gray-700">Remove Records</p>
                        <p class="text-xs ms-2 font-semibold text-gray-500">Able to Remove Records</p>
                    </div>
                </div>
            </div>
            <div class="flex flex-col space-y-6">
                <p class="text-lg font-semibold text-blue-600  flex items-center ">
                    <font-awesome-icon icon="fa-solid fa-chart-line" class="me-1 text-sm text-blue-600" /> Activity
                </p>
                <div class="h-[500px]">
                    <TableGrid :data="serverData.scanned_logs" :dataColumns="colDefs" />
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import TableDataStack from '../../../components/server/TableDataStack.vue';
import TableDataAG from '../../../components/server/TableDataAG.vue';
import { useServerDataStore } from '../../../stores/serverData.js'
import { format } from "date-fns";
import TableGrid from '../../../components/TableGrid.vue';

const serverData = useServerDataStore()

onMounted(() => {
    serverData.getScannedLog()
})
const colDefs = ref([
    { field: "name", flex: 2, filter: true, floatingFilter: true, cellRenderer: (params) => `<span class="text-gray-800 font-semibold text-sm">${params.value}</span>` },
    { field: "action", flex: 1 },
    { field: "device_used", flex: 1 },
    { field: "action_at", headerName: 'Time', flex: 1, valueFormatter: p => format(new Date(p.value), 'MMMM d, yyyy h:m a'), filter: true },
]);


</script>

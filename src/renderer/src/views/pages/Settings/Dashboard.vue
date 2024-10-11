<template>
    <div class="flex flex-col ml-64 p-4 ">
        <div class="flex flex-row items-center gap-4">
            <div class="h-10 w-10 border border-gray-300 rounded-full flex items-center justify-center bg-gray-200">
                <p class="text-[9px] text-gray-500">Logo</p>
            </div>
            <div class="flex flex-col">
                <p class="font-medium text-sm">Welcome, Admin</p>
                <p class="font-medium text-xs text-gray-600">{{ date }}</p>
            </div>
        </div>
        <p class="text-2xl font-medium mt-10">Dashboard</p>

        <div class="grid grid-cols-4 w-full gap-4 mt-10">

            <div
                class="border shadow-sm  flex flex-col p-2 rounded-lg hover:bg-gray-50/50  transition-all hover:shadow-md">
                <div class="flex flex-row w-full items-center px-1.5">
                    <p class="text-sm font-medium">Total Petitions</p>
                    <div class="ml-auto">
                        <button class="text-gray-700 hover:text-gray-800">
                            <font-awesome-icon icon="fa-solid fa-expand" title="More Details" />
                        </button>
                    </div>
                </div>
                <div class="py-4 flex flex-row gap-2 items-center">
                    <div
                        class="h-10 w-10 border border-gray-300 rounded-full flex items-center justify-center bg-gray-200">
                        <p class="text-[9px] text-gray-500">Logo</p>
                    </div>
                    <p class="text-lg font-bold text-gray-700">200</p>
                </div>
                <button class="text-xs hover:text-blue-500 ">Enter</button>
            </div>


            <div
                class="border shadow-sm  flex flex-col p-2 rounded-lg hover:bg-gray-50/50  transition-all hover:shadow-md">
                <div class="flex flex-row w-full items-center px-1.5">
                    <p class="text-sm font-medium">Total Forms</p>
                    <div class="ml-auto">
                        <button class="text-gray-700 hover:text-gray-800">
                            <font-awesome-icon icon="fa-solid fa-expand" title="More Details" />
                        </button>
                    </div>
                </div>
                <div class="py-4 flex flex-row gap-2 items-center">
                    <div
                        class="h-10 w-10 border border-gray-300 rounded-full flex items-center justify-center bg-gray-200">
                        <p class="text-[9px] text-gray-500">Logo</p>
                    </div>
                    <p class="text-lg font-bold text-gray-700">50</p>
                </div>
                <button class="text-xs hover:text-blue-500 ">Enter</button>
            </div>
            <div
                class="border shadow-sm  flex flex-col p-2 rounded-lg hover:bg-gray-50/50  transition-all hover:shadow-md">
                <div class="flex flex-row w-full items-center px-1.5">
                    <p class="text-sm font-medium">Total Marriage License</p>
                    <div class="ml-auto">
                        <button class="text-gray-700 hover:text-gray-800">
                            <font-awesome-icon icon="fa-solid fa-expand" title="More Details" />
                        </button>
                    </div>
                </div>
                <div class="py-4 flex flex-row gap-2 items-center">
                    <div
                        class="h-10 w-10 border border-gray-300 rounded-full flex items-center justify-center bg-gray-200">
                        <p class="text-[9px] text-gray-500">Logo</p>
                    </div>
                    <p class="text-lg font-bold text-gray-700">150</p>
                </div>
                <button class="text-xs hover:text-blue-500 ">Enter</button>
            </div>
            <div
                class="border shadow-sm  flex flex-col p-2 rounded-lg hover:bg-gray-50/50  transition-all hover:shadow-md">
                <div class="flex flex-row w-full items-center px-1.5">
                    <p class="text-sm font-medium">Total Scanned Documents</p>
                    <div class="ml-auto">
                        <button class="text-gray-700 hover:text-gray-800">
                            <font-awesome-icon icon="fa-solid fa-expand" title="More Details" />
                        </button>
                    </div>
                </div>
                <div class="py-4 flex flex-row gap-2 items-center">
                    <div
                        class="h-10 w-10 border border-gray-300 rounded-full flex items-center justify-center bg-gray-200">
                        <p class="text-[9px] text-gray-500">Logo</p>
                    </div>
                    <p class="text-lg font-bold text-gray-700">100,000</p>
                </div>
                <button class="text-xs hover:text-blue-500 ">Enter</button>
            </div>
        </div>
    </div>
</template>
<script setup>
import { format } from 'date-fns';
import { ref } from 'vue';


// const date = ref('Friday, October 11, 2024')

const date_now = new Date()

const date = format(date_now, 'PPPP')
</script>
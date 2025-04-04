<template>
    <div class="flex flex-col ml-64 p-4 ">
        <div class="flex flex-row items-center gap-4">

            <div class="flex flex-col">
                <p class="text-gray-800 text-3xl font-bold">Welcome, Admin</p>
                <p class="font-medium text-xs text-gray-600">{{ date }}</p>
            </div>
        </div>
        <p class="text-2xl font-bold mt-6 text-[#695CFD]">Dashboard</p>

        <div class="grid grid-cols-1  lg:grid-cols-4 w-full gap-4 mt-10">

            <div
                class=" shadow-md  flex flex-col bg-white  p-2 rounded-lg hover:bg-gray-100  transition-all hover:shadow-md">
                <div class="flex flex-row w-full items-center px-1.5">
                    <p class="text-sm font-medium">Total Petitions</p>
        
                </div>
                <div class="py-4 flex flex-row gap-2 items-center px-4 justify-end">
                    <p class="text-lg font-bold text-gray-700">{{ petitions.petitions.length }}</p>
                </div>
                <button class="text-xs hover:text-blue-500 ">Enter</button>
            </div>


            <div
                class=" shadow-md  flex flex-col bg-white  p-2 rounded-lg hover:bg-gray-100  transition-all hover:shadow-md">
                <div class="flex flex-row w-full items-center px-1.5">
                    <p class="text-sm font-medium">Total Forms</p>
        
                </div>
                <div class="py-4 flex flex-row gap-2 items-center px-4 justify-end">

                    <p class="text-lg font-bold text-gray-700">0</p>
                </div>
                <button class="text-xs hover:text-blue-500 ">Enter</button>
            </div>
            <div
                class=" shadow-md  flex flex-col bg-white  p-2 rounded-lg hover:bg-gray-100  transition-all hover:shadow-md">
                <div class="flex flex-row w-full items-center px-1.5">
                    <p class="text-sm font-medium">Total Marriage License</p>
        
                </div>
                <div class="py-4 flex flex-row gap-2 items-center px-4 justify-end">

                    <p class="text-lg font-bold text-gray-700">0</p>
                </div>
                <button class="text-xs hover:text-blue-500 ">Enter</button>
            </div>
            <div
                class=" shadow-md  flex flex-col bg-white  p-2 rounded-lg hover:bg-gray-100  transition-all hover:shadow-md">
                <div class="flex flex-row w-full items-center px-1.5">
                    <p class="text-sm font-medium">Total Scanned Documents</p>
        
                </div>
                <div class="py-4 flex flex-row gap-2 items-center px-4 justify-end">

                    <p class="text-lg font-bold text-gray-700">0</p>
                </div>
                <button class="text-xs hover:text-blue-500 ">Enter</button>
            </div>
        </div>
    </div>
</template>
<script setup>
import { format } from 'date-fns';
import { onMounted, ref } from 'vue';
import { usePetitions } from '../../../stores/Petition/petitions';

const petitions = usePetitions()

onMounted(() => {
    petitions.get_all_petitions()
})



const date_now = new Date()
const date = format(date_now, 'PPPP')
</script>
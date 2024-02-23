<template>
    <div class="flex flex-col h-full border rounded-lg ">
        <div class="flex flex-row items-center justify-between px-3 py-3 border">
            <p class="text-md font-bold">Scanned Documents</p>

            <div class="relative">
                <font-awesome-icon icon="fa-solid fa-magnifying-glass"
                    class="text-gray-400 pointer-events-none absolute mt-[0.80rem] ml-2" />
                <input type="text" class="pl-8 rounded-md border border-gray-300 font-semibold w-[20rem]">
            </div>
        </div>
        <div class="flex flex-row items-center gap-2 px-5 py-2 w-full">
            <font-awesome-icon icon="fa-solid fa-circle-arrow-left" class="text-gray-600 text-lg" />
            <nav class="flex shadow-sm w-full bg-gray-100 p-2" aria-label="Breadcrumb">
                <ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                    <li class="inline-flex items-center">
                        <a href="#"
                            class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                            <svg class="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                            </svg>
                            Home
                        </a>
                    </li>
                    <li>
                        <div class="flex items-center">
                            <svg class="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="m1 9 4-4-4-4" />
                            </svg>
                            <a href="#"
                                class="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white">Projects</a>
                        </div>
                    </li>
                    <li aria-current="page">
                        <div class="flex items-center">
                            <svg class="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="m1 9 4-4-4-4" />
                            </svg>
                            <span class="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">Flowbite</span>
                        </div>
                    </li>
                </ol>
            </nav>

        </div>
        <div class="flex flex-col p-4  overflow-y-scroll">
            <ul class="w-full space-y-1 px-2 m list-none list-inside dark:text-gray-400">
                <li class="text-md font-semibold antialiased flex items-center gap-1 hover:bg-blue-100 hover:cursor-pointer rounded-sm"
                    v-for="type in types" :key="type" @click="showYear(type)" v-if="showType">
                    <font-awesome-icon icon="fa-solid fa-folder" class="text-yellow-400/70 me-2 ms-3" /> {{ type }}
                </li>
                <li class="text-md font-semibold antialiased flex items-center gap-1 hover:bg-blue-100 hover:cursor-pointer rounded-sm"
                    v-for="year in years" :key="year" @click="showMonth(year)" v-if="showYears">
                    <font-awesome-icon icon="fa-solid fa-folder" class="text-yellow-400/70 me-2 ms-3" /> {{ year }}
                </li>
                <li class="text-md font-semibold antialiased flex items-center gap-1 hover:bg-blue-100 hover:cursor-pointer rounded-sm"
                    v-for="month in months" :key="month" @click="showFile(month)" v-if="showMonths">
                    <font-awesome-icon icon="fa-solid fa-folder" class="text-yellow-400/70 me-2 ms-3" /> {{ month }}
                </li>
                <li class="text-md font-semibold antialiased flex items-center gap-1 hover:bg-blue-100 hover:cursor-pointer active:bg-blue-200 rounded-sm"
                    v-for="file in files" :key="file">
                    <font-awesome-icon icon="fa-solid fa-file-pdf" class="text-red-500 me-2 ms-3" /> {{ file }}
                </li>
            </ul>
        </div>
    </div>
</template>
  
<script setup>
import { computed, ref } from 'vue';

const showType = ref(true)
const showYears = ref(true)
const showMonths = ref(true)

const years = ref()
const months = ref()
const files = ref()


const types = computed(() => {
    return [...new Set(props.data.map(data => data.type))]
        .sort((a, b) => a - b);
});

const props = defineProps({
    data: {
        type: Array,
        required: true,
    },
});

const showYear = (type) => {
    showType.value = false
    years.value = [...new Set(props.data.filter(data => data.type === type).map(data => data.year))]
        .sort((a, b) => a - b);
}
const showMonth = (year) => {
    showYears.value = false
    showType.value = false

    months.value = [...new Set(props.data.filter(data => data.year === year).map(data => data.month))]
        .sort((a, b) => a - b);
}
const showFile = (month) => {
    showYears.value = false
    showMonths.value = false
    files.value = [...new Set(props.data.filter(data => data.month === month).map(data => data.name))]
        .sort((a, b) => a - b);
}


</script>
  
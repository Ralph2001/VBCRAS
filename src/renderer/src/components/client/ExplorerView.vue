<template>
    <div class="flex flex-col h-full border rounded-lg ">
        <div class="flex flex-row items-center justify-between px-3 py-3 border bg-gray-50/50">
            <p class="text-md font-bold">Scanned Documents</p>

            <div class="relative">
                <font-awesome-icon icon="fa-solid fa-magnifying-glass"
                    class="text-gray-300 pointer-events-none absolute mt-[0.80rem] ml-2" />
                <SearchFilter v-model="searchQuery" />

            </div>
            <div>
                <p class="text-xs font-mono text-gray-200">Created by Ralph</p>
            </div>
        </div>
        <div class="flex flex-row justify-center  h-16 items-center gap-2 mt-5 px-3 py-3 w-full  ">
            <button
                class="rounded-full hover:bg-gray-50 active:scale-95 px-2 disabled:text-gray-200 text-blue-400 hover:text-blue-500"
                :disabled="!toggleBack" @click="goBack()">
                <font-awesome-icon icon="fa-solid fa-circle-arrow-left" /></button>


            <nav class="flex px-5 py-3 w-full  text-white rounded-lg shadow-sm  border border-gray-50    dark:bg-gray-800 dark:border-gray-700"
                aria-label="Breadcrumb">
                <ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                    <li class="inline-flex items-center" disabled>
                        <a href="#" @click="goHome()"
                            :class="{ 'pointer-events-none text-gray-400': !type, 'text-gray-700': type }"
                            class="inline-flex items-center text-sm font-medium  hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                            <svg class="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                            </svg>
                            Home
                        </a>
                    </li>
                    <li>
                        <div class="flex items-center" v-if="type">
                            <svg class="rtl:rotate-180 block w-3 h-3 mx-1 text-gray-400 " aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="m1 9 4-4-4-4" />
                            </svg>
                            <a href="#" @click="goYear()"
                                :class="{ 'pointer-events-none text-gray-400': !year, 'text-gray-700': year }"
                                class="ms-1 text-sm font-medium  hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white">{{
                                    type }}</a>
                        </div>
                    </li>
                    <li>
                        <div class="flex items-center" v-if="year">
                            <svg class="rtl:rotate-180 block w-3 h-3 mx-1 text-gray-400 " aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="m1 9 4-4-4-4" />
                            </svg>
                            <a href="#" @click="goMonth()"
                                :class="{ 'pointer-events-none text-gray-400': !month, 'text-gray-700': month }"
                                class="ms-1 text-sm font-medium  hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white">{{
                                    year }}</a>
                        </div>
                    </li>
                    <!-- Months -->
                    <li v-if="month">
                        <div class="flex items-center">
                            <svg class="rtl:rotate-180  w-3 h-3 mx-1 text-gray-400" aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="m1 9 4-4-4-4" />
                            </svg>
                            <span class="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">{{ month
                            }}</span>
                        </div>
                    </li>

                </ol>

            </nav>
            <div class=" flex flex-col p-1 items-center" v-if="type && year && month && searchQuery == ''">
                <p class="text-sm font-mono text-gray-800 text-nowrap">Total Files</p>
                <p class="text-sm font-mono text-gray-800">
                    {{ files.length }}
                </p>
            </div>
        </div>

        <div class="flex flex-col p-4  overflow-y-scroll ">
            <ul class="w-full space-y-1 px-2 m list-none list-inside dark:text-gray-400">
                <li v-if="!type && searchQuery == ''" v-for="type in types" :key="type" @click="selectType(type)"
                    class="text-md font-semibold antialiased flex items-center gap-1 hover:bg-blue-100 hover:cursor-pointer rounded-sm">
                    <font-awesome-icon icon="fa-solid fa-folder" class="text-yellow-400/70 me-2 ms-3" /> {{ type }}
                </li>
                <li v-if="type && !year && searchQuery == ''" v-for="year in years" :key="year" @click="selectYear(year)"
                    class="text-md font-semibold antialiased flex items-center gap-1 hover:bg-blue-100 hover:cursor-pointer rounded-sm">
                    <font-awesome-icon icon="fa-solid fa-folder" class="text-yellow-400/70 me-2 ms-3" /> {{ year }}
                </li>

                <!-- Months -->
                <li v-if="type && year && !month && searchQuery == ''" v-for="month in months" :key="month"
                    @click="selectMonth(month)"
                    class="text-md font-semibold antialiased flex items-center gap-1 hover:bg-blue-100 hover:cursor-pointer rounded-sm">
                    <font-awesome-icon icon="fa-solid fa-folder" class="text-yellow-400/70 me-2 ms-3" /> {{ month }}
                </li>

                <!-- Files -->
                <li v-if="type && year && month && searchQuery == ''" v-for="file in files" :key="file.id"
                    @click="openFile(file.filepath)"
                    class="text-md flex-row justify-between font-semibold antialiased flex items-center gap-1   hover:bg-blue-100 hover:cursor-pointer rounded-sm">

                    <div class="block w-[60%] overflow-hidden truncate">
                        <font-awesome-icon icon="fa-solid fa-file-pdf" class="text-red-500 me-2 ms-3 " /> {{ file.name }}
                    </div>
                    <p class="text-sm italic text-gray-600 font-normal mr-2">{{ file.type }} {{ file.month }} {{ file.year
                    }}</p>
                </li>

                <div class="h-[calc(100vh-316px)]" v-if="searchQuery != ''">
                    <RecycleScroller v-if="searchQuery != ''" :items="searchData" class="h-full" :item-size="28"
                        key-field="name" v-slot="{ item }">
                        <li tabindex="0" @click="openFile(item.filepath)"
                            class="text-md flex-row justify-between font-semibold antialiased flex items-center gap-1 hover:bg-blue-100 hover:cursor-pointer rounded-sm">
                            <div>
                                <font-awesome-icon icon="fa-solid fa-file-pdf" class="text-red-500 me-2 ms-3" /> {{
                                    item.name }}
                            </div>
                            <p class="text-sm italic text-gray-600 font-normal mr-2">{{ item.type }} {{ item.month }} {{
                                item.year }}</p>
                        </li>
                    </RecycleScroller>
                </div>

            </ul>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import SearchFilter from './SearchFilter.vue'


const toggleBack = ref(false)
const type = ref('');
const year = ref('');
const month = ref('');
const searchQuery = ref('');


const openFile = async (filepath) => {
    try {
        const check = await window.LocalCivilApi.checkFile(filepath);
        if (!check) {
            console.log('Cant Open')
            visible.value = true
        }
    } catch (error) {
        visible.value = true

    }
};


const props = defineProps({
    data: {
        type: Array,
        required: true,
    },
});

// const searchData = computed(() => {
//     const searchQueryLower = searchQuery.value.toLowerCase();

//     if (type.value) {
//         return [...new Set(props.data.filter(data => data.name.toLowerCase().includes(searchQueryLower) && data.type === type.value).map(data => data))]
//             .sort((a, b) => a - b)
//     }
//     else if (type.value && year.value) {
//         return [...new Set(props.data.filter(data => data.name.toLowerCase().includes(searchQueryLower) && data.type === type.value && data.year === year.value).map(data => data))]
//             .sort((a, b) => a - b)
//     }
//     else if (type.value && year.value && month.value) {
//         return [...new Set(props.data.filter(data => data.name.toLowerCase().includes(searchQueryLower) && data.type === type.value && data.year === year.value && data.month === month.value).map(data => data))]
//             .sort((a, b) => a - b)
//     }

//     return [...new Set(props.data.filter(data => data.name.toLowerCase().includes(searchQueryLower)).map(data => data))]
//         .sort((a, b) => a - b)
// })


const searchData = computed(() => {
    const searchQueryLower = searchQuery.value.toLowerCase();
    const filteredData = props.data.filter(
        data => data.name.toLowerCase().includes(searchQueryLower)
            && (
                !type.value || data.type === type.value
            ) && (
                !type.value || !year.value || data.year === year.value
            ) && (
                !type.value || !year.value || !month.value || data.month === month.value
            )
    );

    return [...new Set(filteredData.map(data => data))].sort((a, b) => a - b);
});



const goBack = () => {
    if (type.value && year.value && month.value) {
        month.value = '';
        toggleBack.value = true;
    }
    else if (type.value && year.value) {
        year.value = '';
        toggleBack.value = true;
    }
    else if (type.value) {
        type.value = '';
        toggleBack.value = false;
    }
};

const goHome = () => {
    type.value = ''
    month.value = ''
    year.value = ''
    toggleBack.value = false
}
const goYear = () => {
    year.value = ''
    month.value = ''
    toggleBack.value = true
}
const goMonth = () => {
    month.value = ''
    toggleBack.value = true

}

const filteredData = computed(() => {
    let filtered = props.data.filter(item => {
        if (!type.value) return true;
        if (!year.value) return item.type === type.value;
        if (!month.value) return item.type === type.value && item.year === year.value;
        return item.type === type.value && item.year === year.value && item.month === month.value;
    });

    return filtered;
});

const types = computed(() => {
    return [...new Set(filteredData.value.map(data => data.type))].sort((a, b) => a - b);
});

const years = computed(() => {
    return [...new Set(filteredData.value.map(data => data.year))].sort((a, b) => a - b);
});

const months = computed(() => {
    return [...new Set(filteredData.value.map(data => data.month))].sort((a, b) => a - b);
});

const files = computed(() => {
    return filteredData.value.map(data => data).sort((a, b) => a - b);
});

const selectType = (selectedType) => {
    toggleBack.value = true
    type.value = selectedType;
    year.value = '';
    month.value = '';
};

const selectYear = (selectedYear) => {
    toggleBack.value = true
    year.value = selectedYear;
    month.value = '';
};

const selectMonth = (selectedMonth) => {
    toggleBack.value = true
    month.value = selectedMonth;
};


</script>

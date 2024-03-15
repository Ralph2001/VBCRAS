<template>
    <div class="flex flex-col h-full border rounded-lg  relative">
        <Transition enter-active-class="animate__animated animate__fadeInDown"
            leave-active-class="animate__animated animate__fadeOutUp">
            <Alert v-if="showAlert" message="Error: Unable to open the file." error />
        </Transition>
        <div class="grid grid-cols-3 items-center justify-between px-3 py-3  bg-gray-50/50">
            <p class="text-lg font-semibold ms-3">Scanned Documents</p>

            <div class="relative">
                <font-awesome-icon icon="fa-solid fa-xmark" v-if="searchQuery" @click="searchQuery = ''"
                    class="absolute right-3 text-gray-500 hover:text-gray-700 cursor-pointer top-[0.80rem]" />
                <font-awesome-icon icon="fa-solid fa-magnifying-glass"
                    class="text-gray-300 pointer-events-none absolute mt-[0.80rem] ml-2" />
                <SearchFilter v-model="searchQuery" :hasValue="searchQuery" />

            </div>
            <div class="flex justify-end items-center me-5">
                <font-awesome-icon icon="fa-solid fa-circle-question"
                    class="text-gray-400 hover:text-gray-600 cursor-pointer" />
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
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="2" d="m1 9 4-4-4-4" />
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
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="2" d="m1 9 4-4-4-4" />
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
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="2" d="m1 9 4-4-4-4" />
                            </svg>
                            <span class="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">{{ month
                                }}</span>
                        </div>
                    </li>

                </ol>

            </nav>
            <div class=" flex flex-row p-1 items-center gap-2 justify-center"
                v-if="type && year && month && searchQuery == ''">
                <p class="text-xs font-mono text-gray-800"> Files: </p>
                <p class="text-xs font-mono text-gray-800">
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
                <li v-if="!data.length && searchQuery == ''" class="text-center text-gray-600 font-italic">Empty
                    Data.
                </li>


                <li v-if="type && !year && searchQuery == ''" v-for="year in years" :key="year"
                    @click="selectYear(year)"
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

                <div class="h-[calc(100vh-316px)]" v-if="type && year && month && searchQuery == ''">
                    <RecycleScroller v-if="type && year && month && searchQuery == ''" :items="files" class="h-full"
                        :item-size="28" key-field="name" v-slot="{ item }">

                        <li @dblclick.prevent="openFile(item.filepath, item.name)" tabindex="0"
                            class="text-md flex-row justify-between font-semibold antialiased flex items-center gap-1  hover:bg-blue-100 hover:cursor-pointer rounded-sm relative group">

                            <div class="block w-[60%] overflow-hidden truncate">
                                <font-awesome-icon icon="fa-solid fa-file-pdf" class="text-red-500 me-2 ms-3 " /> {{
                item.name.replace('.pdf', '') }}
                            </div>
                            <p class="text-sm italic text-gray-600 font-normal mr-2">{{ item.type }} {{ item.month
                                }} {{
                item.year
            }} <font-awesome-icon @click="openPath(item.filepath, item.name)"
                                    icon="fa-solid fa-folder-open" title="Open file path" class="ms-2 text-gray-400 hover:text-gray-700 text-md hidden group-hover:inline-block
                        transition-all" />
                            </p>

                        </li>
                    </RecycleScroller>
                </div>




                <div class="h-[calc(100vh-316px)]" v-if="searchQuery != ''">

                    <div v-if="!searchData.length && searchQuery != ''"
                        class="flex flex-col items-center h-full gap-10 justify-center">
                        <p class="text-center text-lg font-bold text-gray-600 font-italic">
                            No files
                            found.</p>

                        <div>
                            <img src="../../assets/no result.png" alt="" class="h-[15rem]" srcset="">
                        </div>
                    </div>

                    <RecycleScroller v-if="searchQuery != '' && searchData.length" :items="searchData" class="h-full"
                        :item-size="28" key-field="name" v-slot="{ item }">
                        <li tabindex="0" @dblclick="openFile(item.filepath, item.name)"
                            class="text-md flex-row justify-between font-semibold antialiased flex items-center gap-1 hover:bg-blue-100 hover:cursor-pointer rounded-sm group">
                            <div>
                                <font-awesome-icon icon="fa-solid fa-file-pdf" class="text-red-500 me-2 ms-3" /> {{
                item.name.replace('.pdf', '') }}
                            </div>
                            <p class="text-sm italic text-gray-600 font-normal mr-2">{{ item.type }} {{ item.month
                                }} {{
                                item.year }}

                                <font-awesome-icon icon="fa-solid fa-folder-open" title="Open file path" class="ms-2 text-gray-400 hover:text-gray-700 text-md hidden group-hover:inline-block
                        transition-all" />
                            </p>
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
import { useComputerStore } from '../../stores/computer';
import { useScannedDocuments } from '../../stores/scanned';
import Alert from '../Alert.vue';

const showAlert = ref(false)


const computer = useComputerStore()
const Documents = useScannedDocuments()
onMounted(() => {
    computer.getUserName()
})

const toggleBack = ref(false)
const type = ref('');
const year = ref('');
const month = ref('');
const searchQuery = ref('');


const openFile = async (filepath, filename) => {
    try {

        const device = computer.desktop_name
        const data = (
            [{
                name: filename,
                device_used: device,
                action: 'Opened'
            }
            ])

        const add_log = await Documents.add_log(data)
        if (add_log) {
            const check = await window.LocalCivilApi.checkFile(filepath);
            if (!check) {
                showAlert.value = true

                setTimeout(() => {
                    showAlert.value = false
                }, 3000);
            }
        }

    } catch (error) {
        showAlert.value = true

        setTimeout(() => {
            showAlert.value = false
        }, 3000);
    }
};

const openPath = async (filepath, filename) => {
    try {

        const device = computer.desktop_name
        const data = (
            [{
                name: filename,
                device_used: device,
                action: 'Opened'
            }
            ])

        const add_log = await Documents.add_log(data)
        if (add_log) {
            const openpath = await window.LocalCivilApi.openFilePath(filepath);
            if (!openpath) {
                showAlert.value = true

                setTimeout(() => {
                    showAlert.value = false
                }, 3000);
            }
        }

    } catch (error) {
        showAlert.value = true

        setTimeout(() => {
            showAlert.value = false
        }, 3000);
    }
}


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


// const searchData = computed(() => {
//     const searchQueryLower = searchQuery.value.toLowerCase();
//     const filteredData = props.data.filter(
//         data => data.name.toLowerCase().includes(searchQueryLower)
//             && (
//                 !type.value || data.type === type.value
//             ) && (
//                 !type.value || !year.value || data.year === year.value
//             ) && (
//                 !type.value || !year.value || !month.value || data.month === month.value
//             )
//     );

//     return [...new Set(filteredData.map(data => data))].sort((a, b) => a - b);
// });


const searchData = computed(() => {
    const searchQueryLower = searchQuery.value.toLowerCase();
    const searchWords = searchQueryLower.split(/\s+/); // Split by whitespace

    const filteredData = props.data.filter(
        data => {
            const nameLower = data.name.toLowerCase();

            return searchWords.every(word => nameLower.includes(word)) &&
                (!type.value || data.type === type.value) &&
                (!year.value || data.year === year.value) &&
                (!year.value || !month.value || data.month === month.value);
        }
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
    // const uniqueMonths = [...new Set(filteredData.value.map(data => data.month.toLowerCase()))];
    const monthIndex = {
        January: 0,
        February: 1,
        March: 2,
        April: 3,
        May: 4,
        June: 5,
        July: 6,
        August: 7,
        September: 8,
        October: 9,
        November: 10,
        December: 11
    };

    return [...new Set(filteredData.value.map(data => data.month))].sort((a, b) => monthIndex[a] - monthIndex[b]);
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

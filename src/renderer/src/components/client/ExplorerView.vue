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
        <div class="flex flex-row items-center gap-2 px-2 py-3 w-full  h-10 ">
            <button
                class="rounded-full hover:bg-gray-50 active:scale-95 py-1 px-2 mt-2 disabled:text-gray-200 text-blue-400 hover:text-blue-500"
                :disabled="!toggleBack" v-if="toggleBack" @click="goBack()">
                <font-awesome-icon icon="fa-solid fa-circle-arrow-left" /></button>
        </div>

        <div class="flex flex-col p-4  overflow-y-scroll">
            <ul class="w-full space-y-1 px-2 m list-none list-inside dark:text-gray-400">
                <li v-if="!type && searchQuery == ''" v-for="type in types" :key="type" @click="selectType(type)"
                    class="text-md font-semibold antialiased flex items-center gap-1 hover:bg-blue-100 hover:cursor-pointer rounded-sm">
                    <font-awesome-icon icon="fa-solid fa-folder" class="text-yellow-400/70 me-2 ms-3" /> {{ type }}
                </li>
                <li v-if="type && !year && searchQuery == ''" v-for="year in years" :key="year" @click="selectYear(year)"
                    class="text-md font-semibold antialiased flex items-center gap-1 hover:bg-blue-100 hover:cursor-pointer rounded-sm">
                    <font-awesome-icon icon="fa-solid fa-folder" class="text-yellow-400/70 me-2 ms-3" /> {{ year }}
                </li>
                <li v-if="type && year && !month && searchQuery == ''" v-for="month in months" :key="month"
                    @click="selectMonth(month)"
                    class="text-md font-semibold antialiased flex items-center gap-1 hover:bg-blue-100 hover:cursor-pointer rounded-sm">
                    <font-awesome-icon icon="fa-solid fa-folder" class="text-yellow-400/70 me-2 ms-3" /> {{ month }}
                </li>
                <li v-if="type && year && month && searchQuery == ''" v-for="file in files" :key="file"
                    class="text-md flex-row justify-between font-semibold antialiased flex items-center gap-1 hover:bg-blue-100 hover:cursor-pointer rounded-sm">
                    <div>
                        <font-awesome-icon icon="fa-solid fa-file-pdf" class="text-red-500 me-2 ms-3" /> {{ file.name }}
                    </div>
                    <p class="text-sm italic text-gray-600 font-normal mr-2">{{ file.type }} {{ file.year }}</p>
                </li>

                <li v-if="searchQuery != ''" v-for="search in searchData" tabindex="0"
                    class="text-md flex-row justify-between font-semibold antialiased flex items-center gap-1 hover:bg-blue-100 hover:cursor-pointer rounded-sm">
                    <div>
                        <font-awesome-icon icon="fa-solid fa-file-pdf" class="text-red-500 me-2 ms-3" /> {{ search.name }}
                    </div>
                    <p class="text-sm italic text-gray-600 font-normal mr-2">{{ search.type }} {{ search.month }} {{
                        search.year }}</p>
                </li>

            </ul>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import SearchFilter from './SearchFilter.vue'

const toggleBack = ref(false)
const type = ref('');
const year = ref('');
const month = ref('');
const searchQuery = ref('');

const props = defineProps({
    data: {
        type: Array,
        required: true,
    },
});

const searchData = computed(() => {
    const searchQueryLower = searchQuery.value.toLowerCase();

    if (type.value) {
        return [...new Set(props.data.filter(data => data.name.toLowerCase().includes(searchQueryLower) && data.type === type.value).map(data => data))]
            .sort((a, b) => a - b)
    }
    else if (type.value && year.value) {
        return [...new Set(props.data.filter(data => data.name.toLowerCase().includes(searchQueryLower) && data.type === type.value && data.year === year.value).map(data => data))]
            .sort((a, b) => a - b)
    }
    else if (type.value && year.value && month.value) {
        return [...new Set(props.data.filter(data => data.name.toLowerCase().includes(searchQueryLower) && data.type === type.value && data.year === year.value && data.month === month.value).map(data => data))]
            .sort((a, b) => a - b)
    }

    return [...new Set(props.data.filter(data => data.name.toLowerCase().includes(searchQueryLower)).map(data => data))]
        .sort((a, b) => a - b)
})


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

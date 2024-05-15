<template>
    <div class="p-4 sm:ml-64 h-full    bg-blue-50/50 ">
        <div class="flex flex-row justify-between mt-5 px-10">
            <HeaderTop title="Registry Records" description="All Registry Records here"
                icon="fa-solid fa-landmark-dome" />
        </div>
        <div class="flex flex-col mt-10 mb-10  h-[calc(100vh-160px)]  ">
            <TabsWrapper>
                <Tab title="All Correction Records" icon="fa-solid fa-landmark-dome">
                    <Suspense>
                        <TableGrid :data="records.records" :dataColumns="recordsDef" />
                        <template #fallback>
                            <div class="flex flex-col items-center justify-center h-full">
                                <p class="text-lg italic font-light">Loading</p>
                            </div>
                        </template>
                    </Suspense>
                </Tab>
                <Tab title="Logs" icon="fa-solid fa-scroll">
                    Hello2
                </Tab>
                <Tab title="Report" icon="fa-solid fa-flag">
                    <div class="flex flex-row mb-4 gap-3">
                        <div class="w-[10rem]">
                            <label for="countries"
                                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select
                                Type</label>
                            <select id="countries"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ">
                                <option selected disabled class="text-center">--------</option>
                                <option value="US">Birth</option>
                                <option value="CA">Death</option>
                                <option value="FR">Marriage</option>
                            </select>
                        </div>
                        <div class="w-[10rem]">
                            <label for="countries"
                                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select
                                Year</label>
                            <select id="countries"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ">
                                <option selected disabled class="text-center">--------</option>
                                <option value="US">Birth</option>
                                <option value="CA">Death</option>
                                <option value="FR">Marriage</option>
                            </select>
                        </div>
                    </div>
                    <div class="flex flex-row  items-center ">
                        <div class="flex flex-col  gap-2">

                            <div class="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700 w-[10rem]  cursor-pointer group "
                                v-for="month in months" :key="month">
                                <input :id="month" type="checkbox" :value="month" :name="months" v-model="monthselected"
                                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded  focus:ring-blue-500 ">
                                <label :for="month"
                                    class="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"> {{
                                        month }}</label>
                            </div>
                        </div>
                    </div>
                </Tab>
                <Tab title="General" icon="fa-solid fa-gear">
                    Hello4
                </Tab>
            </TabsWrapper>
        </div>
    </div>
</template>

<script setup>
import TabsWrapper from './components/TabsWrapper.vue';
import Tab from './components/Tab.vue';
import HeaderTop from './components/HeaderTop.vue';

import { useRecords } from '../../stores/Records/main';
import { defineAsyncComponent, onMounted, ref } from 'vue';
const records = useRecords()

const TableGrid = defineAsyncComponent(() =>
    import("../../components/TableGrid.vue"),
)
onMounted(() => {
    records.getRecords()
})

const months = ref([
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
])

const monthselected = ref([
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',])




const recordsDef = ref([
    {
        field: "registry_number",
        headerName: "Registry Number",
        flex: 2,
        filter: true,
        pinned: "left",
        cellClass: "font-semibold tracking-wider w-full h-full  text-start ",
        lockPinned: true,

    },
    {
        field: "type",
        headerName: "Type",
        flex: 1,
        cellClass: "font-medium tracking-wider w-full text-gray-700",
        filter: true,
        pinned: "left",
        lockPinned: true,
    },
    {
        field: "document_owner",
        headerName: "Document Owner",
        flex: 2,
        cellClass: "font-medium tracking-wider w-full text-gray-700",
        filter: true,
    },

    {
        field: "date_of_registration",
        cellClass: "font-medium tracking-wider w-full text-gray-600",
        headerName: "Date of Registration",
        flex: 1,
        filter: true,
        pinned: "right",
        lockPinned: true,

    },
    {

        cellClass: "font-medium tracking-wider w-full text-gray-600 text-center",
        headerClass: 'text-center w-full',
        headerName: "Action",
        flex: 1,
        pinned: "right",
        lockPinned: true,
        filter: true,

        cellStyle: { border: "none" },
        cellStyle: { overflow: "visible", border: "none" },
    },

]);

</script>

<template>
    <div class="p-4 sm:ml-64 h-full  bg-blue-50/50 ">
        <div class="flex flex-row justify-between mt-5 px-10">
            <HeaderTop title="Scanned Documents" description="All Scanned Documents here" icon="fa-solid fa-file-pdf" />
        </div>
        <div class="flex flex-col mt-10 mb-10 h-[calc(100vh-160px)] w-full">
            <TabsWrapper>
                <Tab title="All Correction Records" icon="fa-solid fa-landmark-dome">
                    <Suspense>
                        <TableGrid :data="Documents.scanned" :dataColumns="allDefs" />
                        <template #fallback>
                            <div class="flex flex-col items-center justify-center h-full">
                                <p class="text-lg italic font-light">Loading</p>
                            </div>
                        </template>
                    </Suspense>
                </Tab>
                <Tab title="Logs" icon="fa-solid fa-scroll">
                    <Suspense>
                        <TableGrid :data="serverData.scanned_logs" :dataColumns="colDefs" />
                        <template #fallback>
                            <div class="flex flex-col items-center justify-center h-full">
                                <p class="text-lg italic font-light">Loading</p>
                            </div>
                        </template>
                    </Suspense>
                </Tab>
                <Tab title="Report" icon="fa-solid fa-flag">
                    <div class="h-full flex items-center italic font-thin text-3xl justify-center ">
                        Working on it
                    </div>
                </Tab>
                <Tab title="General" icon="fa-solid fa-gear">
                    <div class="h-full flex items-center italic font-thin text-3xl justify-center ">
                        Working on it
                    </div>
                </Tab>
            </TabsWrapper>
        </div>
    </div>
</template>

<script setup>
import { useServerDataStore } from '../../stores/serverData.js'
import { useScannedDocuments } from '../../stores/scanned'

import { onMounted, ref, computed, defineAsyncComponent } from 'vue';

const serverData = useServerDataStore()
const Documents = useScannedDocuments()

import { format } from "date-fns";
import TypeFilter from '../../components/TypeFilter.vue';
import ActionBtn from '../../components/ActionBtn.vue';
import Tag from '../../components/Tag.vue';
import HeaderTop from './components/HeaderTop.vue';
import TabsWrapper from './components/TabsWrapper.vue';
import Tab from './components/Tab.vue';


const TableGrid = defineAsyncComponent(() =>
    import("../../components/TableGrid.vue"),
)

// import TableGrid from '../../components/TableGrid.vue'
onMounted(() => {
    serverData.getScannedLog()
    Documents.getScanned()

})

// const birth = computed(() => {
//     const all_scanned = Documents.scanned
//     return all_scanned.filter(data => data.type === 'Birth').length;
// });

// const death = computed(() => {
//     const all_scanned = Documents.scanned
//     return all_scanned.filter(data => data.type === 'Death').length;
// });

// const marriage = computed(() => {
//     const all_scanned = Documents.scanned
//     return all_scanned.filter(data => data.type === 'Marriage').length;
// });

// const legal_instrument = computed(() => {
//     const all_scanned = Documents.scanned
//     return all_scanned.filter(data => data.type === 'Legal Instrument').length;
// });

// const others = computed(() => {
//     const all_scanned = Documents.scanned
//     return all_scanned.filter(data => data.type === 'Other').length;
// });


const allDefs = ref([
    { field: "name", flex: 2, filter: true, floatingFilter: true, cellClass: 'font-semibold text-md' },
    { field: "type", flex: 1, cellRenderer: Tag, filter: TypeFilter },
    { field: "year", flex: 1, filter: true, cellClass: "font-semibold" },
    { field: "uploaded_by", headerName: 'Uploaded By', flex: 1, filter: true, cellClass: "font-semibold" },
    { field: "device_used", headerName: 'Device', flex: 1, filter: true, cellClass: "font-semibold" },
    { field: "created_at", headerName: 'Created At', valueFormatter: p => format(new Date(p.value), 'MMM d, yyyy h:mm a'), flex: 1, filter: true, cellClass: "font-semibold" },
    { headerName: "Action", field: "filepath", flex: 1, cellRenderer: ActionBtn, cellClass: 'my-class', },
])

const colDefs = ref([
    { field: "name", flex: 2, filter: true, floatingFilter: true, cellRenderer: (params) => `<span class="text-gray-800 font-semibold text-sm">${params.value}</span>` },
    { field: "action", flex: 1 },
    { field: "action_by", headerName: "User", flex: 1, filter: true, floatingFilter: true },
    { field: "device_used", headerName: "Device", flex: 1 },
    { field: "action_at", headerName: 'Time', flex: 1, valueFormatter: p => format(new Date(p.value), 'MMM d, yyyy h:mm a'), filter: true },
]);


</script>

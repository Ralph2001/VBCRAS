<template>
    <div class="p-4 sm:ml-64 h-full  bg-blue-50/50 ">

        <div class="flex flex-row justify-between mt-5 px-10">
            <div class="flex gap-2 items-center flex-row ">
                <div>
                    <font-awesome-icon icon="fa-solid fa-file-pdf"
                        class="text-red-500  text-3xl hover:text-red-600 rounded-md hover:border-gray-300 " />
                </div>
                <div class="flex flex-col ms-2">
                    <p class="text-2xl font-bold text-gray-700">Scanned Documents</p>
                    <p class="text-md font-light italic text-gray-700">All Scanned Records here</p>
                </div>
            </div>
            <div class="flex w-full  px-2 ">

            </div>
        </div>
        <div class="flex mt-10 mb-10">
            <div
                class=" w-full text-sm font-medium text-center text-gray-700 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
                <ul class="flex flex-wrap -mb-px">
                    <li class="me-2" @click="allbtn()">
                        <p :class="{ 'text-blue-600 border-b-2 border-blue-600': all }"
                            class="inline-block p-4  rounded-t-lg cursor-pointer"><font-awesome-icon
                                icon="fa-solid fa-print" /> All Scanned
                            Documents</p>
                    </li>
                    <li class="me-2" @click="logsbtn()">
                        <p :class="{ 'text-blue-600 border-b-2 border-blue-600': logs }"
                            class="inline-block p-4  rounded-t-lg  cursor-pointer"><font-awesome-icon
                                icon="fa-solid fa-info" /><font-awesome-icon icon="fa-solid fa-scroll" /> 
                            Logs</p>
                    </li>
                    <li class="me-2" @click="flagsbtn()">
                        <p :class="{ 'text-blue-600 border-b-2 border-blue-600': flags }"
                            class="inline-block p-4  rounded-t-lg cursor-pointer"><font-awesome-icon
                                icon="fa-solid fa-flag" /> Report</p>
                    </li>
                    <li class="me-2" @click="recordbtn()">
                        <p :class="{ 'text-blue-600 border-b-2 border-blue-600': record }"
                            class="inline-block p-4  rounded-t-lg cursor-pointer"> <font-awesome-icon
                                icon="fa-solid fa-gear" /> General</p>
                    </li>
                </ul>
            </div>

        </div>
        <div class="h-[calc(100vh-300px)] flex flex-col mt-2">
            <TableGrid :data="Documents.scanned" :dataColumns="allDefs" v-if="all" />
            <TableGrid :data="serverData.scanned_logs" :dataColumns="colDefs" v-if="logs" />
            <!-- <TableGrid :data="serverData.scanned_logs" :dataColumns="colDefs" v-if="flags" /> -->
            <div class="flex flex-col items-center justify-center h-full" v-if="flags">
                <p class="text-lg italic font-light">Working on it</p>
            </div>
            <div class="flex flex-col  items-center h-full" v-if="record">
                <div class="grid grid-cols-5 w-full gap-2">
                    <div
                        class="flex flex-col items-center  p-2 justify-center border rounded-md hover:scale-95 transition-all hover:shadow">
                        <p class="text-sm font-semibold uppercase ">Birth</p>
                        {{ birth }}
                    </div>
                    <div
                        class="flex flex-col items-center  p-2 justify-center border rounded-md hover:scale-95 transition-all hover:shadow">
                        <p class="text-sm font-semibold uppercase ">Death</p>
                        {{ death }}
                    </div>
                    <div
                        class="flex flex-col items-center  p-2 justify-center border rounded-md hover:scale-95 transition-all hover:shadow">
                        <p class="text-sm font-semibold uppercase ">Marriage</p>
                        {{ marriage }}
                    </div>
                    <div
                        class="flex flex-col items-center  p-2 justify-center border rounded-md hover:scale-95 transition-all hover:shadow">
                        <p class="text-sm font-semibold uppercase ">Legal Instrument</p>
                        {{ legal_instrument }}
                    </div>
                    <div
                        class="flex flex-col items-center  p-2 justify-center border rounded-md hover:scale-95 transition-all hover:shadow">
                        <p class="text-sm font-semibold uppercase ">Others</p>
                        {{ others }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>





<script setup>
import TableGrid from '../../components/TableGrid.vue'
import { useServerDataStore } from '../../stores/serverData.js'
import { useScannedDocuments } from '../../stores/scanned'

import { onMounted, ref, computed } from 'vue';

const serverData = useServerDataStore()
const Documents = useScannedDocuments()
import { format } from "date-fns";
import TypeFilter from '../../components/TypeFilter.vue';
import ActionBtn from '../../components/ActionBtn.vue';
import Tag from '../../components/Tag.vue';

onMounted(() => {
    serverData.getScannedLog()
    Documents.getScanned()

})

const birth = computed(() => {
    const all_scanned = Documents.scanned
    return all_scanned.filter(data => data.type === 'Birth').length;
});

const death = computed(() => {
    const all_scanned = Documents.scanned
    return all_scanned.filter(data => data.type === 'Death').length;
});

const marriage = computed(() => {
    const all_scanned = Documents.scanned
    return all_scanned.filter(data => data.type === 'Marriage').length;
});

const legal_instrument = computed(() => {
    const all_scanned = Documents.scanned
    return all_scanned.filter(data => data.type === 'Legal Instrument').length;
});

const others = computed(() => {
    const all_scanned = Documents.scanned
    return all_scanned.filter(data => data.type === 'Other').length;
});

const all = ref(true)
const logs = ref(false)
const flags = ref(false)
const record = ref(false)

const allbtn = () => {
    all.value = true
    logs.value = false
    flags.value = false
    record.value = false

}
const logsbtn = () => {
    all.value = false
    logs.value = true
    flags.value = false
    record.value = false

}
const flagsbtn = () => {
    all.value = false
    logs.value = false
    flags.value = true
    record.value = false

}
const recordbtn = () => {
    all.value = false
    logs.value = false
    flags.value = false
    record.value = true

}



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

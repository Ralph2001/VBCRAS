<template>
    <div class="p-4 sm:ml-64 h-full  bg-blue-50/50 ">
        <div class="p-4">
            <p class="text-2xl text-gray-600 font-semibold">Scanned Documents - Logs</p>
        </div>
        <div class="h-[40rem] flex flex-col">
            <TableGrid :data="serverData.scanned_logs" :dataColumns="colDefs" />
        </div>
    </div>
</template>

<script setup>
import TableGrid from '../../components/TableGrid.vue'
import { useServerDataStore } from '../../stores/serverData.js'
import { onMounted, ref } from 'vue';

const serverData = useServerDataStore()
import { format } from "date-fns";

onMounted(() => {
    serverData.getScannedLog()
})
const colDefs = ref([
    { field: "name", flex: 2, filter: true, floatingFilter: true, cellRenderer: (params) => `<span class="text-gray-800 font-semibold text-sm">${params.value}</span>` },
    { field: "action", flex: 1 },
    { field: "action_by", headerName: "User", flex: 1, filter: true, floatingFilter: true },
    { field: "device_used", headerName: "Device", flex: 1 },
    { field: "action_at", headerName: 'Time', flex: 1, valueFormatter: p => format(new Date(p.value), 'MMMM d, yyyy h:m a'), filter: true },
]);
</script>

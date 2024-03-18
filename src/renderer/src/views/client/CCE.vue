<template>
    <div class="flex flex-col relative justify-center w-full">
        <div class="flex flex-row items-center p-3 px-5">
            <p class="text-md font-semibold tracking-tight">FILED CORRECTION OF CLERICAL ERROR & CHANGE OF FIRST NAME
                <span class="text-xs font-base tracking-wide">R.A. 9048 /
                    R.A. 10172</span>
            </p>
            <button type="button" @click="modalSwitch()"
                class=" ml-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-0 active:scale-95 transition-all focus:ring-blue-300 font-medium rounded shadow text-sm px-4 py-2 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Create</button>
        </div>
        <div class="h-[calc(100vh-170px)] px-5 relative">
            <TableGrid :data="data" :dataColumns="colDefs" :autoSizeStrategy="autoSizeStrategy" />
        </div>



    </div>
</template>

<script setup>
import { ref } from 'vue';
import TableGrid from '../../components/TableGrid.vue';
import Modal from '../../components/client/modal/Modal.vue';
import { FwbRadio } from 'flowbite-vue';

const selectRA = ref(false)

const modalSwitch = () => {
    selectRA.value = !selectRA.value
}


const colDefs = ref([
    { field: "name", headerName: "Petitioner Number", flex: 2, filter: true, pinned: 'left', lockPinned: true, },
    { field: "name", headerName: "Petitioner Name", flex: 1, filter: true },
    { field: "name", headerName: "Document Owner", flex: 1, filter: true },
    { field: "name", headerName: "Relationship", flex: 1, filter: true },
    { field: "name", headerName: "Date Filed", flex: 1, filter: true },
    { field: "name", headerName: "Status", flex: 1, filter: true },
    { field: "name", headerName: "Date Forwarded to CRG", flex: 1, filter: true },
    { headerName: "Action", flex: 1, pinned: 'right', lockPinned: true, resizable: false },

]);

const autoSizeStrategy = ref({
    type: 'fitCellContents'
})
const data = ref([
    "Ralph"
])
</script>

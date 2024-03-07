<template>
    <div>
        <ag-grid-vue :rowData="props.data" :columnDefs="props.dataColumns" style="height: 500px" class="ag-theme-quartz"
            :pagination="true" :paginationPageSize="20" :paginationPageSizeSelector="true">
        </ag-grid-vue>

    </div>
</template>

<script setup>
import { ref, h } from 'vue';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
// import "ag-grid-community/styles/ag-theme-alpine.css"; 
import { AgGridVue } from "ag-grid-vue3";

const props = defineProps({
    data: {
        type: Array,
        required: true
    },
    dataColumns: {
        type: Array,
        required: true
    }
})
</script>

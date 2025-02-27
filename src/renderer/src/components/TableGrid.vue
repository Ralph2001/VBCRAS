<template>
   
        <ag-grid-vue :rowData="props.data" :columnDefs="props.dataColumns" class="ag-theme-quartz h-full"
            :pagination="true" :paginationPageSize="props.paginationPageSize" :paginationPageSizeSelector="true">
        </ag-grid-vue>
  
</template>

<script setup>
import { defineProps } from 'vue'
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-quartz.css"
import { AgGridVue } from "ag-grid-vue3"

const props = defineProps({
    data: {
        type: Array,
        required: true
    },
    dataColumns: {
        type: Array,
        required: true
    },
    paginationPageSize: {
        type: Number,
        default: 20
    }
})
</script>
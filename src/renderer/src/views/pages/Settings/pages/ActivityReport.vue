<template>
    <div class="flex flex-col ml-64 p-4 ">
        <p class="font-medium text-2xl text-gray-800 font-mono">Correction of Civil Registry Documents</p>

        <div>
            <ag-grid-vue class="ag-theme-quartz h-full" style="width: 100%; height: 100%;" :columnDefs="colDefs"
                :rowModelType="'infinite'" :data="useLogs.logs" :cacheBlockSize="20" :pagination="true"
                :paginationPageSize="20" :paginationPageSizeSelector="true">
            </ag-grid-vue>
        </div>
    </div>
</template>

<script setup>
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-quartz.css"
import { AgGridVue } from "ag-grid-vue3"
import { useActivityLog } from "../../../../stores/logs"
import { ref } from "vue"



const useLogs = useActivityLog()



const colDefs = ref([
    {
        headerName: 'Date & Time', field: 'timestamp', sortable: true, filter: true,

        valueGetter: (params) => {
            const rawDate = params.data.timestamp;

            const parsedDate = parseISO(rawDate);


            if (!isValid(parsedDate)) return '';

            return formatInTimeZone(parsedDate, Intl.DateTimeFormat().resolvedOptions().timeZone, 'yyyy-MM-dd HH:mm:ss');
        }

    },
    { headerName: 'User', field: 'created_by_user.username', sortable: true, filter: true, cellClass: 'font-medium' },
    {
        headerName: 'Action',
        field: 'action',
        sortable: true,
        filter: true,
        width: 200,
        cellRenderer: (params) => {
            const action = (params.value || '').toUpperCase()

            const classMap = {
                CREATE: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
                UPDATE: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
                DELETE: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
                VIEW: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
            }

            const badgeClass = classMap[action] || 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300'

            return `
            <span class="${badgeClass} text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm">
                ${action}
            </span>
        `
        },
    },

    { headerName: 'Module', field: 'module', sortable: true, filter: true, width: 110 },
    { headerName: 'Details', field: 'details' },
    {
        headerName: 'Status',
        field: 'status',
        sortable: true,
        filter: true,
        width: 200,
        flex: 1,
        cellClass: 'flex w-full justify-center items-center  border border-red-500',
        cellRenderer: (params) => {
            const status = (params.value || '').toUpperCase()

            const classMap = {
                SUCCESS: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
                FAILED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
                PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
                INFO: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
            }

            const badgeClass = classMap[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'

            return `
            <span class="${badgeClass} text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm">
                ${status}
            </span>
        `
        },
    }

])

</script>
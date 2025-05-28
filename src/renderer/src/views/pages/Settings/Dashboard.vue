<template>
    <div class="md:ml-64 p-6 h-auto space-y-8    ">
        <!-- Header -->
        <header class="flex justify-between items-center">
            <div>
                <h1 class="text-2xl font-semibold text-gray-800">Welcome, Admin</h1>
                <p class="text-sm text-gray-500">{{ date }} | {{ time }}</p>
            </div>
        </header>

        <!-- Stats Cards -->
        <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Corrections" value="35" />
            <StatCard label="Total Forms" value="12" />
            <StatCard label="Total Application for Marriage License" value="8" />
            <StatCard label="Total Scanned" value="900,000+" />
        </section>

        <!-- Recent Activity -->
        <section class="bg-white p-6 rounded-xl flex flex-col shadow-sm w-full h-[40rem]">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>


            <div class="flex-1">
                <ag-grid-vue :rowData="useLogs.logs" :columnDefs="colDefs" class="ag-theme-quartz h-full"
                    :pagination="true" :paginationPageSize="20" :paginationPageSizeSelector="true">
                </ag-grid-vue>


            </div>

            <div v-if="useLogs.logs.length === 0" class="flex flex-col items-center justify-center h-full">
                <p class="text-sm text-gray-700">No recent activity to display.</p>
            </div>

            <div class="mx-auto mt-4 w-full flex justify-center items-center">
                <router-link to="system-settings-activity-logs" class="text-blue-600 font-medium hover:underline">View
                    All Activity</router-link>
            </div>
        </section>

        <!-- Apps -->
        <section>
            <h2 class="text-lg font-medium text-gray-800 mb-4">Apps</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <AppCard icon="lucide-file-pen" title="Correction" desc="Create Petition for Clerical Error" />
                <AppCard icon="lucide-file-text" title="Forms" desc="Create Local Copy" />
                <AppCard icon="lucide-heart" title="Marriage License" desc="Make application for marriage license" />
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-quartz.css"
import { AgGridVue } from "ag-grid-vue3"
import StatCard from './component/StatCard.vue'
import AppCard from './component/AppCard.vue'
import { useActivityLog } from '../../../stores/logs'
import { format, isValid, parseISO } from 'date-fns'
import { formatInTimeZone } from 'date-fns-tz'


const useLogs = useActivityLog()

const date = ref('')
const time = ref('')

function updateDateTime() {
    const now = new Date()
    date.value = now.toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
    time.value = now.toLocaleTimeString()
}


onMounted(() => {
    updateDateTime()
    setInterval(updateDateTime, 1000)
    useLogs.fetchAllLogs()
})



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

<template>
    <div class="flex flex-col ml-80 p-6 h-auto space-y-4 bg-gray-100 min-h-screen">
        <div>
            <h1 class="text-3xl font-semibold text-gray-800 font-sans">Activity Logs</h1>
            <p class="text-gray-600 mt-1 text-sm">
                A complete history of user actions performed within the system. Use the filters below to narrow down the
                logs.
            </p>
        </div>

        <div class="bg-white p-6 shadow-lg rounded-lg">
            <div class="flex flex-col md:flex-row justify-between md:items-center mb-6">
                <h2 class="text-xl font-semibold text-gray-800 mb-3 md:mb-0">Filter & Export Logs</h2>
                <button @click="exportToExcel"
                    class="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md shadow-md hover:shadow-lg transition duration-150 ease-in-out flex items-center justify-center text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                        class="w-5 h-5 mr-2">
                        <path
                            d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
                        <path
                            d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
                    </svg>
                    Export to Excel
                </button>
            </div>

            <div class="space-y-5">
                <div class="flex flex-col sm:flex-row gap-4 items-center">
                    <div class="relative flex-grow w-full sm:w-auto">
                        <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                                class="w-5 h-5 text-gray-400">
                                <path fill-rule="evenodd"
                                    d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                                    clip-rule="evenodd" />
                            </svg>
                        </span>
                        <input v-model="search" type="text" placeholder="Search logs by keyword, action, etc..."
                            class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md shadow-sm text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out" />
                    </div>
                    <button @click="clearFilters"
                        class="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-md hover:shadow-lg transition duration-150 ease-in-out flex items-center justify-center text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                            class="w-5 h-5 mr-2">
                            <path fill-rule="evenodd"
                                d="M2.75 4.75A.75.75 0 013.5 4h13a.75.75 0 010 1.5h-13a.75.75 0 01-.75-.75zm0 10A.75.75 0 013.5 14h7a.75.75 0 010 1.5h-7a.75.75 0 01-.75-.75zM6.75 9.25A.75.75 0 017.5 8.5h5a.75.75 0 010 1.5h-5a.75.75 0 01-.75-.75z"
                                clip-rule="evenodd" />
                            <path d="M12.243 3.243a.75.75 0 011.06 1.06l-8.5 8.5a.75.75 0 01-1.06-1.06l8.5-8.5z" />
                            <path d="M3.757 11.757a.75.75 0 011.06-1.06l8.5 8.5a.75.75 0 01-1.06 1.06l-8.5-8.5z" />

                        </svg>
                        Clear Filters
                    </button>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-2">
                    <div>
                        <label for="userFilter" class="block text-sm font-medium text-gray-700 mb-1">User</label>
                        <select id="userFilter" v-model="selectedUser"
                            class="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out">
                            <option value="">All Users</option>
                            <option v-for="user in uniqueUsers" :key="user" :value="user">{{ user }}</option>
                        </select>
                    </div>

                    <div>
                        <label for="actionFilter" class="block text-sm font-medium text-gray-700 mb-1">Action</label>
                        <select id="actionFilter" v-model="selectedAction"
                            class="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out">
                            <option value="">All Actions</option>
                            <option v-for="action in uniqueActions" :key="action" :value="action">{{ action }}</option>
                        </select>
                    </div>
                    <div>
                        <label for="moduleFilter" class="block text-sm font-medium text-gray-700 mb-1">Module</label>
                        <select id="moduleFilter" v-model="selectedModule"
                            class="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out">
                            <option value="">All Modules</option>
                            <option v-for="module in uniqueModules" :key="module" :value="module">{{ module }}</option>
                        </select>
                    </div>

                    <div>
                        <label for="yearFilter" class="block text-sm font-medium text-gray-700 mb-1">Year</label>
                        <select id="yearFilter" v-model="selectedYear"
                            class="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out">
                            <option value="">All Years</option>
                            <option v-for="year in uniqueYears" :key="year" :value="year">{{ year }}</option>
                        </select>
                    </div>

                    <div>
                        <label for="monthFilter" class="block text-sm font-medium text-gray-700 mb-1">Month</label>
                        <select id="monthFilter" v-model="selectedMonth"
                            class="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out">
                            <option value="">All Months</option>
                            <option v-for="month in months" :key="month.value" :value="month.value">{{ month.label }}
                            </option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <div class="h-[30rem] bg-white shadow-sm p-4 rounded-lg"> <ag-grid-vue ref="gridRef" :rowData="filteredRowData"
                :columnDefs="colDefs" class="ag-theme-quartz h-full" :pagination="true" :paginationPageSize="20"
                :paginationPageSizeSelector="true" />
        </div>
    </div>
</template>


<script setup>
import { useActivityLog } from "../../../../stores/logs"
import { onMounted, ref, computed } from "vue"
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-quartz.css"
import { AgGridVue } from "ag-grid-vue3"
import { formatInTimeZone } from "date-fns-tz"
import { isValid, parseISO } from "date-fns"

const useLogs = useActivityLog()
const gridRef = ref(null)
const searchQuery = ref('')
const selectedUser = ref('')





// Load logs
onMounted(async () => {
    await useLogs.fetchAllLogs()
})

const selectedModule = ref('')

const uniqueModules = computed(() =>
    [...new Set(useLogs.logs.map(log => log.module))].filter(Boolean)
)


const selectedAction = ref('')
const uniqueActions = computed(() =>
    [...new Set(useLogs.logs.map(log => log.action))].filter(Boolean)
)




const search = ref()

const filteredRowData = computed(() => {
    return useLogs.logs.filter(log => {
        const date = parseISO(log.timestamp)
        const matchesSearch = !search.value || Object.values(log).some(value =>
            String(value).toLowerCase().includes(search.value.toLowerCase())
        )

        const matchesUser = !selectedUser.value || log.created_by_user?.username === selectedUser.value
        const matchesModule = !selectedModule.value || log.module === selectedModule.value
        const matchesAction = !selectedAction.value || log.action === selectedAction.value
        const matchesYear = !selectedYear.value || (isValid(date) && date.getFullYear().toString() === selectedYear.value)
        const matchesMonth = !selectedMonth.value || (isValid(date) && (date.getMonth() + 1).toString().padStart(2, '0') === selectedMonth.value)

        return matchesSearch && matchesUser && matchesModule && matchesAction && matchesYear && matchesMonth
    })
})


// Extract unique users for dropdown
const uniqueUsers = computed(() =>
    [...new Set(useLogs.logs.map(log => log.created_by_user?.username))].filter(Boolean)
)


const clearFilters = () => {
    search.value = ''
    selectedUser.value = ''
    selectedModule.value = ''
    selectedAction.value = ''
    selectedYear.value = ''
    selectedMonth.value = ''
}



// Year and Month

const selectedYear = ref("")
const selectedMonth = ref("")

const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" }
]

const uniqueYears = computed(() => {
    return [...new Set(useLogs.logs.map(log => {
        const date = parseISO(log.timestamp)
        return isValid(date) ? date.getFullYear().toString() : null
    }))].filter(Boolean)
})

// Column definitions
const colDefs = ref([
    {
        headerName: 'Date & Time',
        field: 'timestamp',
        sortable: true,
        filter: false,
        valueGetter: (params) => {
            const parsedDate = parseISO(params.data.timestamp)
            return isValid(parsedDate)
                ? formatInTimeZone(parsedDate, Intl.DateTimeFormat().resolvedOptions().timeZone, 'yyyy-MM-dd HH:mm:ss')
                : ''
        }
    },
    {
        headerName: 'User',
        field: 'created_by_user.username',
        sortable: true,
        filter: false,
        cellClass: 'font-medium'
    },
    {
        headerName: 'Action',
        field: 'action',
        sortable: true,
        filter: false,
        width: 200,
        cellRenderer: (params) => {
            const action = (params.value || '').toUpperCase()
            const classMap = {
                CREATE: 'bg-green-100 text-green-800',
                UPDATE: 'bg-blue-100 text-blue-800',
                DELETE: 'bg-red-100 text-red-800',
                VIEW: 'bg-gray-100 text-gray-800',
            }
            const badgeClass = classMap[action] || 'bg-slate-100 text-slate-800'
            return `<span class="${badgeClass} text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm">${action}</span>`
        }
    },
    { headerName: 'Module', field: 'module', sortable: true, filter: false, width: 110 },
    { headerName: 'Details', field: 'details' },
    {
        headerName: 'Status',
        field: 'status',
        sortable: true,
        filter: false,

        cellRenderer: (params) => {
            const status = (params.value || '').toUpperCase()
            const classMap = {
                SUCCESS: 'bg-green-100 text-green-800',
                FAILED: 'bg-red-100 text-red-800',
                PENDING: 'bg-yellow-100 text-yellow-800',
                INFO: 'bg-blue-100 text-blue-800',
            }
            const badgeClass = classMap[status] || 'bg-gray-100 text-gray-800'
            return `<span class="${badgeClass} text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm">${status}</span>`
        }
    },
    { headerName: 'Action', width: 200, flex: 2 },
])

</script>
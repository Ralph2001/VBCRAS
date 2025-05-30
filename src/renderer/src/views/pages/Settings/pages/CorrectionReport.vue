<template>
    <div class="flex flex-col gap-5 ml-80">
        <div>
            <h1 class="text-3xl font-semibold text-gray-800 font-sans">Correction of Clerical Errors
            </h1>
            <p class="text-gray-600 mt-1 text-sm">
                Overview and reporting for CCE & CFN petitions.
            </p>
        </div>

        <div class="w-full flex">
            <router-link to="/pages/cce"
                class="px-6 py-2.5 bg-blue-600 w-80 ml-auto hover:bg-blue-700 text-white font-semibold rounded-md shadow-lg  transition duration-200 ease-in-out flex flex-row items-center justify-center text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75">
                <svg class="w-5 h-5 mr-2 " fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd"
                        d="M3 6a3 3 0 013-3h10a2 2 0 012 2v8a2 2 0 01-2 2H6a3 3 0 01-3-3V6zm4 0a1 1 0 011-1h2a1 1 0 110 2H8a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H8z"
                        clip-rule="evenodd"></path>
                </svg>
                <p>
                    Open Application

                </p>
            </router-link>
        </div>

        <div class="flex justify-end flex-row items-center w-full">
            <label for="year-selector" class="block text-sm font-medium text-gray-700 mr-2">Select Year:</label>
            <select v-model="formData.yearData" id="year-selector"
                class="px-3 py-2.5 bg-white w-40 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                <option value="" disabled>Year</option>
                <option v-for="year in uniqueYears" :key="year" :value="year">{{ year }}</option>
            </select>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mt-4">
            <div class="bg-white p-5 shadow-lg rounded-lg">
                <h3 class="text-sm font-medium text-gray-500">Total Petitions</h3>
                <p class="mt-1 text-3xl font-semibold text-gray-900">{{ totalPetitions }}</p>
            </div>
            <div class="bg-white p-5 shadow-lg rounded-lg">
                <h3 class="text-sm font-medium text-gray-500">Pending Petitions</h3>
                <p class="mt-1 text-3xl font-semibold text-yellow-500">{{ pendingPetitions }}</p>
            </div>
            <div class="bg-white p-5 shadow-lg rounded-lg">
                <h3 class="text-sm font-medium text-gray-500">Approved Petitions</h3>
                <p class="mt-1 text-3xl font-semibold text-green-600">{{ approvedPetitions }}</p>
            </div>
            <div class="bg-white p-5 shadow-lg rounded-lg">
                <h3 class="text-sm font-medium text-gray-500">Migrant Petitions</h3>
                <p class="mt-1 text-3xl font-semibold text-blue-600">{{ migrantPetitions }}</p>
            </div>
            <div class="bg-white p-5 shadow-lg rounded-lg">
                <h3 class="text-sm font-medium text-gray-500">Indigent Petitions</h3>
                <p class="mt-1 text-3xl font-semibold text-purple-600">{{ indigentPetitions }}</p>
            </div>
        </div>




        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white p-5 shadow-lg rounded-lg col-span-1 ">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Petitions by Status</h3>
                <div class="h-64 p-4  flex justify-center items-center">

                    <Pie :data="StatusChartData" :options="StatusChartOptions" />

                </div>
            </div>

            <div class="bg-white p-5 shadow-lg rounded-lg col-span-1 ">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Petitions by Type (CCE/CFN)</h3>
                <div class="h-64 w-full">
                    <Bar :data="barChartData" :options="barChartOptions" />
                </div>
            </div>



            <div class="bg-white p-5 shadow-lg rounded-lg col-span-2">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Petitions Filed Over Time</h3>
                <div class="h-72 w-full ">
                    <Line :data="lineChartData" :options="lineChartOptions" />
                </div>
            </div>
        </div>

        <div class="border-2 border-dashed border-green-400 my-10"></div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div
                class="bg-white p-6 shadow-md rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-200 ease-in-out">
                <div class="flex items-center justify-between">
                    <h3 class="text-base font-medium text-gray-600">Latest CCE Petition</h3>
                    <svg class="h-6 w-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                        </path>
                    </svg>
                </div>
                <p class="mt-2 text-2xl font-extrabold text-gray-900 truncate">
                    {{ petitionStore.cce_latest?.data.petition_number || 'N/A' }}

                </p>
                <p class="mt-1 text-sm text-gray-500">Clerical Error Correction</p>
            </div>

            <div
                class="bg-white p-6 shadow-md rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-200 ease-in-out">
                <div class="flex items-center justify-between">
                    <h3 class="text-base font-medium text-gray-600">Latest CFN Petition</h3>
                    <svg class="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                        </path>
                    </svg>
                </div>
                <p class="mt-2 text-2xl font-extrabold text-gray-900 truncate">
                    {{ petitionStore.cfn_latest?.data.petition_number || 'N/A' }}

                </p>
                <p class="mt-1 text-sm text-gray-500">Change of First Name</p>
            </div>
        </div>

        <div class="bg-white p-6 shadow-lg rounded-lg">
            <div class="flex flex-col md:flex-row justify-between md:items-center mb-6">
                <h2 class="text-xl font-semibold text-gray-800 mb-3 md:mb-0">Filter Data & Export</h2>
                <button @click="exportReport"
                    class="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md shadow-md hover:shadow-lg transition duration-150 ease-in-out flex items-center justify-center text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                        class="w-5 h-5 mr-2">
                        <path
                            d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
                        <path
                            d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
                    </svg>
                    Export Report
                </button>
            </div>

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
                    <input v-model="search" type="text" placeholder="Search petitions by keyword, type, etc..."
                        class="w-full pl-10 pr-4 py-2.5 font-medium border border-gray-300 rounded-md shadow-sm text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out" />
                </div>
                <button @click="clearFilters"
                    class="w-full sm:w-auto px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-md shadow-sm hover:shadow-md transition duration-150 ease-in-out flex items-center justify-center text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                        class="w-5 h-5 mr-2">
                        <path
                            d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                    </svg>
                    Clear Filters
                </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
                <div class="space-y-4">
                    <p class="text-sm font-semibold text-gray-700">Date Range</p>
                    <div>
                        <label for="filterPetitionYear" class="block text-sm font-medium text-gray-700 mb-1">Petition
                            Year</label>
                        <select id="filterPetitionYear" v-model="filters.year"
                            class="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                            <option value="">All Years</option>
                            <option v-for="year in uniqueYears" :key="year" :value="year">{{ year }}</option>
                        </select>
                    </div>
                    <div>
                        <label for="filterPetitionMonth" class="block text-sm font-medium text-gray-700 mb-1">
                            Month</label>
                        <select id="filterPetitionMonth" v-model="filters.month"
                            class="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                            <option value="">All Months</option>
                            <option v-for="month in months" :key="month.value" :value="month.value">{{ month.label }}
                            </option>
                        </select>
                    </div>
                </div>

                <div class="space-y-4">
                    <p class="text-sm font-semibold text-gray-700">Petition Details</p>
                    <div>
                        <label for="filterPetitionType" class="block text-sm font-medium text-gray-700 mb-1">Petition
                            Type</label>
                        <select id="filterPetitionType" v-model="filters.petitionType"
                            class="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                            <option value="">All Types</option>
                            <option value="CCE">CCE (Clerical Error)</option>
                            <option value="CFN">CFN (Change of First Name)</option>
                        </select>
                    </div>
                    <div>
                        <label for="filterEventType" class="block text-sm font-medium text-gray-700 mb-1">Event
                            Type</label>
                        <select id="filterEventType" v-model="filters.eventType"
                            class="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                            <option value="">All Event Types</option>
                            <option value="Birth">Birth</option>
                            <option value="Death">Death</option>
                            <option value="Marriage">Marriage</option>
                        </select>
                    </div>
                </div>

                <div class="space-y-4">
                    <p class="text-sm font-semibold text-gray-700">Administrative</p>
                    <div>
                        <label for="filterStatus" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select id="filterStatus" v-model="filters.status"
                            class="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                            <option value="">All Statuses</option>
                            <option value="PENDING">Pending</option>
                            <option value="FINISHED">Approved</option>
                        </select>
                    </div>
                    <div>
                        <label for="filterUser" class="block text-sm font-medium text-gray-700 mb-1">User</label>
                        <select id="filterUser" v-model="filters.user"
                            class="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                            <option value="">All Users</option>
                            <option v-for="user in uniqueUsers" :key="user" :value="user">{{ user }}</option>
                        </select>
                    </div>
                </div>
            </div>

            <hr class="my-6 border-gray-200">

            <div class="flex items-center justify-between mb-4">
                <p class="font-semibold text-gray-700">Total Records: <span class="text-blue-600 text-lg">{{
                    filteredRowData.length }}</span></p>
            </div>

            <div class="h-[30rem] w-full flex flex-col gap-2 ">
                <ag-grid-vue :rowData="filteredRowData" :columnDefs="colDefs" class="ag-theme-quartz h-full"
                    :pagination="true" :paginationPageSize="20" :paginationPageSizeSelector="true">
                </ag-grid-vue>
            </div>
        </div>


    </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue';
import { Line, Pie, Bar } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title, LineElement, PointElement, LinearScale, CategoryScale, BarElement } from 'chart.js'
import { usePetitions } from '../../../../stores/Petition/petitions';
import { watch } from 'vue';
import TableGrid from '../../../../components/TableGrid.vue';
import PetitionNumberRenderer from '../../../../components/PetitionNumberRenderer.vue';
import DocumentStatus from '../../../../components/essentials/buttons/table/DocumentStatus.vue';
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-quartz.css"
import { AgGridVue } from "ag-grid-vue3"
import { isValid, parseISO } from 'date-fns';


const petitionStore = usePetitions()
ChartJS.register(ArcElement, Tooltip, Legend, Title, LineElement, PointElement, LinearScale, CategoryScale, BarElement)




const search = ref(null)
const filteredRowData = computed(() => {

    return petitionStore.petitions.filter(petition => {
        const date = parseISO(petition.date_filed)
        const matchesSearch = !search.value || Object.values(petition).some(value =>
            String(value).toLowerCase().includes(search.value.toLowerCase())
        )

        const matchUserCreated = !filters.user || petition.created_by_user?.username === filters.user
        const matchPetitionType = !filters.petitionType || petition.petition_type === filters.petitionType
        const matchEventType = !filters.eventType || petition.event_type === filters.eventType
        const matchStatusType = !filters.status || petition.status === filters.status

        const matchesYear = !filters.year || (isValid(date) && date.getFullYear().toString() === filters.year)
        const matchesMonth = !filters.month || (isValid(date) && (date.getMonth() + 1).toString().padStart(2, '0') === filters.month)

        return matchesSearch && matchUserCreated && matchPetitionType && matchEventType && matchStatusType && matchesYear && matchesMonth
    });


});



const baseFilter = {
    year: '',
    month: '',
    petitionType: '',
    eventType: '',
    status: '',
    user: '',
}
const filters = reactive({ ...baseFilter })

const clearFilters = () => {
    Object.assign(filters, baseFilter)
    search.value = null
}

const colDefs = ref([
    {
        field: "petition_number",
        headerName: "Petitioner Number",
        flex: 2,

        pinned: "left",
        lockPinned: true,
        cellStyle: { border: "none" },
        width: 240,
        cellRenderer: PetitionNumberRenderer,
    },
    {
        field: "petitioner_name",
        headerName: "Petitioner Name",
        flex: 1,
        cellClass: "font-medium tracking-wider w-full text-gray-600",

    },
    {
        field: "document_owner",
        cellClass: "font-medium tracking-wider w-full text-gray-900",
        headerName: "Document Owner",
        flex: 1,

    },

    {
        field: "petition_type",
        cellClass: "font-medium tracking-wider w-full text-gray-600",
        headerName: "Petition Type",
        flex: 1,

    },
    {
        field: "event_type",
        cellClass: "font-medium tracking-wider w-full text-gray-600",
        headerName: "Document Type",
        flex: 1,

    },
    {
        field: "date_filed",
        headerName: "Date Filed",
        flex: 1,

        cellClass: "font-medium tracking-wider w-full text-gray-600",
    },
    {
        field: "created_by_user.username",
        cellClass: "font-medium tracking-wider w-full text-gray-600",
        headerName: "Prepared by",
        flex: 1,

    },
    {
        headerName: "Document Status",
        flex: 2,
        pinned: "right",
        lockPinned: true,
        resizable: false,
        cellRenderer: DocumentStatus,
        cellClass: "text-center",
        cellStyle: { overflow: "visible", border: "none" },
        sortable: false,
    },
    //   {
    //     headerName: "Action",
    //     cellStyle: { border: "none" },
    //     pinned: "right",
    //     width: 100,
    //     lockPinned: true,
    //     resizable: true,
    //     sortable: false,
    //     cellStyle: { overflow: "visible", border: "none" },
    //     cellRenderer: ViewBTn,
    //     cellRendererParams: {
    //       onClick: handleEdit,
    //       onRegenerate: openRegenerate,
    //     },
    //   },

]);


const uniqueUsers = computed(() =>
    [...new Set(petitionStore.petitions.map(petition => petition.created_by_user?.username))].filter(Boolean)
)



const formData = reactive({
    yearData: new Date().getFullYear()
})


// Fetch all petitions on component mount
onMounted(() => {
    petitionStore.get_all_petitions()
    petitionStore.get_latest_cce()
    petitionStore.get_latest_cfn()
})

// Watch for changes in yearData and re-fetch/filter petitions
watch(() => formData.yearData, (newYear) => {
    // You might want to re-fetch from the API if your initial fetch
    // only gets a subset of data. If `get_all_petitions` truly gets ALL data,
    // then you only need to filter locally.
    // For now, let's assume get_all_petitions gets everything and we filter client-side.
    // If your dataset is huge, you'd modify get_all_petitions to accept a year parameter
    // and make an API call here: petitionStore.get_all_petitions(newYear);
    console.log(`Selected year changed to: ${newYear}`);
})

// --- Computed properties for filtering and counting ---

// Get unique years from all petitions for the dropdown
const uniqueYearsToBeUsed = computed(() => {
    const years = new Set();
    petitionStore.petitions.forEach(petition => {
        if (petition.created_at) {
            const date = new Date(petition.created_at);
            years.add(date.getFullYear());
        }
    });
    return Array.from(years).sort((a, b) => b - a); // Sort descending
});

// Filter petitions based on the selected year
const filteredPetitions = computed(() => {
    if (!formData.yearData) {
        return petitionStore.petitions; // Return all if no year is selected
    }
    return petitionStore.petitions.filter(petition => {
        if (petition.created_at) {
            const petitionYear = new Date(petition.created_at).getFullYear();
            return petitionYear === formData.yearData;
        }
        return false;
    });
});

// Calculate statistics based on filtered petitions
const totalPetitions = computed(() => filteredPetitions.value.length);
const pendingPetitions = computed(() => filteredPetitions.value.filter(p => p.status === 'PENDING').length);
const approvedPetitions = computed(() => filteredPetitions.value.filter(p => p.status === 'FINISHED').length); // Assuming 'APPROVED' status
const migrantPetitions = computed(() => filteredPetitions.value.filter(p => p.is_migrant).length);
const indigentPetitions = computed(() => filteredPetitions.value.filter(p => p.is_indigent).length);

// Make sure your `formData.yearData` is initialized with a year that exists in your data
// Or provide an option like "All Years"
onMounted(() => {
    petitionStore.get_all_petitions();
    // Set initial year to the current year or the latest available year
    if (uniqueYearsToBeUsed.value.length > 0 && !uniqueYearsToBeUsed.value.includes(formData.yearData)) {
        formData.yearData = uniqueYearsToBeUsed.value[0]; // Set to the latest year if current year isn't present
    }
});



const StatusChartData = computed(() => {
    const pendingCount = pendingPetitions.value;
    const approvedCount = approvedPetitions.value;
    // Add other statuses if you have them and want to display them in the chart
    // const rejectedCount = filteredPetitions.value.filter(p => p.status === 'REJECTED').length;

    return {
        labels: ['Pending', 'Approved'], // Add more labels if you add more statuses
        datasets: [
            {
                backgroundColor: ['#FACC15', '#22C55E'], // Tailwind yellow-400/500 and green-500/600. #FFFF00 is very bright.
                data: [pendingCount, approvedCount] // Pass the computed counts
            }
        ]
    };
});

const StatusChartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allows you to control the height/width of the chart div
    plugins: {
        legend: {
            position: 'bottom', // Position legend below the chart
        },
        tooltip: {
            callbacks: {
                label: function (context) {
                    let label = context.label || '';
                    if (label) {
                        label += ': ';
                    }
                    if (context.parsed !== null) {
                        label += context.parsed + ' petitions'; // Add "petitions" to tooltip
                    }
                    return label;
                }
            }
        }
    }
}


const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false, // Often not needed for single dataset bar charts
        },
        tooltip: {
            callbacks: {
                label: function (context) {
                    let label = context.dataset.label || '';
                    if (label) {
                        label += ': ';
                    }
                    if (context.parsed.y !== null) {
                        label += context.parsed.y + ' petitions';
                    }
                    return label;
                }
            }
        }
    },
    scales: {
        y: {
            beginAtZero: true,
            title: {
                display: true,
                text: 'Number of Petitions'
            },
            ticks: {
                // Ensure integer ticks for petition counts
                callback: function (value) {
                    if (Number.isInteger(value)) {
                        return value;
                    }
                }
            }
        },
        x: {
            title: {
                display: true,
                text: 'Petition Type'
            }
        }
    }
}

const barChartData = computed(() => {
    const cceCount = filteredPetitions.value.filter(p => p.petition_type === 'CCE').length;
    const cfnCount = filteredPetitions.value.filter(p => p.petition_type === 'CFN').length;

    return {
        labels: ['CCE', 'CFN'], // Labels for the bars
        datasets: [
            {
                label: 'Number of Petitions', // Label for the dataset
                backgroundColor: ['#6366F1', '#EC4899'], // Indigo-500, Pink-500
                data: [cceCount, cfnCount] // Data points for each type
            }
        ]
    };
});


const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false, // Often not needed for a single line dataset
        },
        tooltip: {
            callbacks: {
                label: function (context) {
                    let label = context.dataset.label || '';
                    if (label) {
                        label += ': ';
                    }
                    if (context.parsed.y !== null) {
                        label += context.parsed.y + ' petitions';
                    }
                    return label;
                }
            }
        }
    },
    scales: {
        y: {
            beginAtZero: true,
            title: {
                display: true,
                text: 'Total Petitions'
            },
            ticks: {
                callback: function (value) {
                    if (Number.isInteger(value)) {
                        return value;
                    }
                }
            }
        },
        x: {
            title: {
                display: true,
                text: 'Month'
            }
        }
    }
};


const lineChartData = computed(() => {
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    // Initialize counts for each month to 0
    const monthlyCounts = Array(12).fill(0);

    // Iterate through filtered petitions and count by month
    filteredPetitions.value.forEach(petition => {
        if (petition.created_at) {
            const date = new Date(petition.created_at);
            const month = date.getMonth(); // getMonth() returns 0 for January, 11 for December
            if (month >= 0 && month < 12) { // Ensure valid month index
                monthlyCounts[month]++;
            }
        }
    });

    return {
        labels: monthNames,
        datasets: [
            {
                label: `Petitions Filed in ${formData.yearData}`, // Dynamic label
                backgroundColor: '#3B82F6', // Blue-500
                borderColor: '#3B82F6',
                pointBackgroundColor: '#3B82F6',
                data: monthlyCounts,
                tension: 0.3, // Adds a slight curve to the line
                fill: false // Do not fill area under the line
            }
        ]
    };
});


const uniqueYears = computed(() =>
    [...new Set(
        petitionStore.petitions
            .map(petition => petition.date_filed?.slice(0, 4)) // extract year
            .filter(Boolean) // remove undefined/null/empty
    )]
)


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




function exportReport() {
    console.log("Exporting report with filters:", filters.value);
    alert('Export functionality to be implemented. Data would be exported based on current filters.');
}

</script>

<style scoped>
/* Add any component-specific styles here if needed */
/* For instance, if your charting library requires specific container styling not covered by Tailwind */
.h-64 {
    height: 16rem;
}

/* 256px */
.h-72 {
    height: 18rem;
}

/* 288px */
.h-80 {
    height: 20rem;
}

/* 320px */
.h-96 {
    height: 24rem;
}

/* 384px */
</style>
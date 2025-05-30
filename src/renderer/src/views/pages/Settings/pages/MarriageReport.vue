<template>
    <div class="flex flex-col gap-5 ml-80">
        <div>
            <h1 class="text-3xl font-semibold text-gray-800 font-sans">Marriage License Applications</h1>
            <p class="text-gray-600 mt-1 text-sm">
                Overview and reporting for marriage license applications.
            </p>
        </div>

        <div class="w-full flex">
            <router-link to="/pages/marriage-license"
                class="px-6 py-2.5 bg-blue-600 w-80 ml-auto hover:bg-blue-700 text-white font-semibold rounded-md shadow-lg transition duration-200 ease-in-out flex flex-row items-center justify-center text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75">
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd"
                        d="M3 6a3 3 0 013-3h10a2 2 0 012 2v8a2 2 0 01-2 2H6a3 3 0 01-3-3V6zm4 0a1 1 0 011-1h2a1 1 0 110 2H8a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H8z"
                        clip-rule="evenodd"></path>
                </svg>
                <p>Open Application</p>
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
                <h3 class="text-sm font-medium text-gray-500">Total Applications</h3>
                <p class="mt-1 text-3xl font-semibold text-gray-900">{{ totalApplications }}</p>
            </div>
            <div class="bg-white p-5 shadow-lg rounded-lg">
                <h3 class="text-sm font-medium text-gray-500">Marriages This Year</h3>
                <p class="mt-1 text-3xl font-semibold text-yellow-500">{{ marriagesThisYear }}</p>
            </div>
            <div class="bg-white p-5 shadow-lg rounded-lg">
                <h3 class="text-sm font-medium text-gray-500">Foreign National Marriages</h3>
                <p class="mt-1 text-3xl font-semibold text-green-600">{{ foreignNationalMarriages }}</p>
            </div>
            <div class="bg-white p-5 shadow-lg rounded-lg">
                <h3 class="text-sm font-medium text-gray-500">Interfaith Marriages</h3>
                <p class="mt-1 text-3xl font-semibold text-blue-600">{{ interfaithMarriages }}</p>
            </div>
            <div class="bg-white p-5 shadow-lg rounded-lg">
                <h3 class="text-sm font-medium text-gray-500">Previously-Married Applicants</h3>
                <p class="mt-1 text-3xl font-semibold text-purple-600">{{ previouslyMarriedApplicants }}</p>
            </div>
        </div>



        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
            <div class="bg-white p-5 shadow-lg rounded-lg">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Groom Age Statistics</h3>
                <div class="space-y-2 text-gray-700">
                    <p><span class="font-semibold">Average Age:</span> {{ groomAgeStats.average }}</p>
                    <p><span class="font-semibold">Median Age:</span> {{ groomAgeStats.median }}</p>
                    <p><span class="font-semibold">Mode Age(s):</span> {{ groomAgeStats.mode }}</p>
                </div>
            </div>

            <div class="bg-white p-5 shadow-lg rounded-lg">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Bride Age Statistics</h3>
                <div class="space-y-2 text-gray-700">
                    <p><span class="font-semibold">Average Age:</span> {{ brideAgeStats.average }}</p>
                    <p><span class="font-semibold">Median Age:</span> {{ brideAgeStats.median }}</p>
                    <p><span class="font-semibold">Mode Age(s):</span> {{ brideAgeStats.mode }}</p>
                </div>
            </div>
        </div>

        <div class="bg-white p-5 shadow-lg rounded-lg col-span-2">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Applicants by Age Group</h3>
            <div class="h-80 w-full">
                <Bar :data="ageGroupBarChartData" :options="AveAgeOptionChart" />
            </div>
        </div>



        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white p-5 shadow-lg rounded-lg col-span-1">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Applications by Marital Status</h3>
                <div class="h-64 p-4 flex justify-center items-center">
                    <Pie :data="statusChartData" :options="chartOptions" />
                </div>
            </div>
            <div class="bg-white p-5 shadow-lg rounded-lg col-span-1">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Applications by Religion</h3>
                <div class="h-64 w-full">
                    <Bar :data="religionBarChartData" :options="chartOptions" />
                </div>
            </div>
            <div class="bg-white p-5 shadow-lg rounded-lg col-span-2">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Applications Filed Over Time</h3>
                <div class="h-72 w-full">
                    <Line :data="lineChartData" :options="chartOptions" />
                </div>
            </div>
        </div>

        <div class="border-2 border-dashed border-green-400 my-10"></div>

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
                    <input v-model="search" type="text" placeholder="Search by name, registry number, etc..."
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
                        <label for="filterYear" class="block text-sm font-medium text-gray-700 mb-1">Filing Year</label>
                        <select id="filterYear" v-model="filters.year"
                            class="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                            <option value="">All Years</option>
                            <option v-for="year in uniqueYears" :key="year" :value="year">{{ year }}</option>
                        </select>
                    </div>
                </div>
                <div class="space-y-4">
                    <p class="text-sm font-semibold text-gray-700">Applicant Details</p>
                    <div>
                        <label for="filterCitizenship"
                            class="block text-sm font-medium text-gray-700 mb-1">Citizenship</label>
                        <select id="filterCitizenship" v-model="filters.citizenship"
                            class="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                            <option value="">All</option>
                            <option v-for="c in uniqueCitizenships" :key="c" :value="c">{{ c }}</option>
                        </select>
                    </div>
                </div>
                <div class="space-y-4">
                    <p class="text-sm font-semibold text-gray-700">Administrative</p>
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

            <div class="flex  items-center justify-between mb-4">
                <p class="font-semibold text-gray-700">Total Records: <span class="text-blue-600 text-lg">{{
                    filteredRowData.length }}</span></p>
            </div>

            <div class="h-[30rem] w-full flex flex-col gap-2">
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
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title, LineElement, PointElement, LinearScale, CategoryScale, BarElement } from 'chart.js';
import { watch } from 'vue';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridVue } from "ag-grid-vue3";
import { isValid, parseISO } from 'date-fns';

// NEW: Import the correct Pinia store
import { useApplicationMarriageLicense } from '../../../../stores/APL';

// NEW: Initialize the correct store
const applicationStore = useApplicationMarriageLicense();
ChartJS.register(ArcElement, Tooltip, Legend, Title, LineElement, PointElement, LinearScale, CategoryScale, BarElement);

const search = ref(null);

// MODIFIED: Base filter object for marriage applications
const baseFilter = {
    year: '',
    citizenship: '',
    user: '',
};
const filters = reactive({ ...baseFilter });

const clearFilters = () => {
    Object.assign(filters, baseFilter);
    search.value = null;
};

// MODIFIED: Column definitions for the AG Grid
const colDefs = ref([
    { field: "registry_number", headerName: "Registry No.", pinned: "left", width: 180 },
    { field: "groom_full_name", headerName: "Groom's Name", flex: 1 },
    { field: "bride_full_name", headerName: "Bride's Name", flex: 1 },
    { field: "date_of_marriage", headerName: "Date of Marriage", flex: 1 },
    { field: "place_of_marriage", headerName: "Place of Marriage", flex: 1 },
    {
        field: "created_at", headerName: "Date Filed", flex: 1,
        valueFormatter: p => p.value ? new Date(p.value).toLocaleDateString() : 'N/A'
    },
    { field: "created_by.username", headerName: "Prepared by", flex: 1 },
]);

const formData = reactive({
    yearData: new Date().getFullYear().toString()
});

// Fetch all applications on component mount
onMounted(() => {
    applicationStore.getApplicationMarriageLicense();
});

// --- Computed properties for filtering and counting ---

// MODIFIED: Use application_marriage_license from the store
const allApplications = computed(() => applicationStore.application_marriage_license.map(app => ({
    ...app,
    groom_full_name: `${app.groom_first_name} ${app.groom_last_name}`,
    bride_full_name: `${app.bride_first_name} ${app.bride_last_name}`,
}))
);

// Get unique years from all applications for the dropdown
const uniqueYears = computed(() => {
    const years = new Set(allApplications.value.map(app => {
        const date = new Date(app.created_at);
        return isValid(date) ? date.getFullYear() : null;
    }).filter(Boolean));
    return Array.from(years).sort((a, b) => b - a);
});


// Filter applications based on the selected year for the dashboard
const filteredByYear = computed(() => {
    if (!formData.yearData) return allApplications.value;
    return allApplications.value.filter(app => {
        const appYear = new Date(app.created_at).getFullYear().toString();
        return appYear === formData.yearData;
    });
});

// MODIFIED: Calculate new statistics based on the filtered applications
const totalApplications = computed(() => filteredByYear.value.length);
const marriagesThisYear = computed(() => filteredByYear.value.filter(p => p.date_of_marriage && new Date(p.date_of_marriage).getFullYear().toString() === formData.yearData).length);
const foreignNationalMarriages = computed(() => filteredByYear.value.filter(p => p.groom_citizenship?.toLowerCase() !== 'filipino' || p.bride_citizenship?.toLowerCase() !== 'filipino').length);
const interfaithMarriages = computed(() => filteredByYear.value.filter(p => p.groom_religion !== p.bride_religion).length);
const previouslyMarriedApplicants = computed(() => filteredByYear.value.filter(p => p.groom_previously_married_dissolved !== 'N/A' || p.bride_previously_married_dissolved !== 'N/A').length);

// MODIFIED: Row data for AG Grid with multi-filtering
const filteredRowData = computed(() => {
    return allApplications.value.filter(app => {
        const date = parseISO(app.created_at);
        const matchesSearch = !search.value || Object.values(app).some(value =>
            String(value).toLowerCase().includes(search.value.toLowerCase())
        );
        const matchesYear = !filters.year || (isValid(date) && date.getFullYear().toString() === filters.year);
        const matchesUser = !filters.user || app.user?.username === filters.user;
        const matchesCitizenship = !filters.citizenship || app.groom_citizenship === filters.citizenship || app.bride_citizenship === filters.citizenship;

        return matchesSearch && matchesYear && matchesUser && matchesCitizenship;
    });
});

// --- Chart Data and Options ---

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
};

// MODIFIED: Pie chart for groom's civil status
const statusChartData = computed(() => {
    const statusCounts = filteredByYear.value.reduce((acc, app) => {
        // Count groom's civil status
        const groomStatus = app.groom_civil_status || 'Unknown';
        acc[groomStatus] = (acc[groomStatus] || 0) + 1;

        // Count bride's civil status
        const brideStatus = app.bride_civil_status || 'Unknown';
        acc[brideStatus] = (acc[brideStatus] || 0) + 1;

        return acc;
    }, {});

    return {
        labels: Object.keys(statusCounts),
        datasets: [{
            backgroundColor: ['#6366F1', '#EC4899', '#FBBF24', '#22C55E', '#A855F7', '#EF4444'], // Added more colors just in case
            data: Object.values(statusCounts)
        }]
    };
});

// NEW: Bar chart for applications by religion
const religionBarChartData = computed(() => {
    const religionCounts = filteredByYear.value.reduce((acc, app) => {
        // Count groom's religion
        const groomReligion = app.groom_religion || 'Unknown';
        acc[groomReligion] = (acc[groomReligion] || 0) + 1;

        // Count bride's religion
        const brideReligion = app.bride_religion || 'Unknown';
        acc[brideReligion] = (acc[brideReligion] || 0) + 1;

        return acc;
    }, {});

    return {
        labels: Object.keys(religionCounts),
        datasets: [{
            label: 'Number of Applications',
            backgroundColor: '#3B82F6',
            data: Object.values(religionCounts)
        }]
    };
});


// MODIFIED: Line chart data remains conceptually the same
const lineChartData = computed(() => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthlyCounts = Array(12).fill(0);
    filteredByYear.value.forEach(app => {
        if (app.created_at) {
            const month = new Date(app.created_at).getMonth();
            if (month >= 0 && month < 12) {
                monthlyCounts[month]++;
            }
        }
    });
    return {
        labels: monthNames,
        datasets: [{
            label: `Applications Filed in ${formData.yearData}`,
            backgroundColor: '#fbd5d5 ',
            borderColor: '#f98080',
            data: monthlyCounts,
            tension: 0.3,
        }]
    };
});

// --- Dynamic Filter Options ---

const uniqueUsers = computed(() =>
    [...new Set(allApplications.value.map(app => app.user?.username))].filter(Boolean)
);

const uniqueCitizenships = computed(() =>
    [...new Set([
        ...allApplications.value.map(app => app.groom_citizenship),
        ...allApplications.value.map(app => app.bride_citizenship)
    ])].filter(Boolean)
);

function exportReport() {
    alert('Export functionality to be implemented. Data would be exported based on current filters.');
}



/**
 * This is for Average Age
 */

const parsedAges = computed(() => {
    const groomAges = [];
    const brideAges = [];

    filteredByYear.value.forEach(app => {
        const groomAge = parseInt(app.groom_age, 10);
        const brideAge = parseInt(app.bride_age, 10);

        if (!isNaN(groomAge)) {
            groomAges.push(groomAge);
        }
        if (!isNaN(brideAge)) {
            brideAges.push(brideAge);
        }
    });

    return { groomAges, brideAges };
});

// --- Helper Functions for Stats ---

// Function to calculate average
const calculateAverage = (arr) => {
    if (arr.length === 0) return 0;
    const sum = arr.reduce((a, b) => a + b, 0);
    return (sum / arr.length).toFixed(2);
};

// Function to calculate median
const calculateMedian = (arr) => {
    if (arr.length === 0) return 0;
    const sortedArr = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sortedArr.length / 2);
    if (sortedArr.length % 2 === 0) {
        return ((sortedArr[mid - 1] + sortedArr[mid]) / 2).toFixed(2);
    }
    return sortedArr[mid].toFixed(2);
};

// Function to calculate mode
const calculateMode = (arr) => {
    if (arr.length === 0) return 'N/A';
    const counts = {};
    arr.forEach(num => {
        counts[num] = (counts[num] || 0) + 1;
    });

    let mode = [];
    let maxCount = 0;

    for (const num in counts) {
        if (counts[num] > maxCount) {
            mode = [parseInt(num, 10)];
            maxCount = counts[num];
        } else if (counts[num] === maxCount) {
            mode.push(parseInt(num, 10));
        }
    }
    return mode.length === Object.keys(counts).length ? 'N/A (No distinct mode)' : mode.join(', '); // If all numbers appear once
};

// --- Computed Properties for Age Stats ---

const groomAgeStats = computed(() => {
    const ages = parsedAges.value.groomAges;
    return {
        average: calculateAverage(ages),
        median: calculateMedian(ages),
        mode: calculateMode(ages)
    };
});

const brideAgeStats = computed(() => {
    const ages = parsedAges.value.brideAges;
    return {
        average: calculateAverage(ages),
        median: calculateMedian(ages),
        mode: calculateMode(ages)
    };
});

// --- Age Group Logic ---

const ageGroupLabels = ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'];

const ageGroupCounts = computed(() => {
    const groomGroups = new Array(ageGroupLabels.length).fill(0);
    const brideGroups = new Array(ageGroupLabels.length).fill(0);

    parsedAges.value.groomAges.forEach(age => {
        if (age >= 18 && age <= 24) groomGroups[0]++;
        else if (age >= 25 && age <= 34) groomGroups[1]++;
        else if (age >= 35 && age <= 44) groomGroups[2]++;
        else if (age >= 45 && age <= 54) groomGroups[3]++;
        else if (age >= 55 && age <= 64) groomGroups[4]++;
        else if (age >= 65) groomGroups[5]++;
    });

    parsedAges.value.brideAges.forEach(age => {
        if (age >= 18 && age <= 24) brideGroups[0]++;
        else if (age >= 25 && age <= 34) brideGroups[1]++;
        else if (age >= 35 && age <= 44) brideGroups[2]++;
        else if (age >= 45 && age <= 54) brideGroups[3]++;
        else if (age >= 55 && age <= 64) brideGroups[4]++;
        else if (age >= 65) brideGroups[5]++;
    });

    return { groomGroups, brideGroups };
});

const ageGroupBarChartData = computed(() => {
    return {
        labels: ageGroupLabels,
        datasets: [
            {
                label: 'Groom Ages',
                backgroundColor: '#4A90E2', // A blue color
                data: ageGroupCounts.value.groomGroups
            },
            {
                label: 'Bride Ages',
                backgroundColor: '#F5A623', // An orange/yellow color
                data: ageGroupCounts.value.brideGroups
            }
        ]
    };
});

const AveAgeOptionChart = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
        },
        tooltip: {
            callbacks: {
                label: function (context) {
                    let label = context.dataset.label || '';
                    if (label) {
                        label += ': ';
                    }
                    if (context.parsed.y !== null) {
                        label += context.parsed.y;
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
                text: 'Number of Applicants'
            }
        },
        x: {
            title: {
                display: true,
                text: 'Age Group'
            }
        }
    }
};


</script>

<style scoped>
/* Scoped styles can remain the same */
.h-64 {
    height: 16rem;
}

.h-72 {
    height: 18rem;
}
</style>
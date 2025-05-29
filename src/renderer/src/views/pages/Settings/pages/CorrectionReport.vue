<template>
    <div class="flex flex-col ml-80 p-6 h-auto space-y-6 bg-gray-100 min-h-screen">
        <div>
            <h1 class="text-3xl font-semibold text-gray-800 font-sans">Correction of Clerical Errors
            </h1>
            <p class="text-gray-600 mt-1 text-sm">
                Overview and reporting for CCE & CFN petitions.
            </p>
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

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 items-end">


                <div>
                    <label for="filterPetitionType" class="block text-sm font-medium text-gray-700 mb-1">Petition
                        Year</label>
                    <select id="filterPetitionType" v-model="filters.petitionType"
                        class="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                        <option value="">Year</option>
                        <option v-for="year in uniqueYears" :key="year" :year="year">{{ year }}</option>
                    </select>
                </div>
                <div>
                    <label for="filterPetitionType" class="block text-sm font-medium text-gray-700 mb-1">
                        Month</label>
                    <select id="filterPetitionType" v-model="filters.petitionType"
                        class="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                        <option value="">Month</option>
                        <option v-for="month in months" :key="month.value" :value="month.value">{{ month.value }}
                        </option>
                    </select>
                </div>
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
                    <label for="filterEventType" class="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                    <select id="filterEventType" v-model="filters.eventType"
                        class="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                        <option value="">All Event Types</option>
                        <option value="Birth">Birth</option>
                        <option value="Death">Death</option>
                        <option value="Marriage">Marriage</option>
                    </select>
                </div>

                <div>
                    <label for="filterStatus" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select id="filterStatus" v-model="filters.status"
                        class="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                        <option value="">All Statuses</option>
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                    </select>
                </div>

                <div class="flex space-x-2">
                    <button @click="applyFilters"
                        class="w-full mt-4 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md shadow-sm text-sm">Apply
                        Filters</button>
                    <button @click="clearFilters"
                        class="w-full mt-4 px-5 py-2.5 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-md shadow-sm text-sm">Clear
                        Filters</button>
                </div>
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

const petitionStore = usePetitions()
ChartJS.register(ArcElement, Tooltip, Legend, Title, LineElement, PointElement, LinearScale, CategoryScale, BarElement)



const formData = reactive({
    yearData: new Date().getFullYear()
})


// Fetch all petitions on component mount
onMounted(() => {
    petitionStore.get_all_petitions()
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



const Linedata = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [
        {
            label: 'Petitions',
            backgroundColor: '#008000',
            data: [40, 39, 10, 40, 39, 80, 40, 0, 0, 0, 0, 0]
        }
    ]
}

const chartData = {
    labels: ['CCE', 'CFN'],
    datasets: [
        {
            label: 'Type',
            backgroundColor: '#f87979',
            data: [40, 20]
        }
    ]
}


const options = {

    responsive: true,
    maintainAspectRatio: false

}

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


const filters = ref({
    dateFrom: '',
    dateTo: '',
    petitionType: '',
    eventType: '',
    status: '',
    municipality: ''
});

const kpiData = ref({
    totalPetitions: 0,
    pendingPetitions: 0,
    approvedPetitions: 0,
    migrantPetitions: 0,
    indigentPetitions: 0,
});




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
<template>
    <div class="flex flex-col ml-80 p-6 h-auto space-y-6 bg-gray-100 min-h-screen">
        <div>
            <h1 class="text-3xl font-semibold text-gray-800 font-sans">Civil Document Reports</h1>
            <p class="text-gray-600 mt-1 text-sm">
                Generate reports for Birth, Death, and Marriage certificates based on their record status.
            </p>
        </div>

        <div class="bg-white p-6 shadow-lg rounded-lg">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Select Report Type</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                    <label for="documentType" class="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
                    <select id="documentType" v-model="selectedDocumentType" @change="clearReportData"
                        class="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                        <option disabled value="">Please select a type</option>
                        <option value="Birth">Birth Certificate</option>
                        <option value="Death">Death Certificate</option>
                        <option value="Marriage">Marriage Certificate</option>
                    </select>
                </div>
                <div>
                    <label for="recordStatus" class="block text-sm font-medium text-gray-700 mb-1">Record Status</label>
                    <select id="recordStatus" v-model="selectedRecordStatus" @change="clearReportData"
                        class="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                        <option disabled value="">Please select a status</option>
                        <option value="Available">Available Record</option>
                        <option value="Intact">Intact (No Record Found)</option>
                        <option value="Destroyed">Destroyed Record</option>
                    </select>
                </div>
                <button @click="loadReport" :disabled="!selectedDocumentType || !selectedRecordStatus"
                    class="w-full md:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md shadow-sm text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                    Load Report
                </button>
            </div>
        </div>

        <div v-if="reportDataLoaded" class="space-y-6">
            <div class="bg-white p-6 shadow-lg rounded-lg">
                <div class="flex flex-col md:flex-row justify-between md:items-center mb-6">
                    <h2 class="text-xl font-semibold text-gray-800 mb-3 md:mb-0">
                        Report: {{ selectedDocumentType }} - {{ selectedRecordStatus }}
                    </h2>
                    <button @click="exportCurrentReport"
                        class="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md shadow-md hover:shadow-lg transition duration-150 ease-in-out flex items-center justify-center text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                            class="w-5 h-5 mr-2">
                            <path
                                d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
                            <path
                                d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
                        </svg>
                        Export This Report
                    </button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Date Filed Range</label>
                        <div class="flex space-x-2">
                            <input type="date" v-model="filters.dateFrom" class="w-full form-input" />
                            <input type="date" v-model="filters.dateTo" class="w-full form-input" />
                        </div>
                    </div>

                    <div v-if="currentReportConfig && currentReportConfig.filters.includes('sex')">
                        <label for="filterSex" class="block text-sm font-medium text-gray-700 mb-1">Sex</label>
                        <select id="filterSex" v-model="filters.sex" class="w-full form-select">
                            <option value="">All</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                    <div v-if="currentReportConfig && currentReportConfig.filters.includes('is_reconstructed')">
                        <label for="filterReconstructed"
                            class="block text-sm font-medium text-gray-700 mb-1">Reconstructed</label>
                        <select id="filterReconstructed" v-model="filters.is_reconstructed" class="w-full form-select">
                            <option value="">Any</option>
                            <option :value="true">Yes</option>
                            <option :value="false">No</option>
                        </select>
                    </div>
                    <div class="flex space-x-2 md:col-span-full lg:col-span-1 justify-end">
                        <button @click="applyDynamicFilters"
                            class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm text-sm">Apply
                            Filters</button>
                        <button @click="clearDynamicFilters"
                            class="px-5 py-2.5 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-md shadow-sm text-sm">Clear
                            Filters</button>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <div v-for="kpi in (currentReportConfig ? currentReportConfig.kpis : [])" :key="kpi.key"
                    class="bg-white p-5 shadow-lg rounded-lg">
                    <h3 class="text-sm font-medium text-gray-500">{{ kpi.label }}</h3>
                    <p class="mt-1 text-3xl font-semibold text-gray-900">{{ kpiData[kpi.key] || 0 }}</p>
                </div>
                <div v-if="currentReportConfig && (!currentReportConfig.kpis || currentReportConfig.kpis.length === 0)"
                    class="bg-white p-5 shadow-lg rounded-lg col-span-full">
                    <p class="text-center text-gray-500">No KPIs configured for this report type.</p>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div v-for="chart in (currentReportConfig ? currentReportConfig.charts : [])" :key="chart.id"
                    class="bg-white p-5 shadow-lg rounded-lg">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">{{ chart.title }}</h3>
                    <div :class="chart.heightClass || 'h-80'">
                        <p class="text-center text-gray-500 py-10">{{ chart.title }} Placeholder (Type: {{ chart.type
                            }})
                        </p>
                    </div>
                </div>
                <div v-if="currentReportConfig && (!currentReportConfig.charts || currentReportConfig.charts.length === 0)"
                    class="bg-white p-5 shadow-lg rounded-lg col-span-full">
                    <p class="text-center text-gray-500">No charts configured for this report type.</p>
                </div>
            </div>
        </div>
        <div v-else-if="!isLoading" class="bg-white p-10 shadow-lg rounded-lg text-center">
            <p class="text-lg text-gray-600">Please select a document type and record status, then click "Load Report"
                to view data.</p>
        </div>
        <div v-if="isLoading" class="bg-white p-10 shadow-lg rounded-lg text-center">
            <p class="text-lg text-gray-600 animate-pulse">Loading report data...</p>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue';

// Helper function to generate a unique key for report configurations
const generateReportKey = (docType, status) => `${docType}_${status}`.toLowerCase();

// State
const selectedDocumentType = ref('');
const selectedRecordStatus = ref('');
const isLoading = ref(false);
const reportDataLoaded = ref(false);
const filters = reactive({
    dateFrom: '',
    dateTo: '',
});

const kpiData = reactive({});
const chartRawData = reactive({});
const currentReportConfig = ref(null);

// Report configuration
const reportConfigurations = {
    [generateReportKey('Birth', 'Available')]: {
        apiEndpoint: '/api/reports/birth_available',
        kpis: [
            { key: 'totalCertificates', label: 'Total Birth Certificates' },
            { key: 'totalPaid', label: 'Total Amount Paid' },
            { key: 'withAuthentication', label: 'With Authentication' },
            { key: 'reconstructed', label: 'Reconstructed Records' },
        ],
        charts: [
            { id: 'birthAvailableByTime', title: 'Certificates Issued Over Time', type: 'line', heightClass: 'h-96' },
            { id: 'birthAvailableBySex', title: 'Distribution by Sex', type: 'pie' },
            { id: 'birthAvailableByPlace', title: 'Top Places of Birth', type: 'bar' },
        ],
        filters: ['sex', 'place_birth', 'is_reconstructed'],
    },
    [generateReportKey('Death', 'Destroyed')]: {
        apiEndpoint: '/api/reports/death_destroyed',
        kpis: [
            { key: 'totalDestroyed', label: 'Total Death Destroyed Reports' },
            { key: 'totalPaid', label: 'Total Amount Paid (Reports)' },
            { key: 'commonDestroyedBy', label: 'Most Common Destruction Cause' },
        ],
        charts: [
            { id: 'deathDestroyedByTime', title: 'Reports Filed Over Time', type: 'line' },
            { id: 'deathDestroyedByPeriod', title: 'Distribution of Destroyed Periods', type: 'bar' },
        ],
        filters: ['destroyed_by', 'year_range'],
    },
};

// Computed
const activeReportKey = computed(() => {
    if (selectedDocumentType.value && selectedRecordStatus.value) {
        return generateReportKey(selectedDocumentType.value, selectedRecordStatus.value);
    }
    return null;
});

// Methods
function clearReportData() {
    reportDataLoaded.value = false;
    Object.keys(kpiData).forEach(key => delete kpiData[key]);
    Object.keys(chartRawData).forEach(key => delete chartRawData[key]);
    currentReportConfig.value = null;

    filters.dateFrom = '';
    filters.dateTo = '';
}

async function loadReport() {
    if (!activeReportKey.value) return;

    isLoading.value = true;
    clearReportData();

    currentReportConfig.value = reportConfigurations[activeReportKey.value];

    if (!currentReportConfig.value) {
        console.error('No report configuration found for:', activeReportKey.value);
        alert('This report type is not configured yet.');
        isLoading.value = false;
        return;
    }

    // Initialize specific filters
    currentReportConfig.value.filters.forEach(filterKey => {
        if (!(filterKey in filters)) {
            filters[filterKey] = '';
        }
    });

    console.log(`Loading report for: ${activeReportKey.value} from ${currentReportConfig.value.apiEndpoint}`);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulated delay

    // Dummy data
    if (activeReportKey.value === generateReportKey('Birth', 'Available')) {
        Object.assign(kpiData, {
            totalCertificates: 1250,
            totalPaid: 'PHP 150,000',
            withAuthentication: 300,
            reconstructed: 50,
        });
        Object.assign(chartRawData, {
            // chart data
        });
    } else if (activeReportKey.value === generateReportKey('Death', 'Destroyed')) {
        Object.assign(kpiData, {
            totalDestroyed: 75,
            totalPaid: 'PHP 10,000',
            commonDestroyedBy: 'Typhoon',
        });
        Object.assign(chartRawData, {
            // chart data
        });
    } else {
        Object.assign(kpiData, {
            notice: 'Data for this report type is placeholder.',
        });
    }

    reportDataLoaded.value = true;
    isLoading.value = false;
}

function applyDynamicFilters() {
    if (!reportDataLoaded.value) return;
    console.log('Applying filters:', filters, 'for report:', activeReportKey.value);
    loadReport();
}

function clearDynamicFilters() {
    filters.dateFrom = '';
    filters.dateTo = '';

    if (currentReportConfig.value) {
        currentReportConfig.value.filters.forEach(filterKey => {
            filters[filterKey] = '';
        });
    }
}

function exportCurrentReport() {
    if (!reportDataLoaded.value) return;
    console.log('Exporting report:', activeReportKey.value, 'with filters:', filters);
    alert(`Exporting ${selectedDocumentType.value} - ${selectedRecordStatus.value} report. (Functionality to be implemented)`);
}

// Lifecycle
onMounted(() => {
    // Load dropdowns or other init logic
});
</script>


<style scoped>
/* Reusable form input/select styles - you can make these global or keep them scoped */
.form-input,
.form-select {
    @apply w-full px-3 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out;
}

.h-80 {
    height: 20rem;
}

/* 320px */
.h-96 {
    height: 24rem;
}

/* 384px */
</style>
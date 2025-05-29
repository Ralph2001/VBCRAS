<template>
    <div class="flex flex-col ml-80 p-6 h-auto space-y-6 bg-gray-100 min-h-screen">
        <div>
            <h1 class="text-3xl font-semibold text-gray-800 font-sans">Scanned Documents Dashboard</h1>
            <p class="text-gray-600 mt-1 text-sm">
                Analytics and reporting for scanned documents. Current location: Bayambang
            </p>
        </div>

        <div class="bg-white p-6 shadow-lg rounded-lg">
            <div class="flex flex-col md:flex-row justify-between md:items-center mb-6">
                <h2 class="text-xl font-semibold text-gray-800 mb-3 md:mb-0">Filter Data & Export</h2>
                <button @click="exportScannedDocumentsReport"
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

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                <div>
                    <label for="scannedType" class="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
                    <select id="scannedType" v-model="filters.type_id"
                        class="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                        <option value="">All Types</option>
                        <option v-for="type in scannedTypes" :key="type.id" :value="type.id">{{ type.name }}</option>
                    </select>
                </div>

                <div>
                    <label for="scannedYear" class="block text-sm font-medium text-gray-700 mb-1">Year</label>
                    <select id="scannedYear" v-model="filters.year"
                        class="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                        <option value="">Any Year</option>
                        <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
                    </select>
                </div>

                <div>
                    <label for="scannedMonth" class="block text-sm font-medium text-gray-700 mb-1">Month</label>
                    <select id="scannedMonth" v-model="filters.month"
                        class="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                        <option value="">Any Month</option>
                        <option v-for="(monthName, monthNum) in months" :key="monthNum" :value="monthName">{{ monthName
                        }}</option>
                    </select>
                </div>

                <div class="flex space-x-2 md:col-span-2 lg:col-span-1">
                    <button @click="applyScannedFilters"
                        class="w-full mt-4 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md shadow-sm text-sm">Apply
                        Filters</button>
                    <button @click="clearScannedFilters"
                        class="w-full mt-4 px-5 py-2.5 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-md shadow-sm text-sm">Clear
                        Filters</button>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <div class="bg-white p-5 shadow-lg rounded-lg">
                <h3 class="text-sm font-medium text-gray-500">Total Scanned Documents</h3>
                <p class="mt-1 text-3xl font-semibold text-gray-900">{{ kpiData.totalScans || 0 }}</p>
            </div>
            <div class="bg-white p-5 shadow-lg rounded-lg">
                <h3 class="text-sm font-medium text-gray-500">Scans This Month</h3>
                <p class="mt-1 text-3xl font-semibold text-blue-600">{{ kpiData.scansThisMonth || 0 }}</p>
            </div>
            <div class="bg-white p-5 shadow-lg rounded-lg">
                <h3 class="text-sm font-medium text-gray-500">Scans This Year</h3>
                <p class="mt-1 text-3xl font-semibold text-purple-600">{{ kpiData.scansThisYear || 0 }}</p>
            </div>
            <div class="bg-white p-5 shadow-lg rounded-lg">
                <h3 class="text-sm font-medium text-gray-500">Documents by Type</h3>
                <p class="mt-1 text-3xl font-semibold text-green-600">{{ kpiData.documentsByType.length > 0 ? 'See Chart' : 'N / A' }}</p>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="bg-white p-5 shadow-lg rounded-lg col-span-1 lg:col-span-2">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Scanned Documents Over Time (Monthly)</h3>
                <div class="h-72 md:h-96 flex items-center justify-center bg-gray-50 rounded-md">
                    <p class="text-center text-gray-500 py-10">Scanned Documents Over Time Line Chart Placeholder</p>
                </div>
            </div>

            <div class="bg-white p-5 shadow-lg rounded-lg">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Scans by Document Type</h3>
                <div class="h-64 md:h-80 flex items-center justify-center bg-gray-50 rounded-md">
                    <p class="text-center text-gray-500 py-10">Document Type Bar/Pie Chart Placeholder</p>
                </div>
            </div>

            <div class="bg-white p-5 shadow-lg rounded-lg">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Scans by Year</h3>
                <div class="h-64 md:h-80 flex items-center justify-center bg-gray-50 rounded-md">
                    <p class="text-center text-gray-500 py-10">Scans by Year Bar Chart Placeholder</p>
                </div>
            </div>

        
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// Reactive state for filters
const filters = ref({
    type_id: '', // Corresponds to ScannedType.id
    year: new Date().getFullYear().toString(),
    month: new Date().toLocaleString('en-US', { month: 'long' }),
});

// Reactive state for KPI data
const kpiData = ref({
    totalScans: 0,
    scansThisMonth: 0,
    scansThisYear: 0,
    documentsByType: [], // e.g., [{ name: 'Birth', count: 150 }, { name: 'Death', count: 80 }]
});

// Mock data for dropdowns
const scannedTypes = ref([
    { id: 1, name: 'Birth' },
    { id: 2, name: 'Death' },
    { id: 3, name: 'Marriage' },
    { id: 4, name: 'Legal Instrument' },
]);

const months = ref([
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
]);

const availableYears = ref([]);

/**
 * Loads dashboard data based on current filters.
 * In a real application, this would make an API call to your backend.
 */
const loadScannedDashboardData = async () => {
    console.log('Loading scanned documents dashboard data with filters:', filters.value);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock data for demonstration based on the provided model
    const mockScans = [
        { id: 1, name: 'Birth Cert 001', filepath: '/path/to/001.pdf', type_id: 1, month: 'May', year: 2025 },
        { id: 2, name: 'Death Cert 002', filepath: '/path/to/002.pdf', type_id: 2, month: 'May', year: 2025 },
        { id: 3, name: 'Marriage Cert 003', filepath: '/path/to/003.pdf', type_id: 3, month: 'April', year: 2025 },
        { id: 4, name: 'Legal Inst 004', filepath: '/path/to/004.pdf', type_id: 4, month: 'March', year: 2024 },
        { id: 5, name: 'Birth Cert 102', filepath: '/path/to/102.pdf', type_id: 1, month: 'May', year: 2025 },
        { id: 6, name: 'Death Cert 103', filepath: '/path/to/103.pdf', type_id: 2, month: 'May', year: 2025 },
        { id: 7, name: 'Birth Cert 104', filepath: '/path/to/104.pdf', type_id: 1, month: 'April', year: 2025 },
        { id: 8, name: 'Marriage Cert 105', filepath: '/path/to/105.pdf', type_id: 3, month: 'May', year: 2025 },
    ];

    // Apply filters to mock data
    const filteredScans = mockScans.filter(scan => {
        const typeMatch = filters.value.type_id ? scan.type_id === parseInt(filters.value.type_id) : true;
        const yearMatch = filters.value.year ? scan.year === parseInt(filters.value.year) : true;
        const monthMatch = filters.value.month ? scan.month === filters.value.month : true;
        return typeMatch && yearMatch && monthMatch;
    });

    // Calculate KPIs
    kpiData.value.totalScans = filteredScans.length;

    const currentMonth = new Date().toLocaleString('en-US', { month: 'long' });
    const currentYear = new Date().getFullYear();

    kpiData.value.scansThisMonth = mockScans.filter(
        scan => scan.month === currentMonth && scan.year === currentYear
    ).length;

    kpiData.value.scansThisYear = mockScans.filter(
        scan => scan.year === currentYear
    ).length;

    // Calculate documents by type
    const documentsByTypeMap = new Map();
    filteredScans.forEach(scan => {
        const typeName = scannedTypes.value.find(type => type.id === scan.type_id)?.name || 'Unknown';
        documentsByTypeMap.set(typeName, (documentsByTypeMap.get(typeName) || 0) + 1);
    });
    kpiData.value.documentsByType = Array.from(documentsByTypeMap, ([name, count]) => ({ name, count }));

    // In a real app, you would also update chartData here
};

/**
 * Applies the current filters and reloads the dashboard data.
 */
const applyScannedFilters = () => {
    loadScannedDashboardData();
};

/**
 * Clears all filters and reloads the dashboard data with default settings.
 */
const clearScannedFilters = () => {
    filters.value = {
        type_id: '',
        year: new Date().getFullYear().toString(),
        month: new Date().toLocaleString('en-US', { month: 'long' }),
    };
    loadScannedDashboardData();
};

/**
 * Initiates the export of the scanned documents report.
 * In a real application, this would trigger a backend process to generate and download a file.
 */
const exportScannedDocumentsReport = () => {
    console.log('Exporting scanned documents report with filters:', filters.value);
    alert('Scanned documents report export functionality to be implemented.');
};

/**
 * Fetches options for filters, such as available years.
 * In a real application, `scannedTypes` would also likely be fetched from an API.
 */
const fetchFilterOptions = () => {
    const currentYear = new Date().getFullYear();
    // Generate years from 3 years ago to 1 year in the future
    availableYears.value = Array.from({ length: 5 }, (_, i) => (currentYear - 3 + i).toString());
};

// On component mount, fetch filter options and load initial dashboard data
onMounted(() => {
    fetchFilterOptions();
    loadScannedDashboardData();
});
</script>

<style scoped>
/* Add any component-specific styles here if needed */
.h-64 {
    height: 16rem;
}

.h-72 {
    height: 18rem;
}

.h-80 {
    height: 20rem;
}

.h-96 {
    height: 24rem;
}
</style>
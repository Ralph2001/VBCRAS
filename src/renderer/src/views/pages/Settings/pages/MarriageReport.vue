<template>
    <div class="flex flex-col ml-80 p-6 h-auto space-y-6 bg-gray-100 min-h-screen">
        <div>
            <h1 class="text-3xl font-semibold text-gray-800 font-sans">Marriage License Applications </h1>
            <p class="text-gray-600 mt-1 text-sm">
                Analytics and reporting for marriage license applications. Current Municipality: Bayambang
            </p>
        </div>

        <div class="bg-white p-6 shadow-lg rounded-lg">
            <div class="flex flex-col md:flex-row justify-between md:items-center mb-6">
                <h2 class="text-xl font-semibold text-gray-800 mb-3 md:mb-0">Filter Data & Export</h2>
                <button @click="exportMarriageReport"
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
                    <label for="dateRangeReceipt" class="block text-sm font-medium text-gray-700 mb-1">Application Date
                        Range</label>
                    <div class="flex space-x-2">
                        <input type="date" v-model="filters.dateReceiptFrom"
                            class="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                        <input type="date" v-model="filters.dateReceiptTo"
                            class="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                </div>

                <div>
                    <label for="filterAppMunicipality" class="block text-sm font-medium text-gray-700 mb-1">Application
                        Municipality</label>
                    <select id="filterAppMunicipality" v-model="filters.appMunicipality"
                        class="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                        <option value="">All Municipalities</option>
                        <option value="Bayambang">Bayambang</option>
                        <option v-for="mun in uniqueMunicipalities" :key="mun" :value="mun">{{ mun }}</option>
                    </select>
                </div>

                <div>
                    <label for="filterGroomCitizenship" class="block text-sm font-medium text-gray-700 mb-1">Groom's
                        Citizenship</label>
                    <select id="filterGroomCitizenship" v-model="filters.groomCitizenship"
                        class="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                        <option value="">All Citizenships</option>
                        <option v-for="cit in uniqueCitizenships" :key="cit" :value="cit">{{ cit }}</option>
                    </select>
                </div>
                <div>
                    <label for="filterBrideCitizenship" class="block text-sm font-medium text-gray-700 mb-1">Bride's
                        Citizenship</label>
                    <select id="filterBrideCitizenship" v-model="filters.brideCitizenship"
                        class="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                        <option value="">All Citizenships</option>
                        <option v-for="cit in uniqueCitizenships" :key="cit" :value="cit">{{ cit }}</option>
                    </select>
                </div>
                <div>
                    <label for="filterMarriageYear" class="block text-sm font-medium text-gray-700 mb-1">Year of
                        Marriage (Planned)</label>
                    <select id="filterMarriageYear" v-model="filters.marriageYear"
                        class="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                        <option value="">Any Year</option>
                        <option v-for="year in marriageYears" :key="year" :value="year">{{ year }}</option>
                    </select>
                </div>


                <div class="flex space-x-2 md:col-span-2 lg:col-span-1"> <button @click="applyMarriageFilters"
                        class="w-full mt-4 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md shadow-sm text-sm">Apply
                        Filters</button>
                    <button @click="clearMarriageFilters"
                        class="w-full mt-4 px-5 py-2.5 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-md shadow-sm text-sm">Clear
                        Filters</button>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <div class="bg-white p-5 shadow-lg rounded-lg">
                <h3 class="text-sm font-medium text-gray-500">Total Applications</h3>
                <p class="mt-1 text-3xl font-semibold text-gray-900">{{ kpiData.totalApplications || 0 }}</p>
            </div>
            <div class="bg-white p-5 shadow-lg rounded-lg">
                <h3 class="text-sm font-medium text-gray-500">Licenses Issued</h3>
                <p class="mt-1 text-3xl font-semibold text-green-600">{{ kpiData.licensesIssued || 0 }}</p>
            </div>
            <div class="bg-white p-5 shadow-lg rounded-lg">
                <h3 class="text-sm font-medium text-gray-500">Avg. Groom's Age</h3>
                <p class="mt-1 text-3xl font-semibold text-blue-600">{{ kpiData.avgGroomAge || 'N/A' }}</p>
            </div>
            <div class="bg-white p-5 shadow-lg rounded-lg">
                <h3 class="text-sm font-medium text-gray-500">Avg. Bride's Age</h3>
                <p class="mt-1 text-3xl font-semibold text-pink-600">{{ kpiData.avgBrideAge || 'N/A' }}</p>
            </div>
            <div class="bg-white p-5 shadow-lg rounded-lg">
                <h3 class="text-sm font-medium text-gray-500">Apps This Month</h3>
                <p class="mt-1 text-3xl font-semibold text-purple-600">{{ kpiData.appsThisMonth || 0 }}</p>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="bg-white p-5 shadow-lg rounded-lg col-span-1 lg:col-span-2">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Applications Over Time (Monthly)</h3>
                <div class="h-72 md:h-96">
                    <p class="text-center text-gray-500 py-10">Applications Over Time Line Chart Placeholder</p>
                </div>
            </div>

            <div class="bg-white p-5 shadow-lg rounded-lg">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Applications by Municipality</h3>
                <div class="h-64 md:h-80">
                    <p class="text-center text-gray-500 py-10">Municipality Bar Chart Placeholder</p>
                </div>
            </div>

            <div class="bg-white p-5 shadow-lg rounded-lg">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Age Distribution (Applicants)</h3>
                <div class="h-64 md:h-80">
                    <p class="text-center text-gray-500 py-10">Age Distribution Histogram/Bar Chart Placeholder</p>
                </div>
            </div>

            <div class="bg-white p-5 shadow-lg rounded-lg">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Groom Citizenship</h3>
                <div class="h-64 md:h-80">
                    <p class="text-center text-gray-500 py-10">Groom Citizenship Pie Chart Placeholder</p>
                </div>
            </div>
            <div class="bg-white p-5 shadow-lg rounded-lg">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Bride Citizenship</h3>
                <div class="h-64 md:h-80">
                    <p class="text-center text-gray-500 py-10">Bride Citizenship Pie Chart Placeholder</p>
                </div>
            </div>
            <div class="bg-white p-5 shadow-lg rounded-lg col-span-1 lg:col-span-2">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Marriages by Month (from Date of Marriage field)</h3>
                <div class="h-72 md:h-96">
                    <p class="text-center text-gray-500 py-10">Marriages by Month Bar Chart Placeholder</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// Example script setup (conceptual)
export default {
    name: 'AdminMarriageLicenseDashboard',
    data() {
        return {
            filters: {
                dateReceiptFrom: '',
                dateReceiptTo: '',
                appMunicipality: 'Bayambang', // Default to current location
                groomCitizenship: '',
                brideCitizenship: '',
                marriageYear: new Date().getFullYear().toString(), // Default to current year
            },
            kpiData: {
                totalApplications: 0,
                licensesIssued: 0,
                avgGroomAge: 'N/A',
                avgBrideAge: 'N/A',
                appsThisMonth: 0,
            },
            chartData: { /* Structures for your charting library */ },
            uniqueMunicipalities: [], // e.g., ['Malasiqui', 'Calasiao', 'Sta. Barbara'] (excluding Bayambang if it's fixed)
            uniqueCitizenships: [], // e.g., ['Filipino', 'American', 'Chinese']
            marriageYears: [], // e.g., [2023, 2024, 2025, 2026]
        };
    },
    methods: {
        loadMarriageDashboardData() {
            console.log("Loading marriage dashboard data with filters:", this.filters);
            // API call to fetch data based on this.filters
            // Update this.kpiData and this.chartData for chart components
            // Example:
            this.kpiData = {
                totalApplications: 780,
                licensesIssued: 650,
                avgGroomAge: 28.5,
                avgBrideAge: 26.2,
                appsThisMonth: 45,
            };
            // this.renderMarriageCharts();
        },
        applyMarriageFilters() {
            this.loadMarriageDashboardData();
        },
        clearMarriageFilters() {
            this.filters = {
                dateReceiptFrom: '',
                dateReceiptTo: '',
                appMunicipality: 'Bayambang', // Reset to default
                groomCitizenship: '',
                brideCitizenship: '',
                marriageYear: new Date().getFullYear().toString(),
            };
            this.loadMarriageDashboardData();
        },
        exportMarriageReport() {
            console.log("Exporting marriage report with filters:", this.filters);
            // Implement data fetching and CSV/Excel export logic
            alert('Marriage report export functionality to be implemented.');
        },
        async fetchMarriageFilterOptions() {
            // Populate uniqueMunicipalities (excluding Bayambang if it's hardcoded default), uniqueCitizenships, marriageYears
            this.uniqueMunicipalities = ['Malasiqui', 'Calasiao', 'Urdaneta City', 'Dagupan City']; // Placeholder
            this.uniqueCitizenships = ['Filipino', 'American', 'Chinese', 'Canadian', 'Australian']; // Placeholder

            const currentYear = new Date().getFullYear();
            this.marriageYears = Array.from({ length: 7 }, (_, i) => (currentYear - 3 + i).toString()); // Past 3, current, next 3 years
        },
        // renderMarriageCharts() { /* Chart rendering logic if not using components */ }
    },
    mounted() {
        this.fetchMarriageFilterOptions();
        this.loadMarriageDashboardData(); // Initial data load
    }
};
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
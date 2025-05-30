<template>
    <div class="flex flex-col gap-5 ml-80">
        <div class="border-2 border-dashed border-blue-400 my-10"></div>
        <div>
            <h1 class="text-3xl font-semibold text-gray-800 font-sans">Scanned Documents</h1>
            <p class="text-gray-600 mt-1 text-sm">
                Overview of scanned civil registry documents.
            </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mt-4">
            <div class="bg-white p-5 shadow-lg rounded-lg col-span-1">
                <h3 class="text-sm font-medium text-gray-500">Total Scanned Documents</h3>
                <p class="mt-1 text-3xl font-semibold text-gray-900">{{ totalScannedDocuments }}</p>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white p-5 shadow-lg rounded-lg col-span-1">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Scanned Documents by Type</h3>
                <div class="h-64 p-4 flex justify-center items-center">
                    <Pie :data="scannedTypeBarChartData" :options="chartOptions" />
                </div>
            </div>
            <div class="bg-white p-5 shadow-lg rounded-lg col-span-1">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Documents Uploaded Over Time (Monthly)</h3>
                <div class="h-64 w-full">
                    <Line :data="scansOverTimeLineChartData" :options="chartOptions" />
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>

// --- Start of your <script setup> section in Vue.js ---

import { computed, ref, onMounted, watch } from 'vue'; // Added onMounted and watch
import axios from 'axios'; // Assuming you use axios for API calls

import { Pie, Bar, Line } from 'vue-chartjs';
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement);

// --- Existing properties (keep these as they are) ---
const formData = ref({ yearData: new Date().getFullYear() }); // Or whatever your default year is
// const applications = ref([]); // Your main applications data
// const uniqueYears = computed(() => { /* ... your existing logic ... */ });
// const filteredByYear = computed(() => { /* ... your existing logic ... */ });
// ... (all other computed properties for marriage license data) ...

// --- NEW: Scanned Documents Data and Logic ---
const scannedDocuments = ref([]); // This will hold the raw data fetched from the backend

// Fetch scanned documents data when the component mounts or year changes
const fetchScannedDocuments = async () => {
    try {
        const year = formData.value.yearData;
        // Make sure your Flask backend has an endpoint like '/api/scans?year=YYYY'
        const response = await axios.get(`/api/scans?year=${year}`);
        scannedDocuments.value = response.data;
    } catch (error) {
        console.error("Error fetching scanned documents:", error);
        scannedDocuments.value = []; // Clear data on error
    }
};

// Watch for changes in the selected year to refetch scanned documents
watch(() => formData.value.yearData, (newYear, oldYear) => {
    if (newYear !== oldYear) {
        fetchScannedDocuments();
    }
}, { immediate: true }); // immediate: true to fetch on initial load

// Total number of scanned documents for the selected year
const totalScannedDocuments = computed(() => scannedDocuments.value.length);

// Scanned Type usually is scanned Local Civil Registry Documents (Birth, Death, Marriage, Legal Instruments)
const scannedTypeBarChartData = computed(() => {
    const typeCounts = scannedDocuments.value.reduce((acc, scan) => {
        // Assuming 'scan.scanned_type.name' gives you the document type name (e.g., 'Birth', 'Death')
        const typeName = scan.scanned_type ? scan.scanned_type.name : 'Unknown';
        acc[typeName] = (acc[typeName] || 0) + 1;
        return acc;
    }, {});

    return {
        labels: Object.keys(typeCounts),
        datasets: [{
            label: 'Number of Scanned Documents',
            backgroundColor: ['#10B981', '#EF4444', '#3B82F6', '#F59E0B', '#6D28D9'], // Green, Red, Blue, Orange, Purple
            data: Object.values(typeCounts)
        }]
    };
});

// Scans over Time (Monthly)
const scansOverTimeLineChartData = computed(() => {
    const monthlyCounts = {};
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    // Initialize counts for all months to 0
    months.forEach(month => {
        monthlyCounts[month] = 0;
    });

    scannedDocuments.value.forEach(scan => {
        const monthName = scan.month; // Assuming scan.month is already a full month name string
        if (monthlyCounts.hasOwnProperty(monthName)) {
            monthlyCounts[monthName]++;
        }
    });

    return {
        labels: months, // Ensure labels are in order
        datasets: [{
            label: 'Scans Uploaded',
            backgroundColor: '#10B981', // A shade of green
            borderColor: '#059669', // Darker green for the line
            data: months.map(month => monthlyCounts[month]), // Map counts to month order
            fill: false,
            tension: 0.1
        }]
    };
});

// --- Common Chart Options (adjust if needed, or use specific ones) ---
const chartOptions = {
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
                text: 'Count'
            }
        },
        x: {
            title: {
                display: true,
                text: 'Category'
            }
        }
    }
};

</script>
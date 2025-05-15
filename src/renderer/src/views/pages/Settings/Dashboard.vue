<template>
    <div class="md:ml-64 p-6  h-full ">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
            <div>
                <h1 class="text-2xl font-semibold text-gray-800">Welcome, Admin</h1>
                <p class="text-sm text-gray-500">{{ date }} | {{ time }}</p>
            </div>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

            <div class="bg-white p-4 rounded-xl shadow-sm">
                <p class="text-gray-500 text-sm">Total Corrections</p>
                <p class="text-2xl font-bold text-[#695CFD]">35</p>
            </div>
            <div class="bg-white p-4 rounded-xl shadow-sm">
                <p class="text-gray-500 text-sm">Total Forms</p>
                <p class="text-2xl font-bold text-[#695CFD]">12</p>
            </div>
            <div class="bg-white p-4 rounded-xl shadow-sm">
                <p class="text-gray-500 text-sm">Total Application for Marriage License</p>
                <p class="text-2xl font-bold text-[#695CFD]">8</p>
            </div>
            <div class="bg-white p-4 rounded-xl shadow-sm">
                <p class="text-gray-500 text-sm">Total Scanned</p>
                <p class="text-2xl font-bold text-[#695CFD]">900,000+</p>
            </div>
        </div>

        <!-- Recent Activity -->
        <div class="bg-white p-6 rounded-xl shadow-sm mb-8">
            <h2 class="text-lg font-semibold mb-4 text-gray-800">Recent Activity</h2>
            <ul class="text-sm text-gray-700 space-y-2">
                <li>✅ Correction #123 approved</li>
                <li>📥 License Application #456 submitted</li>
                <li>📝 New form uploaded</li>
            </ul>
        </div>

        <p class="text-gray-800 font-medium mb-4 text-lg">Apps</p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Correction App -->
            <div
                class="h-28 rounded-xl bg-white p-4 flex flex-col items-center justify-center w-full border border-gray-200 hover:shadow-md transition duration-300 cursor-pointer">
                <i class="lucide lucide-file-pen text-[#695CFD] mb-2"></i>
                <p class="text-gray-800 font-semibold text-sm uppercase">Correction</p>
                <p class="text-xs text-gray-500 text-center mt-1">Create Petition for Clerical Error</p>
            </div>

            <!-- Forms App -->
            <div
                class="h-28 rounded-xl bg-white p-4 flex flex-col items-center justify-center w-full border border-gray-200 hover:shadow-md transition duration-300 cursor-pointer">
                <i class="lucide lucide-file-text text-[#695CFD] mb-2"></i>
                <p class="text-gray-800 font-semibold text-sm uppercase">Forms</p>
                <p class="text-xs text-gray-500 text-center mt-1">Create Local Copy</p>
            </div>

            <!-- Marriage License App -->
            <div
                class="h-28 rounded-xl bg-white p-4 flex flex-col items-center justify-center w-full border border-gray-200 hover:shadow-md transition duration-300 cursor-pointer">
                <i class="lucide lucide-heart text-[#695CFD] mb-2"></i>
                <p class="text-gray-800 font-semibold text-sm uppercase text-center">Marriage License</p>
                <p class="text-xs text-gray-500 text-center mt-1">Make application for marriage license</p>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const date = ref('')
const time = ref('')

function updateDateTime() {
    const now = new Date()
    date.value = now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    time.value = now.toLocaleTimeString()
}

onMounted(() => {
    updateDateTime()
    setInterval(updateDateTime, 1000) // Update every second
})
</script>

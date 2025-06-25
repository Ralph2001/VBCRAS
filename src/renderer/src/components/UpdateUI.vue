<template>
    <div class="p-4  max-w-xs w-full mx-auto text-sm text-gray-800 border rounded-xl shadow bg-white">
        <h2 class="text-base font-medium mb-3 text-center text-gray-700" v-if="progress > 0 && progress < 100">
            Downloading Update
        </h2>

        <div class="flex items-center justify-between mb-2">
            <span class="text-gray-500">Current Version:</span>
            <span class="font-mono text-gray-800">{{ version }}</span>
        </div>

        <div class="flex items-center justify-between mb-2 text-gray-700">
            <span class="text-gray-500">Status:</span>
            <span class="ml-1">{{ status }}</span>
        </div>

        <div v-if="progress > 0 && progress < 100" class="mb-2">
            <progress :value="progress" max="100" class="w-full h-2 rounded bg-gray-200"></progress>
            <div class="text-right text-xs text-gray-500 mt-1">{{ progress.toFixed(1) }}%</div>

            <div class="text-xs text-gray-500 mt-2 space-y-1">
                <div><strong>Speed:</strong> {{ formatBytes(speed) }}/s</div>
                <div><strong>Downloaded:</strong> {{ formatBytes(transferred) }} / {{ formatBytes(total) }}</div>
            </div>
        </div>

        <div v-if="progress >= 100" class="text-green-600 text-xs mt-2 text-center">
            Download complete! Awaiting restart...
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const version = ref('...')
const status = ref('Latest version')
const progress = ref(0)
const speed = ref(0)
const transferred = ref(0)
const total = ref(0)

function formatBytes(bytes) {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

onMounted(async () => {
    try {
        version.value = await window.vbcrasUpdateApi.appVersion()

        window.vbcrasUpdateApi.onUpdateStatus((message) => {
            if (!message) {
                status.value = 'No updates available'
                return
            }
            if (message.toLowerCase().includes('checking')) {
                status.value = 'Waiting for update check...'
            } else {
                status.value = message
            }
        })

        window.vbcrasUpdateApi.onUpdateProgress((data) => {
            progress.value = data?.percent || 0
            speed.value = data?.bytesPerSecond || 0
            transferred.value = data?.transferred || 0
            total.value = data?.total || 0
        })
    } catch (error) {
        status.value = 'Error fetching update info'
        console.error(error)
    }
})
</script>

<style scoped>
progress::-webkit-progress-bar {
    background-color: #e5e7eb;
    border-radius: 9999px;
}

progress::-webkit-progress-value {
    background-color: #3b82f6;
    border-radius: 9999px;
}
</style>

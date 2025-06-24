<template>
    <div class="fixed inset-0 z-[999999] p-4 backdrop-blur-sm bg-black/10 flex justify-center items-center">
        <div class="max-w-screen-sm w-full max-h-full overflow-y-auto bg-white rounded-2xl shadow-lg p-6 ">
            <h2 class="text-xl font-semibold text-gray-800 mb-4 text-center">Event Timeline</h2>

            <ul class="relative border-l border-gray-300 space-y-6 pl-6">
                <li v-for="(event, index) in sortedDates" :key="index" class="relative">
                    <!-- Dot -->
                    <span
                        class="absolute -left-4 top-1.5 w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow"></span>

                    <!-- Date Title & Description -->
                    <div class="flex flex-col">
                        <span class="text-xs text-gray-500">{{ formatDate(event.date) }}</span>
                        <h3 class="text-sm font-semibold text-gray-800">{{ event.title || 'Untitled Event' }}</h3>
                        <p v-if="event.description" class="text-xs text-gray-600 mt-1">{{ event.description }}</p>
                    </div>
                </li>
            </ul>

            <div class="mt-6 flex justify-end">
                <button @click="emit('close')" class="text-sm text-blue-600 hover:underline">Close</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const emit = defineEmits(['close'])

const props = defineProps({
    dates: {
        type: Array,
        required: true,
        default: () => []
    }
})

const sortedDates = computed(() =>
    [...props.dates].sort((a, b) => new Date(a.date) - new Date(b.date))
)

const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}
</script>

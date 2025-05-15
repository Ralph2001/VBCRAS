<template>
    <div v-if="visible" role="dialog" aria-modal="true" tabindex="-1"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm backdrop-brightness-75">
        <div
            class="w-full max-w-sm bg-white border border-gray-200 rounded-xl shadow-md p-6 flex flex-col items-center gap-4">
            <!-- Wave animation -->
            <div class="w-full h-40 relative bg-gray-100 rounded-lg border border-transparent hover:border-gray-200 transition"
                title="wave">
                <Wave />
            </div>

            <!-- Title -->
            <p class="text-xl font-semibold text-gray-800 mt-2">
                {{ displayText }} Document
            </p>

            <!-- Info text -->
            <div class="text-center text-sm text-gray-600 space-y-1">
                <p>This process may take 30 seconds or longer.</p>
                <p>Please be patient...</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import Wave from '../Wave.vue'


const props = defineProps({
    visible: { type: Boolean, default: false },
    isEdit: { type: Boolean, default: false },
    isRegenerating: { type: Boolean, default: false },
})

const displayText = computed(() => {
    if (props.isEdit) return 'Updating'
    if (props.isRegenerating) return 'Regenerating'
    return 'Creating'
})
</script>

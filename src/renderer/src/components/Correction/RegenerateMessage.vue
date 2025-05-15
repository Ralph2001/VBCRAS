<template>
    <div class="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center p-4" role="dialog"
        aria-modal="true" aria-labelledby="modal-title" aria-describedby="modal-description">
        <div class="w-full max-w-3xl bg-white rounded-lg shadow-md p-6 space-y-4">
            <!-- Title -->
            <h2 id="modal-title" class="text-xl font-semibold text-red-600 flex items-center gap-2">
                ⚠️ Warning!
            </h2>

            <!-- Petition Details -->
            <div class="text-sm text-gray-700 space-y-1">
                <p><strong>Petition Number:</strong> {{ data.petition_number }}</p>
                <p><strong>Petitioner Name:</strong> {{ data.petitioner_name }}</p>
                <p><strong>Petition Type:</strong> {{ data.petition_type }}</p>
                <p><strong>Event Type:</strong> {{ data.event_type }}</p>
                <p><strong class="text-blue-600">File Path:</strong> {{ data.file_path }}</p>
            </div>

            <!-- Explanation -->
            <div class="text-sm text-gray-600 space-y-3 leading-relaxed">
                <p>
                    This option is for fixing documents that contain <strong>errors</strong> or were
                    <strong>not generated correctly</strong>.
                </p>
                <p>
                    Regenerating will <span class="text-red-500 font-medium">permanently overwrite</span> the existing
                    file. This action <strong>cannot be undone</strong>. Close all Word documents before proceeding to
                    avoid file conflicts.
                </p>
                <p>
                    <strong>Database data will remain unchanged</strong>. If changes are needed, update the data first
                    before regenerating.
                </p>
                <p class="text-red-500 font-semibold">
                    ⚠️ Double-check everything before proceeding!
                </p>
            </div>

            <!-- Actions -->
            <div class="flex justify-end gap-3 pt-2">
                <button @click="emits('cancel')"
                    class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm font-medium">
                    Cancel
                </button>
                <button @click="emits('proceed')"
                    class="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white text-sm font-medium">
                    Proceed
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
const emits = defineEmits(['cancel', 'proceed'])

const props = defineProps({
    data: {
        type: Object,
        required: true
    }
})
</script>

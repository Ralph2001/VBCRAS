<template>
    <div class="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" role="dialog" aria-modal="true"
        aria-labelledby="modal-title" aria-describedby="modal-description">
        <div class="w-full max-w-2xl bg-white rounded-xl shadow-xl p-6 space-y-5">
            <!-- Header -->
            <h2 id="modal-title" class="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <span class="text-yellow-500 text-xl">⚠️</span>
                {{ canEdit ? 'Edit Document' : 'Regenerate Document' }}
            </h2>

            <!-- Petition Info -->
            <div class="text-sm text-gray-600 grid grid-cols-1 sm:grid-cols-2 gap-y-1">
                <p><span class="font-medium">Petition No.:</span> {{ data.petition_number }}</p>
                <p><span class="font-medium">Petitioner:</span> {{ data.petitioner_name }}</p>
                <p><span class="font-medium">Petition Type:</span> {{ data.petition_type }}</p>
                <p><span class="font-medium">Event Type:</span> {{ data.event_type }}</p>


            </div>
            <div class="flex flex-col w-full  text-gray-600 gap-2">
                <p class=" mt-4">
                    <span class="font-bold text-gray-800 text-sm ">File Path:</span>
                </p>

                <div class="w-full rounded-md bg-gray-100 p-2 text-gray-800 text-xs">
                    {{ data.file_path }}
                </div>
            </div>
            <!-- Info Text -->
            <div id="modal-description" class="text-sm text-gray-700 space-y-3 leading-relaxed">
                <p>
                    This option allows you to <strong>{{ canEdit ? 'edit and regenerate' : 'regenerate' }}</strong> the
                    document.
                </p>
                <p v-if="!canEdit">
                    <strong class="text-red-500">Note:</strong> This will <strong>overwrite the existing file</strong>.
                    Make sure any open Word documents are closed before continuing.
                </p>
                <p v-if="canEdit">
                    <strong class="text-green-600">Note:</strong> This will update the document and also allow you to
                    <strong>modify the database records</strong> if needed.
                </p>
                <p class="text-red-500 font-semibold">Please review all details carefully before proceeding.</p>
            </div>

            <!-- Buttons -->
            <div class="flex justify-end gap-2 pt-2">
                <button @click="emits('cancel')"
                    class="px-4 py-2 rounded-lg text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 transition">
                    Cancel
                </button>
                <button @click="emits('proceed')"
                    class="px-4 py-2 rounded-lg text-sm bg-red-500 hover:bg-red-600 text-white transition">
                    {{ canEdit ? 'Edit Document' : 'Regenerate' }}
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
    },
    canEdit: {
        type: Boolean,
        default: false
    }
})
</script>

<template>
    <div
        class="fixed inset-0 z-50 bg-black/50 flex justify-center items-center p-6"
    >
        <div
            class="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6 flex flex-col gap-5 h-full overflow-hidden"
        >
            <!-- Header -->
            <div class="border-b pb-3">
                <h2
                    class="text-xl font-semibold text-red-600 flex items-center gap-2"
                >
                    🛑 Important Notice
                </h2>
            </div>

            <!-- Scrollable Content -->
            <div class="flex-1 overflow-y-auto grid grid-cols-2 gap-4">
                <!-- System Limitation -->
                <section
                    class="bg-yellow-50 border border-yellow-200 rounded p-4"
                >
                    <h3 class="font-medium text-yellow-700 mb-1">
                        ⚠️ Please Note:
                    </h3>
                    <ul class="list-disc pl-5 text-sm space-y-1">
                        <li>Some formatting might not be perfect</li>
                        <li>Spacing or alignment may need manual adjustment</li>
                    </ul>
                </section>

                <!-- Instructions -->
                <section
                    class="bg-green-50 border border-green-200 rounded p-4"
                >
                    <h3 class="font-medium text-green-700 mb-1">
                        What You Should Do:
                    </h3>
                    <ul class="list-disc pl-5 text-sm space-y-1">
                        <li>
                            Fix formatting issues (bold text, fonts, spacing)
                        </li>
                        <li>Reposition fields if needed</li>
                    </ul>
                </section>

                <!-- Save Instructions -->
                <section class="bg-blue-50 border border-blue-200 rounded p-4">
                    <h3 class="font-medium text-blue-700 mb-1">
                        After Fixing:
                    </h3>
                    <ul class="list-disc pl-5 text-sm space-y-1">
                        <li>
                            Press <strong>Ctrl + S</strong> to save your changes
                        </li>
                        <li>Close the document when done</li>
                    </ul>
                    <p class="text-sm mt-2">
                        Then click <strong>Continue to generate</strong> below.
                    </p>
                </section>

                <!-- Data Warning -->
                <section class="bg-red-50 border border-red-200 rounded p-4">
                    <h3 class="font-medium text-red-600 mb-1">
                        🚫 Do Not Change the Values
                    </h3>
                    <p class="text-sm">
                        Changes to dates, numbers, or text here won't be saved
                        in the database.<br />
                        Use the button below to safely update information.
                    </p>
                </section>

                <!-- Data Correction Note -->
                <section>
                    <h3 class="font-medium text-green-700">
                        Need to Fix Data?
                    </h3>
                    <p class="text-sm">
                        Click <strong>"Return to Form Editor"</strong> to update
                        it safely.
                    </p>
                </section>
            </div>

            <!-- Help & Retry -->
            <div class="text-sm text-gray-600 mt-2">
                <p>
                    Document not opening?
                    <button
                        class="text-blue-600 underline"
                        @click="open_file(props.path)"
                    >
                        Try again
                    </button>
                </p>
                <button
                    class="text-blue-600 underline text-xs mt-1"
                    @click="open_folder_instead(props.path)"
                >
                    Open folder location instead
                </button>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end gap-3 pt-3 border-t">
                <!-- Neutral secondary button -->
                <button
                    @click="cancel_btn"
                    v-if="!isRegen"
                    class="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded text-sm font-medium"
                >
                    Return to Form Editor
                </button>
                <button
                    @click="exit_regen"
                    v-if="isRegen"
                    class="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded text-sm font-medium"
                >
                    Cancel
                </button>

                <!-- Primary action button -->
                <button
                    @click="proceed"
                    class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium"
                >
                    Continue to generate
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import AlertPath from './Alert/AlertPath.vue'
const emit = defineEmits(['proceed', 'cancel'])

const proceed = () => {
    emit('proceed')
}
const cancel_btn = () => {
    emit('cancel')
}
const exit_regen = () => {
    emit('cancel-regen')
}

const props = defineProps({
    path: String,
    default: '',
    atEdit: {
        type: Boolean,
        default: false
    },
    isRegen: {
        type: Boolean,
        default: false
    }
})

const open_folder_instead = async (path) => {
    await window.ClericalApi.OpenClericalFolder(path)
}
const open_file = async (path) => {
    await window.ClericalApi.OpenClerical(path + `petition.docx`)
}
</script>

<style lang="scss" scoped></style>

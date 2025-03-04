<template>
    <div class="fixed top-0 bottom-0 p-10 right-0 left-0 z-50 backdrop-brightness-50 flex justify-center items-center">
        <div class="h-full w-[50rem] rounded-md shadow bg-white p-7 flex flex-col gap-4">
            <!-- Header -->
            <div class="p-1 border-b border-gray-200">
                <h2 class="text-lg font-bold text-red-600 flex items-center gap-2">
                    🛑 Important Notice
                </h2>
            </div>

            <!-- Main Content -->
            <div class="flex flex-col gap-4">
                <!-- Warning Section -->
                <div class="bg-yellow-50 px-4 py-2 rounded-md border border-yellow-200">
                    <p class="font-semibold"> ⚠️ Due to system limitations:</p>
                    <ul class="list-disc pl-6 mt-2 space-y-2">
                        <li>Some formatting may not be perfect</li>
                        <li>You might need to adjust spacing or alignment</li>
                    </ul>
                </div>

                <!-- Instructions -->
                <div>
                    <h3 class="font-bold">🔧 What to Do:</h3>
                    <ul class="pl-4 mt-2 space-y-2">
                        <li>• Fix formatting (bold text, fonts, spacing)</li>
                        <li>• Move fields if they're misplaced</li>
                    </ul>
                </div>

                <!-- Data Warning -->
                <div class="bg-red-50 p-3 rounded-md border border-red-200">
                    <h3 class="font-bold text-red-600">🚫 Don't Change Values (Dates, Numbers, Text):</h3>
                    <p>Editing values here won't save to the database.<br>
                        Use the Return button below to safely update information.</p>
                </div>

                <!-- Correction Instructions -->
                <div>
                    <h3 class="font-bold text-green-600">✅ Need to fix data?</h3>
                    <p>Click "Return to Form Editor" below to make safe changes.</p>
                </div>
            </div>

            <!-- Document Help -->
            <div class="mt-auto">
                <p class="text-sm font-medium">Document not opening?
                    <button class="text-blue-600 underline" @click="open_file(props.path)">
                        Try opening again
                    </button>
                </p>
                <button class="text-xs text-blue-600 font-medium underline" @click="open_folder_instead(props.path)">
                    Open folder location instead
                </button>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-2 justify-end">
                <button @click="cancel_btn"
                    class="px-4 py-2 text-sm  bg-yellow-300 hover:bg-yellow-400 font-medium rounded ">
                    Return to Form Editor
                </button>
                <button @click="proceed"
                    class="px-4 py-2 text-sm bg-blue-500 text-white hover:bg-blue-600 font-medium rounded">
                    Continue to generate
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import AlertPath from './Alert/AlertPath.vue';
const emit = defineEmits(['proceed', 'cancel'])



const proceed = () => {
    emit('proceed')
}
const cancel_btn = () => {
    emit('cancel')
}

const props = defineProps({
    path: String,
    default: ''
})

const open_folder_instead = async (path) => {
    await window.ClericalApi.OpenClericalFolder(path)
}
const open_file = async (path) => {
    await window.ClericalApi.OpenClerical(path + `petition.docx`)
}
</script>

<style lang="scss" scoped></style>
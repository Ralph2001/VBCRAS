<template>
    <div
        class="fixed right-0 top-0 bottom-0 left-0 backdrop-brightness-75 backdrop-blur-sm z-50 items-center flex justify-center">
        <div class="w-[40rem] bg-red-50 h-[24rem] rounded-lg flex flex-col p-6">
            <div class="flex flex-row items-center justify-between">
                <p class="font-semibold text-xl text-red-700 uppercase">Path Not Found</p>
                <button class="ml-auto text-red-700 font-bold hover:text-red-900" @click="emit('cancel')">X</button>
            </div>

            <div class="flex flex-col gap-6 mt-6 text-gray-800">
                <p class="text-sm font-normal text-justify">
                    <span class="font-semibold text-red-700">Warning:</span> The system could not locate the specified file path. 
                    If you're connected to a server, ensure that the file is accessible via the shared drive. 
                    If using a local server, verify that the file path exists. If the issue persists, try using the 
                    <span class="font-bold text-red-700">Re-Generate</span> function instead.
                </p>
                <p class="text-sm font-normal text-justify">
                    If the problem continues, please contact your system administrator or IT representative for further assistance.
                </p>
            </div>

            <div class="flex flex-col gap-4 mt-auto border-t border-red-200 pt-4">
                <p class="font-medium font-mono text-sm flex flex-row gap-2 items-center text-gray-800">
                    Last Saved Path:
                    <span class="text-xs text-gray-600">
                        <div v-if="isSupported">
                            <span v-if="!copied">Click to copy</span>
                            <span v-else>Copied!</span>
                        </div>
                    </span>
                </p>

                <div class="flex items-center w-full h-10 bg-gray-100 shadow-inner rounded-md px-4 hover:cursor-pointer" @click="copy(path_to_copy)">
                    <p class="text-xs font-medium text-gray-600">{{ props.path }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useClipboard } from '@vueuse/core'
import { onMounted, ref } from 'vue';

const path_to_copy = ref()
const { text, copy, copied, isSupported } = useClipboard({ path_to_copy })

onMounted(() => {
    path_to_copy.value = props.path
})

const emit = defineEmits(['cancel'])
const props = defineProps({
    path: String,
})
</script>

<style lang="scss" scoped>
/* Custom styles for better design and visibility */
.bg-red-50 {
    background-color: #fef2f2;
}
.text-red-700 {
    color: #e11d48;
}
.border-red-600 {
    border-color: #dc2626;
}
.text-gray-800 {
    color: #1f2937;
}
.text-gray-600 {
    color: #4b5563;
}
.bg-gray-100 {
    background-color: #f3f4f6;
}
</style>

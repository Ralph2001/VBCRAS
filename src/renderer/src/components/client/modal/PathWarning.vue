<template>
    <div class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
        <div class="w-full max-w-xl bg-white rounded-xl shadow-xl p-6 space-y-6">
            <!-- Header -->
            <div class="flex justify-between items-center">
                <h2 class="text-lg font-semibold text-red-600">Path not found</h2>
                <button @click="emit('cancel')" class="text-gray-500 hover:text-gray-700 text-lg font-bold">×</button>
            </div>

            <!-- Message -->
            <div class="space-y-4 text-sm text-gray-700">
                <p>
                    <span class="font-semibold text-red-600">Warning:</span> The system could not locate the specified
                    file path.
                    If you're connected to a server, make sure the file is accessible through the shared drive.
                    On a local server, check that the file path exists. If not, try using the <span
                        class="font-semibold text-red-600">Re-Generate</span> function.
                </p>
                <p>
                    If the issue continues, contact your system administrator or IT support for help.
                </p>
            </div>

            <!-- Path Display + Copy -->
            <div class="border-t pt-4 space-y-2">
                <div class="text-xs text-gray-500 font-mono flex items-center justify-between">
                    <span>Last saved path</span>
                    <span v-if="isSupported" class="text-gray-400">
                        {{ copied ? 'Copied!' : 'Click to copy' }}
                    </span>
                </div>
                <div class="w-full h-10 hover:h-40 transition-all duration-300 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-xs text-gray-700 font-medium font-mono  cursor-pointer"
                    @click="copy(path_to_copy)">
                    {{ path }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useClipboard } from '@vueuse/core'
import { ref, onMounted } from 'vue'

const emit = defineEmits(['cancel'])
const props = defineProps({ path: String })

const path_to_copy = ref('')
const { copy, copied, isSupported } = useClipboard({ source: path_to_copy })

onMounted(() => {
    path_to_copy.value = props.path
})
</script>

<template>
    <div>
        <span :title="isPathAccessible ? 'Path Accessible' : 'Path Not Accessible'"
            class="ml-2 flex items-center gap-1 text-sm font-medium cursor-pointer select-none"
            :class="isPathAccessible ? 'text-green-600' : 'text-red-600'" @click="showPathWarning = true">
            <font-awesome-icon :icon="isPathAccessible ? 'fa-solid fa-folder-tree' : 'fa-solid fa-circle-xmark'"
                :class="isPathAccessible ? 'text-green-500' : 'text-red-500'" />
        </span>

        <transition name="fade-scale">
            <div v-if="showPathWarning"
                class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
                <div class="bg-white rounded-lg shadow-lg p-5 w-full max-w-sm relative">
                    <button @click="showPathWarning = false"
                        class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-lg focus:outline-none">
                        &times;
                    </button>
                    <div class="flex items-center mb-3">
                        <font-awesome-icon
                            :icon="isPathAccessible ? 'fa-solid fa-folder-tree' : 'fa-solid fa-circle-xmark'"
                            :class="isPathAccessible ? 'text-green-500' : 'text-red-500'" class="mr-2" />
                        <span class="font-semibold text-base">
                            {{ isPathAccessible ? 'Path Accessible' : 'Path Not Accessible' }}
                        </span>
                    </div>
                    <div class="mb-2 text-xs text-gray-600 break-all font-mono bg-gray-50 rounded px-2 py-1">
                        {{ filePath + subFolder }}
                    </div>
                    <div :class="isPathAccessible ? 'text-green-600' : 'text-red-500'" class="text-sm">
                        {{ isPathAccessible
                            ? 'This path is accessible and ready for saving documents.'
                            : 'This path is not accessible. Please check your settings.' }}
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
const isPathAccessible = ref(false)
const showPathWarning = ref(false)

const props = defineProps({
    filePath: {
        type: String,
        required: true
    },
    subFolder: {
        type: String
    }
})

onMounted(async () => {
    const validate_path = await window.LocalCivilApi.validatePath(props.filePath)
    if (validate_path.status) {
        isPathAccessible.value = true
    }
})

</script>
<template>
    <div>
        <span :title="indicatorTitle"
            class="ml-2 flex items-center gap-1 text-sm font-medium cursor-pointer select-none"
            :class="indicatorClasses" @click="openPathDetails">
            <font-awesome-icon :icon="indicatorIcon" :class="indicatorIconClasses" />
            <span v-if="isLoading" class="text-gray-500">Checking path...</span>
            <span v-else>{{ isPathAccessible ? 'Path OK' : 'Path Issue' }}</span>
        </span>

        <transition name="fade-scale">
            <div v-if="showPathDetails"
                class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30"
                @click.self="closePathDetails">
                <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
                    <button @click="closePathDetails"
                        class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl focus:outline-none"
                        aria-label="Close">
                        &times;
                    </button>
                    <div class="flex items-center mb-4">
                        <font-awesome-icon :icon="indicatorIcon" :class="indicatorIconClasses" class="mr-3 text-2xl" />
                        <h3 class="font-semibold text-lg">
                            {{ isPathAccessible ? 'Path Accessible' : 'Path Problem Detected' }}
                        </h3>
                    </div>

                    <div class="mb-4 text-sm text-gray-700 bg-gray-50 rounded p-3 break-all font-mono">
                        <p class="font-bold text-xs text-gray-500 mb-1">Checked Path:</p>
                        {{ fullCheckedPath }}
                    </div>

                    <div :class="isPathAccessible ? 'text-green-700' : 'text-red-600'" class="text-sm leading-relaxed">
                        <p v-if="isPathAccessible">
                            This path is fully accessible and ready for document operations.
                        </p>
                        <div v-else>
                            <p class="font-medium mb-1">Reason for inaccessibility:</p>
                            <p class="bg-red-50 p-2 rounded border border-red-200 text-red-700 font-bold mb-3">
                                {{ pathErrorMessage || 'An unknown error occurred while checking the path.' }}
                            </p>
                            <p class="text-gray-700">
                                <span class="font-medium">Important:</span> Files or content in this directory will
                                **not be accessible** by the system.<br>
                                Please ensure the directory exists, you have necessary read/write permissions, and if
                                it's a network location, that it's properly shared and mounted.
                            </p>
                            <p class="mt-2 text-gray-700">
                                For assistance, contact your **administrator** to resolve the path accessibility issue.
                            </p>
                        </div>
                    </div>

                    <div class="mt-6 text-right">
                        <button @click="closePathDetails"
                            class="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200">
                            Got It
                        </button>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';

// Define props with proper defaults/types
const props = defineProps({
    filePath: {
        type: String,
        required: true
    },
    // The subFolder should be passed to the backend for accurate full path validation
    subFolder: {
        type: String,
        default: '' // Default to empty string if not provided
    }
});

// Reactive state variables
const isPathAccessible = ref(false);
const pathErrorMessage = ref(null); // Stores the error message from the backend
const showPathDetails = ref(false); // Changed from showPathWarning for clearer intent
const isLoading = ref(true); // New state for loading

// Computed properties for dynamic classes and text
const indicatorClasses = computed(() => ({
    'text-green-600': isPathAccessible.value,
    'text-red-600': !isPathAccessible.value,
    'text-gray-500': isLoading.value // Dim text while loading
}));

const indicatorIcon = computed(() => {
    if (isLoading.value) return ['fas', 'spinner']; // Use a spinner icon for loading
    return isPathAccessible.value ? ['fas', 'folder-tree'] : ['fas', 'circle-xmark'];
});

const indicatorIconClasses = computed(() => ({
    'text-green-500': isPathAccessible.value && !isLoading.value,
    'text-red-500': !isPathAccessible.value && !isLoading.value,
    'animate-spin': isLoading.value // Animate spinner
}));

const indicatorTitle = computed(() => {
    if (isLoading.value) return 'Checking path accessibility...';
    return isPathAccessible.value ? 'Path Accessible' : 'Path Not Accessible';
});

const fullCheckedPath = computed(() => {
    // Ideally, the full path checked by the backend should be returned
    // However, if the backend only returns status and error,
    // we construct it here for display.
    // Ensure the backend handles path.join correctly for subFolder.
    if (props.subFolder) {
        // This assumes your backend path.join handles the subfolder.
        // If your backend only validates filePath and expects subFolder to be appended,
        // you would need to adjust the backend or the way you call validatePath.
        // For now, let's assume `validatePath` expects the base path.
        // If you passed the combined path to `validatePath`, you'd display that combined path here.
        // For this example, we'll assume `validatePath` only checks `filePath`.
        return `${props.filePath}${props.subFolder}`; // This is a simple concatenation.
        // For robust path joining, this should ideally come from backend
        // or use path.join in a preload script if appropriate.
    }
    return props.filePath;
});

// Functions to control the modal
const openPathDetails = () => {
    showPathDetails.value = true;
};

const closePathDetails = () => {
    showPathDetails.value = false;
};

// Lifecycle hook to perform path validation
onMounted(async () => {
    try {
        // Send both filePath and subFolder to the backend for complete validation
        // Your backend should now use path.join(filePath, subFolder) for validation
        const response = await window.LocalCivilApi.validatePath(props.filePath, props.subFolder);

        isPathAccessible.value = response.status;
        pathErrorMessage.value = response.error; // Store the error message
    } catch (error) {
        console.error("Error calling validatePath API:", error);
        isPathAccessible.value = false;
        pathErrorMessage.value = "An unexpected error occurred during path validation.";
    } finally {
        isLoading.value = false; // Turn off loading state once done
    }
});
</script>

<style scoped>
/* Transition styles */
.fade-scale-enter-active,
.fade-scale-leave-active {
    transition: all 0.3s ease;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
    opacity: 0;
    /* transform: scale(0.9); */
}
</style>
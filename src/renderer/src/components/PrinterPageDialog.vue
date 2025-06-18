<template>
    <div class="fixed inset-0 flex items-center justify-center z-[90] p-10 bg-black/40 backdrop-blur-sm">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-lg p-4 gap-2 relative max-h-full flex flex-col">
            <div class="h-12 relative flex items-center">
                <h2 class="text-xl font-medium text-gray-800">Select Pages to Print</h2>
                <button @click="emit('close')" class="text-gray-500 ml-auto hover:text-gray-700 text-3xl leading-none">
                    &times;
                </button>
            </div>

            <div class="flex-1 flex flex-col gap-4 h-full overflow-y-auto p-1">
                <div class="grid gap-2">
                    <div class="flex flex-col gap-1">
                        <label class="text-sm font-medium text-gray-700" for="page-input">Pages to Print</label>
                        <input v-model="pageRange" type="text" id="page-input" placeholder="e.g., 1, 1-2, 2"
                            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" />
                        <p class="text-sm text-gray-700 mt-1 font-medium">
                            Enter a single page number or a single page range.
                            <span class="font-normal text-gray-500">
                                <br />
                                <br />
                                Examples:
                                <br />
                                • **1**: Prints only page 1.
                                <br />
                                • **1-2**: Prints pages 1 through 2.
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            <div class="mt-6 flex justify-end space-x-3 h-10">
                <button @click="emit('close')"
                    class="px-4 py-2 border flex items-center border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                    Cancel
                </button>
                <button ref="printButton" @click="handlePrint" :disabled="!pageRange"
                    class="px-4 py-2 bg-blue-600 flex items-center text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    Print
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, defineProps, defineEmits } from 'vue';
import { useToast } from '../lib/useToast';


const toast = useToast();
const emit = defineEmits(['close']);

const props = defineProps({
    pdfBase64: {
        type: String,
        required: true,
    },
});

const pageRange = ref('1-2');
const printButton = ref(null);

onMounted(() => {
    if (printButton.value) {
        printButton.value.focus();
    }
});

/**
 * Handles the print action when the "Print" button is clicked.
 * Validates the page range input and initiates the PDF printing process.
 */
const handlePrint = async () => {
    const trimmedPageRange = pageRange.value.trim();


    if (trimmedPageRange === '') {
        toast.fire({
            icon: 'error',
            title: 'Page range cannot be empty.',
            duration: 8000,
        });
        return;
    }

    // Updated Regex: Only allows single number or a single range like "1-2"
    const pageRangeRegex = /^(\d+)(-\d+)?$/;

    if (!pageRangeRegex.test(trimmedPageRange)) {
        toast.fire({
            icon: 'error',
            title: 'Invalid page range format.',
            duration: 8000,
        });
        return;
    }

    // Additional check for "1-1" or similar
    if (trimmedPageRange.includes('-')) {
        const [fromStr, toStr] = trimmedPageRange.split('-');
        const from = parseInt(fromStr.trim());
        const to = parseInt(toStr.trim());

        if (!isNaN(from) && !isNaN(to) && from === to) {
            toast.fire({
                icon: 'error',
                title: 'Invalid page range.',
                duration: 8000,
            });
            return;
        }
    }


    try {
        const parsedPageRanges = parsePageRanges(trimmedPageRange);

        const printResult = await window.LocalCivilApi.printPDF(
            props.pdfBase64,
            '',
            '',
            'method2',
            JSON.stringify(parsedPageRanges),
        );

        console.log('Print initiated successfully:', printResult);
        emit('close');
        toast.fire({
            icon: 'success',
            title: 'Print job sent!',
            duration: 3000,
        });
    } catch (error) {
        console.error('Error during print:', error);
        toast.fire({
            icon: 'error',
            title: 'Printing failed.',
            duration: 8000,
        });
    }
};

/**
 * Parses a single string representing a page number or a page range
 * into an array of objects suitable for the printing API.
 * Page numbers are converted to be 0-indexed.
 * @param {string} input - The raw string input from the page range field (e.g., "1" or "1-2").
 * @returns {Array<{from: number, to: number}> | undefined} An array with a single page range object,
 * or undefined if the input is empty or invalid (though regex should catch most invalid cases now).
 */
function parsePageRanges(input) {
    if (!input.trim()) return undefined;

    const pageRanges = [];

    if (input.includes('-')) {
        const [fromStr, toStr] = input.split('-');
        const from = parseInt(fromStr.trim()) - 1; // Convert to 0-indexed
        const to = parseInt(toStr.trim()) - 1;     // Convert to 0-indexed

        // This check should largely be covered by the handlePrint's validation,
        // but remains as a safeguard for the parse logic.
        if (!isNaN(from) && !isNaN(to) && from < to) { // Ensure from is strictly less than to
            pageRanges.push({ from, to });
        } else {
            // This case should ideally not be reached if handlePrint's regex and checks are robust.
            console.warn(`Invalid range part in parsePageRanges (should be caught earlier): ${input}`);
        }
    } else {
        const page = parseInt(input.trim()) - 1; // Convert to 0-indexed
        if (!isNaN(page) && page >= 0) {
            pageRanges.push({ from: page, to: page });
        }
    }
    return pageRanges.length > 0 ? pageRanges : undefined;
}
</script>

<style scoped>
/* No additional scoped styles are needed, as Tailwind classes handle the focus styles directly. */
</style>
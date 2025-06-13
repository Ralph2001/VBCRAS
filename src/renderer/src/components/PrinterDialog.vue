<template>
    <div
        class="fixed inset-0 flex items-center justify-center z-[999999999999999999999999999999999999999999999999999999999999999999999] p-10 bg-black/40 backdrop-blur-sm ">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-lg p-4 gap-2 relative max-h-full flex flex-col">
            <div class="h-12 relative flex items-center">

                <h2 class="text-xl font-medium text-gray-800 ">Print Document</h2>
                <button @click="emit('close')" class=" text-gray-500 ml-auto hover:text-gray-700 text-3xl leading-none">
                    &times;
                </button>

            </div>
            <div class="flex-1 flex flex-col gap-4 h-full overflow-y-auto p-1">
                <div class="grid grid-cols-2 gap-2">
                    <div class="flex flex-col gap-1">
                        <label class="text-sm" for="">Printer</label>
                        <select v-model="selectedPrinterName"
                            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500">
                            <option value="" disabled>— Select Printer —</option>
                            <option v-for="printer in printers" :key="printer.name" :value="printer.name">
                                {{ printer.name }}
                            </option>
                        </select>
                    </div>
                    <div class="flex flex-col gap-1">
                        <label class="text-sm" for="">Paper Size</label>
                        <select v-model="selectedPaperSize"
                            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500">
                            <option value="" disabled>— Paper Size (Auto) —</option>
                            <option v-for="size in availablePaperSizes" :key="size" :value="size">

                                {{ size }}
                            </option>
                        </select>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-2">
                    <div class="flex flex-col gap-1">
                        <label class="text-sm" for="">Pages</label>
                        <input v-model="pageRange" type="text" placeholder="Pages (e.g., 1,3-5)"
                            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" />

                    </div>

                    <div class="flex flex-col gap-1">
                        <label class="text-sm" for="">Copies</label>
                        <input v-model.number="options.copies" type="number" min="1" placeholder="Copies (e.g., 1)"
                            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>

                </div>
                <div class="flex items-center space-x-4">
                    <label class="flex items-center space-x-2 text-gray-700">
                        <input type="checkbox" v-model="options.color"
                            class="form-checkbox h-4 w-4 text-blue-600 rounded" />
                        <span class="text-sm">Color</span>
                    </label>
                    <label class="flex items-center space-x-2 text-gray-700">
                        <input type="checkbox" v-model="options.landscape"
                            class="form-checkbox h-4 w-4 text-blue-600 rounded" />
                        <span class="text-sm">Landscape</span>
                    </label>
                </div>
                <div class="pt-2">
                    <button @click="showAdvancedOptions = !showAdvancedOptions"
                        class="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        {{ showAdvancedOptions ? 'Hide advanced options' : 'Show advanced options' }}
                    </button>
                </div>

                <div v-if="showAdvancedOptions" class="space-y-4 pt-4 border-t border-gray-200 ">


                    <div class="grid grid-cols-2">
                        <label class="flex items-center space-x-2 text-gray-700">
                            <input type="checkbox" v-model="options.printBackground"
                                class="form-checkbox h-4 w-4 text-blue-600 rounded" />
                            <span class="text-sm">Print Background</span>
                        </label>

                        <label class="flex items-center space-x-2 text-gray-700">
                            <input type="checkbox" v-model="options.collate"
                                class="form-checkbox h-4 w-4 text-blue-600 rounded" />
                            <span class="text-sm">Collate</span>
                        </label>
                    </div>

                    <div class="grid grid-cols-2 gap-2">

                        <div class="flex flex-col gap-1">
                            <label class="text-sm" for="">Pages per sheet (e.g., 1)</label>
                            <input v-model.number="options.pagesPerSheet" type="number" min="1"
                                placeholder="Pages per sheet (e.g., 1)"
                                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div class="flex flex-col gap-1">
                            <label class="text-sm" for="">Scale Factor</label>
                            <input v-model.number="options.scaleFactor" type="number" step="0.1" min="0.1" max="2"
                                placeholder="Scale (e.g., 1.0)"
                                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-2">

                        <div class="flex flex-col gap-1">
                            <label class="text-sm" for="">DPI Vertical</label>
                            <input v-model.number="options.dpi.vertical" type="number" min="100"
                                placeholder="DPI Vertical"
                                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" />
                        </div>

                        <div class="flex flex-col gap-1">
                            <label class="text-sm" for="">DPI Horizontal</label>
                            <input v-model.number="options.dpi.horizontal" type="number" min="100"
                                placeholder="DPI Horizontal"
                                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-2">


                        <div class="flex flex-col gap-1">
                            <label class="text-sm" for="">Duplex Mode</label>
                            <select v-model="options.duplexMode"
                                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="simplex">Simplex</option>
                                <option value="shortEdge">Short Edge</option>
                                <option value="longEdge">Long Edge</option>
                            </select>

                        </div>


                        <div class="flex flex-col gap-1">
                            <label class="text-sm" for="">Margin</label>
                            <select v-model="options.margins.marginType"
                                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="default">Default Margins</option>
                                <option value="none">No Margins</option>
                                <option value="printableArea">Printable Area</option>
                                <option value="custom">Custom Margins</option>
                            </select>
                        </div>
                    </div>


                    <div v-if="options.margins.marginType === 'custom'" class="grid grid-cols-2 gap-4">
                        <input v-model.number="options.margins.top" type="number" placeholder="Top (px)"
                            class="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" />
                        <input v-model.number="options.margins.bottom" type="number" placeholder="Bottom (px)"
                            class="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" />
                        <input v-model.number="options.margins.left" type="number" placeholder="Left (px)"
                            class="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" />
                        <input v-model.number="options.margins.right" type="number" placeholder="Right (px)"
                            class="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>


                </div>
            </div>

            <div class="mt-6  flex justify-end space-x-3 h-10">
                <button @click="emit('close')"
                    class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                    Cancel
                </button>
                <button @click="handlePrint" :disabled="!selectedPrinterName"
                    class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                    Print
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, defineProps, defineEmits, reactive } from 'vue';

const props = defineProps({
    pdfBase64: { type: String, required: true }
});

const showAdvancedOptions = ref(false)

const emit = defineEmits(['close', 'print-initiated']);

const printers = ref([]);
const selectedPrinterName = ref('');
const selectedPaperSize = ref('Long Coupon');
const pageRange = ref('');

const availablePaperSizes = ['A4', 'Letter', 'Legal', 'Long Coupon'];

const options = reactive({
    printBackground: true,
    color: true,
    landscape: false,
    copies: 1,
    duplexMode: 'simplex',
    scaleFactor: 1,
    pagesPerSheet: 1,
    collate: true,
    margins: { marginType: 'default', top: 0, bottom: 0, left: 0, right: 0 },
    dpi: { horizontal: 300, vertical: 300 },
});

onMounted(async () => {
    try {
        printers.value = await window.LocalCivilApi.getPrinters();
        const saved = localStorage.getItem('preferredPrinter');
        if (saved && printers.value.some(p => p.name === saved)) {
            selectedPrinterName.value = saved;
        }
    } catch (e) {
        console.error('Printer fetch failed:', e);
    }
});

const handlePrint = async () => {
    if (!selectedPrinterName.value) return alert('Select a printer.');

    const pageSize = selectedPaperSize.value
    const pageRanges = parsePageRanges(pageRange.value);

    const finalOptions = {
        ...options,
        pageSize,
        pageRanges
    };

console.log(finalOptions)

    try {
        const optionData = JSON.stringify(finalOptions);

        console.log(optionData)

        const result = await window.LocalCivilApi.printPDF(
            props.pdfBase64,
            selectedPrinterName.value,
            optionData // JSON string
        );

        console.log(result)

        // if (result.success) {
        //     emit('print-initiated');
        //     emit('close');
        // } else {
        //     // alert(`Print error: ${result.message}`);
        //     console.log(result.message)
        // }
    } catch (error) {
        // alert('Unexpected error during print.');
        console.error(error);
    }
};

function parsePageRanges(input) {
    if (!input.trim()) return undefined;
    const ranges = input.split(',').map(part => part.trim());
    const pageRanges = [];
    for (const r of ranges) {
        if (r.includes('-')) {
            const [from, to] = r.split('-').map(n => parseInt(n.trim()) - 1);
            if (!isNaN(from) && !isNaN(to)) pageRanges.push({ from, to });
        } else {
            const page = parseInt(r) - 1;
            if (!isNaN(page)) pageRanges.push({ from: page, to: page });
        }
    }
    return pageRanges.length > 0 ? pageRanges : undefined;
}
</script>

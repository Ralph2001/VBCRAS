<template>
    <div
        class="fixed inset-0 flex items-center justify-center z-[999999999999999999999999999999999999999999999999999999999999999999999999999999999] bg-black/40 backdrop-blur-sm">
        <div class="bg-white w-full max-w-2xl rounded-xl shadow p-6 relative">
            <button @click="emit('close')" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl">
                &times;
            </button>

            <h2 class="text-2xl font-semibold text-gray-700 mb-6">Print Document</h2>

            <div class="space-y-4">
                <select v-model="selectedPrinterName" class="w-full border rounded px-3 py-2">
                    <option value="" disabled>-- Select Printer --</option>
                    <option v-for="printer in printers" :key="printer.name" :value="printer.name">
                        {{ printer.name }}
                    </option>
                </select>

                <select v-model="selectedPaperSize" class="w-full border rounded px-3 py-2">
                    <option value="" disabled>-- Paper Size (Auto) --</option>
                    <option v-for="size in availablePaperSizes" :key="size" :value="size">
                        {{ size.charAt(0).toUpperCase() + size.slice(1) }}
                    </option>
                </select>

                <input v-model="pageRange" type="text" placeholder="Pages to print (e.g., 1,3-5)"
                    class="w-full border rounded px-3 py-2" />

                <div class="grid grid-cols-2 gap-4">
                    <label class="flex items-center space-x-2">
                        <input type="checkbox" v-model="options.printBackground" />
                        <span class="text-sm">Print Background</span>
                    </label>

                    <label class="flex items-center space-x-2">
                        <input type="checkbox" v-model="options.color" />
                        <span class="text-sm">Color</span>
                    </label>

                    <label class="flex items-center space-x-2">
                        <input type="checkbox" v-model="options.landscape" />
                        <span class="text-sm">Landscape</span>
                    </label>

                    <label class="flex items-center space-x-2">
                        <input type="checkbox" v-model="options.collate" />
                        <span class="text-sm">Collate</span>
                    </label>

                    <input v-model.number="options.copies" type="number" min="1" placeholder="Copies"
                        class="border rounded px-3 py-2" />

                    <input v-model.number="options.pagesPerSheet" type="number" min="1" placeholder="Pages/Sheet"
                        class="border rounded px-3 py-2" />

                    <input v-model.number="options.scaleFactor" type="number" step="0.1" min="0.1" max="2"
                        placeholder="Scale (e.g., 1.0)" class="border rounded px-3 py-2" />

                    <select v-model="options.duplexMode" class="border rounded px-3 py-2">
                        <option value="simplex">Simplex</option>
                        <option value="shortEdge">Short Edge</option>
                        <option value="longEdge">Long Edge</option>
                    </select>

                    <input v-model.number="options.dpi.horizontal" type="number" min="100" placeholder="DPI Horizontal"
                        class="border rounded px-3 py-2" />

                    <input v-model.number="options.dpi.vertical" type="number" min="100" placeholder="DPI Vertical"
                        class="border rounded px-3 py-2" />

                    <select v-model="options.margins.marginType" class="border rounded px-3 py-2">
                        <option value="default">Default</option>
                        <option value="none">None</option>
                        <option value="printableArea">Printable Area</option>
                        <option value="custom">Custom</option>
                    </select>

                    <template v-if="options.margins.marginType === 'custom'">
                        <input v-model.number="options.margins.top" type="number" placeholder="Top Margin (px)"
                            class="border rounded px-3 py-2" />
                        <input v-model.number="options.margins.bottom" type="number" placeholder="Bottom Margin (px)"
                            class="border rounded px-3 py-2" />
                        <input v-model.number="options.margins.left" type="number" placeholder="Left Margin (px)"
                            class="border rounded px-3 py-2" />
                        <input v-model.number="options.margins.right" type="number" placeholder="Right Margin (px)"
                            class="border rounded px-3 py-2" />
                    </template>
                </div>

                <input v-model="options.header" type="text" placeholder="Header (optional)"
                    class="w-full border rounded px-3 py-2" />

                <input v-model="options.footer" type="text" placeholder="Footer (optional)"
                    class="w-full border rounded px-3 py-2" />
            </div>

            <div class="mt-6 flex justify-end gap-3">
                <button @click="handlePrint" :disabled="!selectedPrinterName"
                    class="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
                    Print
                </button>
                <button @click="emit('close')" class="border px-5 py-2 rounded">Cancel</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, defineProps, defineEmits, reactive } from 'vue';

const props = defineProps({
    pdfBase64: { type: String, required: true }
});

const emit = defineEmits(['close', 'print-initiated']);

const printers = ref([]);
const selectedPrinterName = ref('');
const selectedPaperSize = ref('');
const pageRange = ref('');

const availablePaperSizes = ['A4', 'letter', 'legal', 'LongCoupon'];

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
    header: '',
    footer: ''
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

    const pageSize = selectedPaperSize.value || undefined;
    const pageRanges = parsePageRanges(pageRange.value);

    const finalOptions = {
        ...options,
        pageSize,
        pageRanges
    };


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

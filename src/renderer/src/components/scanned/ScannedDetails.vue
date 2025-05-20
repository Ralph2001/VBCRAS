<template>
    <div class="fixed inset-0 bg-white z-50 flex flex-col h-screen">

        <!-- Header / Toolbar -->
        <div class="p-4 border-b flex items-center justify-between bg-gray-100 shadow-sm">
            <h2 class="font-semibold text-lg text-gray-800">
                <!-- {{ previewPage === 1 ? 'Application for Marriage License' : 'Notice of Posting' }} -->
                {{ props.fileInfo.name ? props.fileInfo.name.replace('.pdf', '') : 'Unnamed' }}
            </h2>
            <button @click="emits(
                'close-details'
            )" class="text-gray-500 hover:text-gray-700">
                <font-awesome-icon icon="fa-solid fa-xmark" class="text-xl" />
            </button>
        </div>


        <!-- Controls Section -->
        <div class="flex items-center justify-between px-4 py-3 bg-gray-100 border-b shadow text-sm text-gray-600">

            <!-- Minimal Metadata -->
            <div class="space-x-4 truncate">
                <span><strong>Type:</strong> {{ props.fileInfo.scanned_type?.name || 'N/A' }}</span>
                <span><strong>Year:</strong> {{ props.fileInfo.year }}</span>
                <span><strong>Month:</strong> {{ props.fileInfo.month }}</span>

            </div>

            <!-- Action Buttons -->
            <div class="flex items-center space-x-2">
                <label
                    class="inline-flex items-center space-x-2 cursor-pointer border broder-gray-300 rounded-md shadow-sm px-3 py-1.5 bg-white">
                    <input type="checkbox" v-model="isCertifiedTrueCopy"
                        class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <span class="text-sm text-gray-800 font-medium">Certified True Copy</span>
                </label>
                <button @click="handlePreviewPrint(props.pdfbase64)"
                    class="bg-green-500 text-white px-3 py-1.5 rounded hover:bg-green-600">
                    <font-awesome-icon icon="fa-solid fa-print" class="mr-1" />
                    Print
                </button>
            </div>

        </div>

        <!-- PDF Preview -->
        <div class="flex-1 overflow-auto flex flex-row bg-gray-50  items-center justify-center relative">
            <div class="grow h-full flex items-center justify-center">
                <PDFViewerWorker :pdfBytes64="pdfbase64" />
            </div>
            <div class="w-72 p-4 border-l bg-white h-full" v-if="isCertifiedTrueCopy">
                <h3 class="text-sm font-semibold text-gray-800 mb-3">Certified True Copy Settings</h3>

                <!-- Predefined Positions -->
                <div class="mb-4">
                    <label for="position" class="block text-xs text-gray-800 font-semibold mb-1">Predefined
                        Position</label>
                    <select id="position" v-model="position"
                        class="w-full text-sm border rounded px-3 py-1.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400">
                        <option disabled value="">Select Position</option>
                        <option value="top-right">Top Right</option>
                        <option value="top-center">Top Center</option>
                        <option value="top-left">Top Left</option>
                        <option value="bottom-right">Bottom Right</option>
                        <option value="bottom-center">Bottom Center</option>
                        <option value="bottom-left">Bottom Left</option>
                    </select>
                </div>

                <!-- Manual Coordinates -->
                <label for="position" class="block text-xs text-gray-800 font-semibold mb-1 ">Manually Set
                    Position</label>
                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label for="pos-x" class="block text-xs text-gray-600 mb-1">X Position</label>
                        <input id="pos-x" type="number" v-model="positionX"
                            class="w-full text-sm border rounded px-3 py-1.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400">
                    </div>
                    <div>
                        <label for="pos-y" class="block text-xs text-gray-600 mb-1">Y Position</label>
                        <input id="pos-y" type="number" v-model="positionY"
                            class="w-full text-sm border rounded px-3 py-1.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400">
                    </div>
                </div>

                <!-- Color Picker -->
                <label class="block text-xs text-gray-800 font-semibold mb-2 ">Change Stamp Color</label>

                <!-- Predefined Color Circles -->
                <div class="flex items-center gap-2 mb-3">
                    <div v-for="color in predefinedColors" :key="color" :style="{ backgroundColor: color }"
                        @click="stampColor = color" class="w-6 h-6 rounded-full cursor-pointer border border-gray-300"
                        :class="stampColor === color ? 'ring-2 ring-offset-1 ring-blue-400' : ''" :title="color">
                    </div>

                </div>

                <!-- Custom Color Picker -->
                <!-- <div>
                    <label for="stampColor" class="block text-xs text-gray-600 mb-1">Custom Color</label>
                    <input id="stampColor" type="color" v-model="stampColor"
                        class="w-full h-9 border rounded cursor-pointer bg-white p-1" />
                </div> -->

            </div>


        </div>
    </div>
</template>
<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import PDFViewerWorker from '../PDFViewerWorker.vue';
const emits = defineEmits(['close-details'])

// State Variables
const isCertifiedTrueCopy = ref(false);
const position = ref('bottom-right');
const positionX = ref(0);
const positionY = ref(0);
const stampColor = ref('#4169E1');
const predefinedColors = ['#4169E1'];


const props = defineProps({
    fileInfo: {
        type: [Array, Object]
    }
})

const pdfbase64 = ref(null)
onMounted(async () => {
    try {
        const path = await window.ScannedApi.OpenInSideBar(props.fileInfo.filepath);
        pdfbase64.value = path.fileUrl;
        originalPdfBytes.value = path.fileUrl;
    } catch (error) {
        console.error(error);
    }
});

onUnmounted(() => {
    pdfbase64.value = null;
});



const handlePreviewPrint = async () => {
    try {
        const print = await window.LocalCivilApi.printPDFBase64(pdfbase64.value);
        console.log('Print result:', print);
    } catch (error) {
        console.error('Error printing PDF:', error);
    }
};

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
const originalPdfBytes = ref(null);

watch([isCertifiedTrueCopy, position, positionX, positionY, stampColor], async () => {
    if (!originalPdfBytes.value) return;

    const pdfDoc = await PDFDocument.load(originalPdfBytes.value);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const colorRgb = hexToRgb(stampColor.value);

    const lineSpacing = 3;
    const padding = 8;
    const lines = [
        // { text: 'For and in the absence of:', font: fontItalic, size: 9 },
        { text: 'LOCAL CIVIL REGISTRY OFFICE', font: fontBold, size: 9 },
        { text: 'Bayambang, Pangasinan', font: fontBold, size: 9 },
        { text: 'CERTIFIED TRUE COPY', font: fontBold, size: 14 },
        { text: '', font: fontRegular, size: 12 },
        { text: 'ISMAEL D. MALICDEM, JR.', font: fontBold, size: 10 },
        { text: 'Municipal Civil Registrar', font: fontBold, size: 9 },
        { text: '', font: fontRegular, size: 12 },
        // { text: 'ERIKA JOYCE B. PARAGAS', font: fontBold, size: 10 },
        // { text: 'Registration Officer I', font: fontBold, size: 9 },

    ];

    // Calculate dimensions
    const textWidths = lines.map(line => line.font.widthOfTextAtSize(line.text, line.size));
    const maxTextWidth = Math.max(...textWidths);
    const boxWidth = maxTextWidth + padding * 4;

    const sumLineSizes = lines.reduce((sum, line) => sum + line.size, 0);
    const totalLineSpacing = (lines.length - 1) * lineSpacing;
    const boxHeight = sumLineSizes + totalLineSpacing + padding * 2;

    let x = positionX.value || 0;
    let y = positionY.value || 0;

    // Handle predefined positions
    if (position.value && !positionX.value && !positionY.value) {
        const { width, height } = firstPage.getSize();
        const margin = 20;
        const posMap = {
            'top-left': [margin, height - margin - boxHeight],
            'top-center': [(width - boxWidth) / 2, height - margin - boxHeight],
            'top-right': [width - margin - boxWidth, height - margin - boxHeight],
            'bottom-left': [margin, margin],
            'bottom-center': [(width - boxWidth) / 2, margin],
            'bottom-right': [width - margin - boxWidth, margin]
        };
        [x, y] = posMap[position.value] || [0, 0];
    }

    if (isCertifiedTrueCopy.value) {
        // Draw border
        // firstPage.drawRectangle({
        //     x,
        //     y,
        //     width: boxWidth,
        //     height: boxHeight,
        //     borderColor: rgb(colorRgb.r, colorRgb.g, colorRgb.b),
        //     borderWidth: 1.5,
        // });

        // Draw text lines
        let currentY = y + boxHeight - padding;
        lines.forEach(line => {
            if (line.text) {
                const textWidth = line.font.widthOfTextAtSize(line.text, line.size);
                const textX = x + (boxWidth - textWidth) / 2;
                const textY = currentY - line.size;

                firstPage.drawText(line.text, {
                    x: textX,
                    y: textY,
                    size: line.size,
                    font: line.font,
                    color: rgb(colorRgb.r, colorRgb.g, colorRgb.b),
                });
            }
            currentY -= line.size + lineSpacing;
        });
    }

    const modifiedPdfBytes = await pdfDoc.saveAsBase64({ dataUri: true });
    pdfbase64.value = modifiedPdfBytes;
}, { immediate: true });




function hexToRgb(hex) {
    const bigint = parseInt(hex.replace('#', ''), 16);
    return {
        r: ((bigint >> 16) & 255) / 255,
        g: ((bigint >> 8) & 255) / 255,
        b: (bigint & 255) / 255
    };
}
</script>
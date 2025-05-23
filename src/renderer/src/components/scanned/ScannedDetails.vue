<template>
    <div class="fixed inset-0 bg-white z-50 flex flex-col h-screen">
        <!-- Header -->
        <div class="p-4 border-b flex items-center justify-between bg-gray-100 shadow-sm">
            <div class="flex flex-col">
                <h2 class="font-semibold text-lg text-gray-800 truncate">
                    {{ props.fileInfo.name?.replace('.pdf', '') || 'Unnamed' }}
                </h2>
                <div class="space-x-4 truncate text-xs">

                </div>
            </div>
            <button @click="emits('close-details')" class="text-gray-500 hover:text-gray-700">
                <font-awesome-icon icon="fa-solid fa-xmark" class="text-xl" />
            </button>
        </div>

        <!-- Info Bar -->
        <div class="flex items-center justify-between px-4 py-3 bg-gray-100 border-b shadow text-sm text-gray-600">
            <div class="flex items-center space-x-2">
                <button @click="isFilterOpen = !isFilterOpen" :disabled="isCertifiedTrueCopy"
                    :class="isFilterOpen ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 hover:bg-gray-400'"
                    class="px-3 py-1.5 rounded  text-gray-800 font-medium  disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed">
                    Filter
                </button>
                <button @click="selectedPreset = 'Normal'" :disabled="isCertifiedTrueCopy"
                    v-if="selectedPreset !== 'Normal'"
                    class="px-3 py-1.5 rounded  text-white font-medium bg-red-400 hover:bg-red-500 disabled:bg-gray-300 disabled:cursor-not-allowed">
                    Reset Filter
                </button>
            </div>

            <div class="flex justify-center items-center gap-4 my-2 text-sm">
                <button @click="prevPage" :disabled="currentPageNum <= 1"
                    class="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white">
                    Prev
                </button>

                <span class="text-gray-700">Page {{ currentPageNum }} / {{ totalPages }}</span>

                <button @click="nextPage" :disabled="currentPageNum >= totalPages"
                    class="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white">
                    Next
                </button>
                <button @click="rotate" class="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white"
                    title="Rotate">
                    <font-awesome-icon icon="fa-solid fa-rotate-right" />
                </button>
            </div>

            <div class="flex items-center space-x-2">

                <label :disabled="isFilterOpen" :class="isFilterOpen ? 'bg-gray-300 cursor-not-allowed' : ''"
                    class="inline-flex items-center space-x-2 cursor-pointer border broder-gray-300 rounded-md shadow-sm px-3 py-1.5 bg-white">
                    <input :disabled="isFilterOpen" :class="isFilterOpen ? 'bg-gray-300 cursor-not-allowed' : ''"
                        type="checkbox" v-model="isCertifiedTrueCopy"
                        class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <span class="text-sm text-gray-800 font-medium">Certified True Copy</span>
                </label>

                <button @click="handlePreviewPrint"
                    class="bg-green-500 text-white px-3 py-1.5 rounded hover:bg-green-600 ">
                    <font-awesome-icon icon="fa-solid fa-print" class="mr-1" />
                    Print
                </button>

            </div>
        </div>

        <div class="flex-1 flex flex-row overflow-hidden">
            <div class="flex-1 overflow-auto bg-gray-900 relative" @wheel.ctrl.prevent="handleWheelZoom">
                <div class="min-w-full min-h-full p-4" :style="{ filter: canvasFilter }">
                    <canvas ref="pdfCanvas" class="shadow-md  mx-auto block"></canvas>

                    <div v-if="isCertifiedTrueCopy" v-for="(box, index) in boxes.filter(b => b.page === currentPageNum)"
                        :key="index" class="absolute flex flex-col cursor-move text-center overflow-hidden" :style="{
                            top: `${offsetY + box.y * scale}px`,
                            left: `${offsetX + box.x * scale}px`,
                            width: `${box.width * scale}px`,
                            height: `${box.height * scale}px`,
                        }" @mousedown="startDrag(index, $event)">
                        <div :style="{ color: stampColor }"
                            class="flex-1 flex flex-col gap-0  justify-center  select-none space-y-0 active:rounded-md hover:border-dashed hover:border-blue-600 hover:border-2 transition-colors duration-300 active:border-dashed  active:border-blue-600 active:border-2">

                            <p v-for="text in textChar" :key="text.title" :style="{
                                fontSize: `${text.fontSize * scale}px`,
                                fontWeight: text.fontWeight,
                                lineHeight: `${text.fontSize * scale * 1.2}px`,

                            }" class="text-center">
                                {{ text.title }}
                            </p>

                        </div>
                    </div>
                </div>

            </div>
            <div class="w-72 p-4 border-l bg-white h-full" v-if="null">
                <h3 class="text-sm font-semibold text-gray-800 mb-3">Certified True Copy Settings</h3>

                <!-- Predefined Positions -->
                <div class="mb-4">
                    <label for="position" class="block text-xs text-gray-800 font-semibold mb-1">Predefined
                        Position</label>
                    <select id="position" v-model="position"
                        class="w-full text-sm border rounded px-3 py-1.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400">
                        <option disabled value="">Select Position</option>
                        <option :value="pos.value" v-for="pos in predefinedPositions" :key="pos.name">{{ pos.name }}
                        </option>
                    </select>
                </div>

                <!-- Manual Coordinates -->
                <label for="position" class="block text-xs text-gray-800 font-semibold mb-1 ">Stamp Page</label>
                <div class="grid gap-4 mb-4">

                    <select id="position" v-model="boxes[0].page"
                        class="w-full text-sm border rounded px-3 py-1.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400">
                        <option disabled value="">Select Page</option>
                        <option :value="i" v-for="i in totalPages" :key="i">{{ i }}</option>
                    </select>


                </div>
                <label for="position" class="block text-xs text-gray-800 font-semibold mb-1 ">Manually Set
                    Position</label>
                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label for="pos-x" class="block text-xs text-gray-600 mb-1">X Position</label>
                        <input id="pos-x" type="number" v-model="x_pos"
                            class="w-full text-sm border rounded px-3 py-1.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400">
                    </div>
                    <div>
                        <label for="pos-y" class="block text-xs text-gray-600 mb-1">Y Position</label>
                        <input id="pos-y" type="number" v-model="y_pos"
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

            </div>
            <div v-if="isFilterOpen" class="w-72 p-3 border-l bg-white h-full text-sm text-gray-700">
                <h3 class="font-medium mb-2">Filters</h3>

                <!-- Presets -->
                <div class="mb-4">
                    <label for="preset" class="block mb-1 text-xs font-medium">Preset</label>
                    <select id="preset" v-model="selectedPreset"
                        class="w-full border rounded px-2 py-1 bg-gray-50 focus:outline-none focus:ring">
                        <option v-for="p in filterPresets" :key="p.name" :value="p.name">{{ p.name }}</option>
                    </select>
                </div>

                <!-- Sliders -->
                <template v-for="control in filterControls" :key="control.key">
                    <div class="mb-3">
                        <label :for="control.key" class="block mb-1 text-xs">
                            {{ control.label }} ({{ filters[control.key] }}{{ control.unit }})
                        </label>
                        <input type="range" :id="control.key" :min="control.min" :max="control.max" :step="control.step"
                            v-model.number="filters[control.key]" class="w-full" />
                    </div>
                </template>

                <button @click="selectedPreset = 'Normal'"
                    class="w-full mt-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-xs">
                    Reset to Normal
                </button>
            </div>




        </div>
    </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch, nextTick, watchEffect, computed } from 'vue'
import * as pdfjsLib from 'pdfjs-dist/webpack'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

const emits = defineEmits(['close-details'])

const currentPageNum = ref(1)
const totalPages = ref(1)

const predefinedPositions = [
    { name: 'Top Right', value: 'top-right', x: 382, y: 26 },
    { name: 'Top Left', value: 'top-left', x: 55, y: 55 },
    { name: 'Bottom Right', value: 'bottom-right', x: 364, y: 819 },
    { name: 'Bottom Left', value: 'bottom-left', x: 28, y: 819 },
]


const isCertifiedTrueCopy = ref(false);
const position = ref('bottom-right');
const stampColor = ref('#000080');
const predefinedColors = ['#000080'];


watchEffect(isCertifiedTrueCopy, async (val) => {
    if (val) {
        scale.value = 1.0
    }
    if (!val) {
        boxes.value = [{ x: 360, y: 832, width: 200, height: 120, page: currentPageNum.value }];
    }
    await nextTick()
    await renderPdf()
})


const textChar = [
    {
        title: 'LOCAL CIVIL REGISTRY OFFICE',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: -0.5
    },
    {
        title: 'Bayambang, Pangasinan',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: -0.5
    },
    {
        title: 'CERTIFIED TRUE COPY',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: -0.5
    },
    {
        title: '\u00A0',
        fontSize: 16,
        fontWeight: '',
        letterSpacing: -0.5
    },
    {
        title: 'ISMAEL D. MALICDEM, JR.',
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: -0.5
    },
    {
        title: 'Municipal Civil Registrar',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: -0.5
    },
]


const props = defineProps({
    fileInfo: {
        type: [Object],
        required: true
    }
})

const pdfbase64 = ref(null)
const pdfCanvas = ref(null);
const scale = ref(1.0);
const offsetX = ref(0);
const offsetY = ref(0);


const boxes = ref([
    { x: 360, y: 832, width: 200, height: 120, page: 1 }
])

watchEffect(() => {
    if (position.value) {
        const selectedPosition = predefinedPositions.find(pos => pos.value === position.value);
        if (selectedPosition) {
            boxes.value[0].x = selectedPosition.x;
            boxes.value[0].y = selectedPosition.y;

        }
    }
});

const updateCanvasOffset = () => {
    if (!pdfCanvas.value) return;
    const parent = pdfCanvas.value.parentElement;
    if (parent) {
        offsetX.value = (parent.clientWidth - pdfCanvas.value.clientWidth) / 2;
        offsetY.value = (parent.clientHeight - pdfCanvas.value.clientHeight) / 2;

    }
};



let pdfDoc = null
let currentPage = null

const handlePreviewPrint = async () => {
    try {
        // ... (existing code to fetch PDF and load with pdf-lib)

        const path = await window.ScannedApi.OpenInSideBar(props.fileInfo.filepath);
        const cleanBase64 = path.fileUrl.replace(/^data:application\/pdf;base64,/, '');
        const bytes = Uint8Array.from(atob(cleanBase64), c => c.charCodeAt(0));

        const pdfDoc = await PDFDocument.load(bytes);
        const pages = pdfDoc.getPages();

        const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);

        if (isCertifiedTrueCopy.value) {
            for (const box of boxes.value) { // Use for...of for easier async/await if needed later, though not strictly required here.
                const pageIndex = box.page - 1;
                if (pageIndex < 0 || pageIndex >= pages.length) continue;

                const page = pages[pageIndex];
                const { x, y, width, height } = box; // These are your canvas coordinates

                // Get the actual dimensions of the PDF page for Y-axis conversion
                const { height: pageHeight } = page.getSize();

                // Convert canvas Y (top-left origin) to PDF Y (bottom-left origin)
                // This `pdfY_bottom` is the Y-coordinate of the *bottom edge* of your stamp box.
                const pdfY_bottom = pageHeight - y - height;

                // --- OPTIONAL: Debug Rectangle (Keep this for now!) ---
                // page.drawRectangle({
                //     x: x,
                //     y: pdfY_bottom, // The Y for drawRectangle is its bottom-left corner
                //     width: width,
                //     height: height,
                //     borderColor: rgb(1, 0, 0), // Red border
                //     borderWidth: 1,
                // });
                // --- END Debug Rectangle ---

                const hexToRgb = (hex) => {
                    const bigint = parseInt(hex.replace('#', ''), 16);
                    return rgb(
                        ((bigint >> 16) & 255) / 255,
                        ((bigint >> 8) & 255) / 255,
                        (bigint & 255) / 255
                    );
                };

                let currentLineHeightSum = 0; // Tracks the total height of lines drawn so far
                const lineSpacing = 2; // Spacing between lines (adjust as needed)

                // Calculate total height of all text lines including spacing
                let totalContentHeight = 0;
                textChar.forEach((line, index) => {
                    totalContentHeight += line.fontSize;
                    if (index < textChar.length - 1) { // Add spacing only between lines
                        totalContentHeight += lineSpacing;
                    }
                });

                // Calculate the starting Y position for the first line
                // This will be the Y-coordinate of the baseline of the first text line.
                // We want to start from the top of the box (pdfY_bottom + height)
                // then move down by (height - totalContentHeight) / 2 to vertically center the block.
                // Then, move down by the first line's font size to get its baseline.
                let currentYPositionForText = pdfY_bottom + height - (height - totalContentHeight) / 2;


                textChar.forEach((line, index) => {
                    const font = line.fontWeight === 'bold' ? helveticaBold : helvetica;
                    const textWidth = font.widthOfTextAtSize(line.title, line.fontSize);

                    // X position: Center horizontally within the box
                    const xPos = x + (width - textWidth) / 2;

                    // Y position: For PDF-lib, Y is the baseline of the text.
                    // We need to subtract the font size to get the top of the text,
                    // then adjust from there.
                    // Instead, let's keep track of current Y for the *baseline* of the next line.

                    // Adjust currentYPositionForText to the baseline of the *current* line.
                    // For the first line, this is calculated above. For subsequent lines, it's
                    // the previous line's baseline minus its height and spacing.
                    if (index > 0) {
                        currentYPositionForText -= (textChar[index - 1].fontSize + lineSpacing);
                    }

                    page.drawText(line.title, {
                        x: xPos,
                        y: currentYPositionForText - line.fontSize,
                        size: line.fontSize,
                        font: font,
                        color: hexToRgb(stampColor.value),
                        letterSpacing: -0.7,
                    });

                });
            }
        }

        const pdfBytes = await pdfDoc.save();
        const print = await window.LocalCivilApi.printPDFBase64(pdfBytes);
        console.log('Print result:', print);

    } catch (error) {
        console.error('Error printing:', error);
    }
};

const nextPage = async () => {
    if (currentPageNum.value < totalPages.value) {
        currentPageNum.value++
        await renderPdf()
    }
}

const prevPage = async () => {
    if (currentPageNum.value > 1) {
        currentPageNum.value--
        await renderPdf()
    }
}

const rotationAngle = ref(0);

const rotate = async () => {
    rotationAngle.value = (rotationAngle.value + 90) % 360;
    await renderPdf();
};


const renderPdf = async () => {
    if (!pdfDoc || currentPageNum.value < 1 || currentPageNum.value > totalPages.value) return

    const page = await pdfDoc.getPage(currentPageNum.value)
    currentPage = page

    const viewport = page.getViewport({
        scale: scale.value,
        rotation: rotationAngle.value
    });

    // const viewport = page.getViewport({ scale: scale.value })
    const canvas = pdfCanvas.value
    const context = canvas.getContext('2d')

    canvas.width = viewport.width
    canvas.height = viewport.height

    const renderContext = {
        canvasContext: context,
        viewport: viewport
    }

    await page.render(renderContext).promise
    updateCanvasOffset()
}


const loadPdf = async () => {
    try {
        const path = await window.ScannedApi.OpenInSideBar(props.fileInfo.filepath)
        pdfbase64.value = path.fileUrl
    } catch (error) {
        console.error(error)
        return
    }

    const cleanBase64 = pdfbase64.value.replace(/^data:application\/pdf;base64,/, '')
    const rawData = atob(cleanBase64)
    const uint8Array = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; i++) {
        uint8Array[i] = rawData.charCodeAt(i)
    }

    pdfDoc = await pdfjsLib.getDocument({ data: uint8Array }).promise
    totalPages.value = pdfDoc.numPages
    await renderPdf()
}
const x_pos = ref(0)
const y_pos = ref(0)

const startDrag = (index, event) => {
    const box = boxes.value[index];
    const parent = pdfCanvas.value.parentElement;
    const parentRect = parent.getBoundingClientRect();
    const canvas = pdfCanvas.value;

    const startMouseX = event.clientX - parentRect.left;
    const startMouseY = event.clientY - parentRect.top;
    const startX = box.x;
    const startY = box.y;

    const onMouseMove = (e) => {
        if (!canvas) return;

        // Get current canvas dimensions
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        // Calculate maximum allowed positions
        const maxX = (canvasWidth / scale.value) - box.width;
        const maxY = (canvasHeight / scale.value) - box.height;

        // Calculate new position
        const currentMouseX = e.clientX - parentRect.left;
        const currentMouseY = e.clientY - parentRect.top;

        const deltaX = (currentMouseX - startMouseX) / scale.value;
        const deltaY = (currentMouseY - startMouseY) / scale.value;

        // Apply boundaries
        boxes.value[index].x = Math.max(0, Math.min(startX + deltaX, maxX));
        boxes.value[index].y = Math.max(0, Math.min(startY + deltaY, maxY));

        x_pos.value = boxes.value[index].x
        y_pos.value = boxes.value[index].y
    };


    const onMouseUp = () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
};


onMounted(() => {
    window.addEventListener('resize', updateCanvasOffset);
});

onUnmounted(() => {
    window.removeEventListener('resize', updateCanvasOffset);
});

watch(scale, async () => {
    await nextTick();
    await renderPdf();
    updateCanvasOffset();
});

const zoomIn = () => {
    if (scale.value >= 2.5) return
    scale.value = Math.min(scale.value + 0.1, 2.4)
}

const zoomOut = () => {
    if (scale.value <= 0.8) return
    scale.value = Math.max(scale.value - 0.1, 0.8)
}

const handleWheelZoom = (event) => {
    if (event.deltaY < 0) {
        zoomIn()
    } else {
        zoomOut()
    }
}

onMounted(() => {
    loadPdf()
})

onUnmounted(() => {
    pdfbase64.value = null
    pdfDoc = null
})

watch(scale, async () => {
    await nextTick()
    await renderPdf()
})










/**
 * For Filter Tab
 */


const isFilterOpen = ref(false)


const filters = ref({
    brightness: 100,  // percent
    contrast: 100,  // percent
    saturate: 100,  // percent
    grayscale: 0,    // percent
    sepia: 0,    // percent  ← new
    invert: 0     // percent  ← new
})

const filterControls = [
    { key: 'brightness', label: 'Brightness', min: 50, max: 200, step: 1, unit: '%' },
    { key: 'contrast', label: 'Contrast', min: 50, max: 200, step: 1, unit: '%' },
    { key: 'saturate', label: 'Saturation', min: 0, max: 200, step: 1, unit: '%' },
    { key: 'grayscale', label: 'Grayscale', min: 0, max: 100, step: 1, unit: '%' },
    { key: 'sepia', label: 'Sepia Tone', min: 0, max: 100, step: 1, unit: '%' },
    { key: 'invert', label: 'Invert (for negatives)', min: 0, max: 100, step: 1, unit: '%' },
]

// compute CSS `filter:` string for the wrapper div
const canvasFilter = computed(() => {
    const { brightness, contrast, saturate, grayscale, sepia, invert } = filters.value
    return [
        `brightness(${brightness}%)`,
        `contrast(${contrast}%)`,
        `saturate(${saturate}%)`,
        `grayscale(${grayscale}%)`,
        `sepia(${sepia}%)`,
        `invert(${invert}%)`
    ].join(' ')
})
// Preset definitions
const filterPresets = [
    { name: 'Normal', values: { brightness: 100, contrast: 100, saturate: 100, grayscale: 0, sepia: 0, invert: 0 } },
    { name: 'High Contrast', values: { brightness: 100, contrast: 150, saturate: 100, grayscale: 0, sepia: 0, invert: 0 } },
    { name: 'Black & White', values: { brightness: 100, contrast: 100, saturate: 0, grayscale: 100, sepia: 0, invert: 0 } },
    { name: 'Brighten', values: { brightness: 150, contrast: 100, saturate: 120, grayscale: 0, sepia: 0, invert: 0 } },
    { name: 'Text Enhanced', values: { brightness: 110, contrast: 150, saturate: 100, grayscale: 0, sepia: 0, invert: 0 } },
    { name: 'Ink Saver', values: { brightness: 95, contrast: 130, saturate: 80, grayscale: 20, sepia: 0, invert: 0 } },
    // new presets ↓
    { name: 'Warm Antique', values: { brightness: 105, contrast: 120, saturate: 120, grayscale: 0, sepia: 30, invert: 0 } },
    { name: 'Reverse Negative', values: { brightness: 100, contrast: 120, saturate: 100, grayscale: 0, sepia: 0, invert: 100 } },
    { name: 'Parchment', values: { brightness: 110, contrast: 110, saturate: 80, grayscale: 0, sepia: 50, invert: 0 } },
]

// which preset is currently selected
const selectedPreset = ref('Normal')

watch(selectedPreset, (newName) => {
    const preset = filterPresets.find(p => p.name === newName)
    if (preset) {
        Object.assign(filters.value, preset.values)
    }
})

</script>

<style scoped>
canvas {
    transition: all 0.2s ease;
}

.mb-0\.5em {
    margin-bottom: 0.5em;
}

.leading-tight {
    line-height: 1.2;
}

.select-none {
    user-select: none;
    -webkit-user-select: none;
}
</style>

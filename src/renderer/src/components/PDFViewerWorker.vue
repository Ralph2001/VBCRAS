<template>
    <div class="h-full w-full flex flex-col items-center relative bg-[#1B263B] overflow-y-scroll py-20  ">
        <!-- <div class="controls py-4 fixed  w-full items-center justify-center bg-gray-300">
            <button @click="zoomIn" :disabled="isLoading"
                class="bg-white text-gray-700 rounded border border-gray-300 px-2 text-xs font-medium hover:bg-gray-400 active:scale-95">Zoom
                In</button>
            <button @click="zoomOut" :disabled="isLoading"
                class="bg-white text-gray-700 rounded border border-gray-300 px-2 text-xs font-medium hover:bg-gray-400 active:scale-95">Zoom
                Out</button>
            <p class="shadow-inner px-2 border border-gray-300 rounded bg-gray-300"> {{ percent }}</p>
        </div> -->
        <div v-if="isLoading" class="z-50 h-full items-center justify-center  w-full flex">Loading...</div>

        <div v-else class="h-fit ">
            <div v-for="(page, index) in pages" :key="index" class="mb-4">
                <canvas :ref="el => pdfCanvas[index] = el" class="h-auto w-auto shadow-2xl"></canvas>
            </div>
        </div>
    </div>
</template>
<style scoped>
canvas {
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}
</style>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount, computed } from 'vue';
import * as pdfjsLib from 'pdfjs-dist/webpack';
import Cookies from 'js-cookie'; // Import js-cookie library
const isLoading = ref(false);

const scale = ref(1.5); // Initial scale
// Scaling factor
const minScale = 0.5;
const maxScale = 2.5;
const scalingStep = 0.5;

const percent = computed(() => {
    const calculation = (scale.value / maxScale) * 100
    return `${calculation.toFixed(2)}%`
})

onBeforeUnmount(() => {
    clearTimeout(renderTimeout);
    window.removeEventListener('wheel', handleWheel);
});

// Props
const props = defineProps({
    pdfBytes64: {
        required: true
    }
});

// Canvas reference and scale factor
const pdfCanvas = ref([]);
const pages = ref([]);

let wheelTimeout;

// Function to handle scaling and save to cookie
const handleWheel = (event) => {
    if (event.ctrlKey) {
        clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => {
            event.preventDefault();
            if (event.deltaY < 0) {
                // Zoom in
                if (scale.value < maxScale) {
                    scale.value = Math.min(maxScale, scale.value + scalingStep);
                    renderPDF();
                }
            } else {
                // Zoom out
                if (scale.value > minScale) {
                    scale.value = Math.max(minScale, scale.value - scalingStep);
                    renderPDF();
                }
            }
            // Save the current scale to a cookie
            Cookies.set('scale-marriage', scale.value, { expires: 7 }); // Cookie expires in 7 days
        }, 100);
    }
};

// Watch the prop in case the PDF data changes
watch(() => props.pdfBytes64, () => renderPDF());

let renderTimeout;
// Function to render the PDF from base64 data at a specific scale
const renderPDF = async () => {
    if (!props.pdfBytes64) return;

    isLoading.value = true
    try {
        clearTimeout(renderTimeout);
        renderTimeout = setTimeout(async () => {
            const base64String = props.pdfBytes64.startsWith("data:application/pdf;base64,")
                ? props.pdfBytes64.split(',')[1]
                : props.pdfBytes64;

            const pdfData = atob(base64String);
            const pdfBytes = new Uint8Array(pdfData.length);
            for (let i = 0; i < pdfData.length; i++) {
                pdfBytes[i] = pdfData.charCodeAt(i);
            }

            const pdfDoc = await pdfjsLib.getDocument({ data: pdfBytes }).promise;
            const numPages = pdfDoc.numPages;
            pages.value = Array.from({ length: numPages }, (_, i) => i + 1);

            for (let i = 0; i < numPages; i++) {
                const page = await pdfDoc.getPage(i + 1);
                const canvas = pdfCanvas.value[i];
                const context = canvas.getContext('2d');
                context.clearRect(0, 0, canvas.width, canvas.height);

                const viewport = page.getViewport({ scale: scale.value });

                // Reset transformation matrix and adjust for possible rotations
                context.setTransform(1, 0, 0, 1, 0, 0);

                if (viewport.rotation) {
                    context.rotate((viewport.rotation * Math.PI) / 180);
                }

                canvas.width = viewport.width;
                canvas.height = viewport.height;

                await page.render({
                    canvasContext: context,
                    viewport: viewport
                }).promise;
            }
        }, 200);

    }
    catch (error) {
        console.error('Error rendering PDF:', error);
    }
    finally {
        isLoading.value = false;
    }
};

// Zoom in function - Increase scale and re-render
const zoomIn = () => {
    if (scale.value < maxScale) {
        scale.value = Math.min(maxScale, scale.value + scalingStep);
        renderPDF();
    }
};

// Zoom out function - Decrease scale and re-render
const zoomOut = () => {
    if (scale.value > 0.5) {
        scale.value -= 0.5;
        renderPDF();
    }
};

// Call renderPDF on mount
onMounted(() => {
    renderPDF();
    window.addEventListener('wheel', handleWheel, { passive: false });
});
</script>

<style scoped>
canvas {
    max-width: 100%;
}

.controls {
    display: flex;
    gap: 10px;
}
</style>
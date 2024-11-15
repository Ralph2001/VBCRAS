<template>
    <div class="h-full w-full flex flex-col items-center">
        <div class="controls py-4 ">
            <button @click="zoomIn"
                class="bg-white text-gray-700 rounded border border-gray-300 px-2 text-xs font-medium">Zoom In</button>
            <button @click="zoomOut"
                class="bg-white text-gray-700 rounded border border-gray-300 px-2 text-xs font-medium">Zoom Out</button>
            <p class="shadow-inner px-2 border border-gray-300 rounded"> {{ percent }}</p>
        </div>

        <div class="h-auto overflow-y-scroll">

            <canvas ref="pdfCanvas" class="h-auto w-auto"></canvas>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount, computed } from 'vue';
import * as pdfjsLib from 'pdfjs-dist/webpack';
import Cookies from 'js-cookie'; // Import js-cookie library

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
    window.removeEventListener('wheel', handleWheel);
});

// Props
const props = defineProps({
    pdfBytes64: {
        required: true
    }
});

// Canvas reference and scale factor
const pdfCanvas = ref(null);


// Function to handle scaling and save to cookie
const handleWheel = (event) => {
    if (event.ctrlKey) {
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
    }
};



// Watch the prop in case the PDF data changes
watch(() => props.pdfBytes64, () => renderPDF());

// Function to render the PDF from base64 data at a specific scale
const renderPDF = async () => {
    if (!props.pdfBytes64) return;

    try {
        const base64String = props.pdfBytes64.startsWith("data:application/pdf;base64,")
            ? props.pdfBytes64.split(',')[1]
            : props.pdfBytes64;

        const pdfData = atob(base64String);
        const pdfBytes = new Uint8Array(pdfData.length);
        for (let i = 0; i < pdfData.length; i++) {
            pdfBytes[i] = pdfData.charCodeAt(i);
        }

        const pdfDoc = await pdfjsLib.getDocument({ data: pdfBytes }).promise;
        const page = await pdfDoc.getPage(1);
        const canvas = pdfCanvas.value;
        const context = canvas.getContext('2d');
        const viewport = page.getViewport({ scale: scale.value });

        // Reset transformation matrix and adjust for possible rotations
        context.setTransform(1, 0, 0, 1, 0, 0);

        if (viewport.rotation) {
            // Apply rotation if needed
            context.rotate((viewport.rotation * Math.PI) / 180);
        }

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
            canvasContext: context,
            viewport: viewport
        }).promise;
    } catch (error) {
        console.error('Error rendering PDF:', error);
    }
};


// Zoom in function - Increase scale and re-render
const zoomIn = () => {
    scale.value += 0.5;
    renderPDF();
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
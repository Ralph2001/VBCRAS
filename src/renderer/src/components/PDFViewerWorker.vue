<template>
    <div
        tabindex="-1"
        class="h-full w-full ring-0 outline-none focus:outline-none focus:ring-0 no-scrollbar flex flex-col items-center relative bg-[#282828] overflow-y-auto py-20"
    >
        <!-- Loading State -->
        <div
            v-if="isLoading"
            class="z-50 h-full items-center justify-center w-full flex"
        >
            Loading...
        </div>

        <!-- Error State -->
        <div v-if="errorMessage" class="text-white p-5 my-auto text-center">
            {{ errorMessage }}
        </div>

        <div v-else class="h-fit">
            <div v-for="(page, index) in pages" :key="index" class="mb-4">
                <canvas
                    :ref="(el) => (pdfCanvas[index] = el)"
                    class="h-auto w-auto shadow-2xl transition-transform duration-200 ease-in-out"
                    :style="{ transform: `scale(${scale.value})` }"
                ></canvas>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount, computed } from 'vue'
import * as pdfjsLib from 'pdfjs-dist/webpack'
import Cookies from 'js-cookie'
import { useDebounceFn, useEventListener } from '@vueuse/core'

const errorMessage = ref(null) // Track error messages
const isLoading = ref(false)

// Props
const props = defineProps({
    pdfBytes64: {
        required: true,
        default: null
    },
    scale: {
        type: Number,
        default: 1.5
    }
})

const scale = ref(props.scale) // Initial scale
const minScale = 0.5
const maxScale = 2.5
const scalingStep = 0.5

const percent = computed(() => {
    const calculation = (scale.value / maxScale) * 100
    return `${calculation.toFixed(2)}%`
})
const emit = defineEmits(['update:pdfBytes64'])
onBeforeUnmount(() => {
    emit('update:pdfBytes64', null)
    clearTimeout(renderTimeout)
    window.removeEventListener('wheel', handleWheel)
})

// Canvas reference and pages
const pdfCanvas = ref([])
const pages = ref([])

let wheelTimeout

// Function to handle scaling and save to cookie
const handleWheel = (event) => {
    if (event.ctrlKey) {
        clearTimeout(wheelTimeout)
        wheelTimeout = setTimeout(() => {
            event.preventDefault()
            if (event.deltaY < 0) {
                // Zoom in
                if (scale.value < maxScale) {
                    scale.value = Math.min(maxScale, scale.value + scalingStep)
                    renderPDF()
                }
            } else {
                // Zoom out
                if (scale.value > minScale) {
                    scale.value = Math.max(minScale, scale.value - scalingStep)
                    renderPDF()
                }
            }
            // Save the current scale to a cookie
            Cookies.set('scale-marriage', scale.value, { expires: 7 })
        }, 100)
    }
}

const debouncedFn = useDebounceFn(
    () => {
        renderPDF()
    },
    500,
    { maxWait: 5000 }
)

watch(
    () => props.pdfBytes64,
    () => debouncedFn()
)

let renderTimeout
// Function to render the PDF from base64 data at a specific scale
const renderPDF = async () => {
    if (!props.pdfBytes64) {
        return
    }

    isLoading.value = true
    errorMessage.value = null
    try {
        clearTimeout(renderTimeout)
        renderTimeout = setTimeout(async () => {
            const base64String = props.pdfBytes64.startsWith(
                'data:application/pdf;base64,'
            )
                ? props.pdfBytes64.split(',')[1]
                : props.pdfBytes64

            const pdfData = atob(base64String)
            const pdfBytes = new Uint8Array(pdfData.length)
            for (let i = 0; i < pdfData.length; i++) {
                pdfBytes[i] = pdfData.charCodeAt(i)
            }

            const pdfDoc = await pdfjsLib.getDocument({ data: pdfBytes })
                .promise
            const numPages = pdfDoc.numPages
            pages.value = Array.from({ length: numPages }, (_, i) => i + 1)

            for (let i = 0; i < numPages; i++) {
                const page = await pdfDoc.getPage(i + 1)
                const canvas = pdfCanvas.value[i]
                const context = canvas.getContext('2d')
                context.clearRect(0, 0, canvas.width, canvas.height)

                const viewport = page.getViewport({ scale: scale.value })

                // Reset transformation matrix and adjust for possible rotations
                context.setTransform(1, 0, 0, 1, 0, 0)

                if (viewport.rotation) {
                    context.rotate((viewport.rotation * Math.PI) / 180)
                }

                canvas.width = viewport.width
                canvas.height = viewport.height

                await page.render({
                    canvasContext: context,
                    viewport: viewport
                }).promise
            }
        }, 200)
    } catch (error) {
        console.error('Error rendering PDF:', error)
        errorMessage.value =
            'The PDF could not be loaded. Please check the file and try again.'
        pages.value = []
    } finally {
        isLoading.value = false
        errorMessage.value = null
    }
}

// Call renderPDF on mount
onMounted(() => {
    renderPDF()
    window.addEventListener('wheel', handleWheel, { passive: false })
})
</script>

<style scoped>
canvas {
    max-width: 100%;
    transition: transform 0.2s ease-in-out;
}

.controls {
    display: flex;
    gap: 10px;
}
</style>

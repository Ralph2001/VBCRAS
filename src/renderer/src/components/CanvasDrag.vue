<template>
    <div class="fixed inset-0 flex  max-w-screen-2xl bg-white z-50">
        <div class="w-full mx-auto h-full overflow-y-auto py-20 border border-red-500">
            <div class="canvas mx-auto border border-gray-400 shadow-sm rounded-sm" ref="canvas">
                <div v-for="(item, index) in items" :key="index" class="draggable font-serif" :style="{
                    top: item.y + 'px',
                    left: item.x + 'px'
                }" @mousedown="startDrag($event, index)">
                    {{ item.label }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const items = ref([
    { x: 100, y: 100, label: 'Republic of the Philippines' },
    { x: 200, y: 200, label: 'Province of Pangasinan' },
    { x: 300, y: 300, label: 'MUNICIPALITY OF BAYAMBANG' },
])

const draggingIndex = ref(null)
const offset = ref({ x: 0, y: 0, width: 0, height: 0 })
const canvas = ref(null)

const startDrag = (e, index) => {
    draggingIndex.value = index
    const rect = e.target.getBoundingClientRect()
    offset.value = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        width: rect.width,
        height: rect.height
    }
    window.addEventListener('mousemove', drag)
    window.addEventListener('mouseup', stopDrag)
}

const drag = (e) => {
    if (draggingIndex.value === null) return

    const canvasRect = canvas.value.getBoundingClientRect()
    const item = items.value[draggingIndex.value]

    let newX = e.clientX - canvasRect.left - offset.value.x
    let newY = e.clientY - canvasRect.top - offset.value.y

    // Boundary constraints
    newX = Math.max(0, Math.min(canvasRect.width - offset.value.width, newX))
    newY = Math.max(0, Math.min(canvasRect.height - offset.value.height, newY))

    item.x = newX
    item.y = newY
}

const stopDrag = () => {
    draggingIndex.value = null
    window.removeEventListener('mousemove', drag)
    window.removeEventListener('mouseup', stopDrag)
}
</script>

<style scoped>
.canvas {
    box-sizing: border-box;
    width: 8.5in;
    height: 13in;

    position: relative;
    background: white;
    overflow: hidden;

}

.draggable {
    position: absolute;
    padding: 5px 10px;
    cursor: move;
    user-select: none;
    white-space: nowrap;
}
</style>
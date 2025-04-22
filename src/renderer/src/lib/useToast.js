// composables/useToast.js
import { ref, reactive, readonly } from 'vue'

const toasts = ref([])

let id = 0

function fire({ title, icon = 'info', duration = 3000 }) {
    const toast = reactive({
        id: id++,
        title,
        icon,
        duration,
    })
    toasts.value.push(toast)

    // Auto-remove after duration
    setTimeout(() => {
        const idx = toasts.value.findIndex(t => t.id === toast.id)
        if (idx !== -1) toasts.value.splice(idx, 1)
    }, duration + 100) // small buffer for animation
}

export function useToast() {
    return {
        fire,
        toasts: readonly(toasts)
    }
}


<template>
    <transition 
        enter-active-class="transition ease-out duration-300" 
        enter-from-class="opacity-0 translate-y-2 scale-95"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transition ease-in duration-250"
        leave-from-class="opacity-100 translate-y-0 scale-100"
        leave-to-class="opacity-0 translate-y-2 scale-95"
    >
        <div v-if="visible"
            class="fixed top-5 right-5 z-50 flex items-center p-4 max-w-sm w-auto rounded-lg shadow-2xl text-white bg-gray-800 transform"
            :class="toastType" @mouseenter="pauseTimer" @mouseleave="resumeTimer">
            <div class="mr-3">
                <span v-if="icon === 'success'">✅</span>
                <span v-else-if="icon === 'error'"><font-awesome-icon icon="fa-solid fa-circle-exclamation" /></span>
                <span v-else-if="icon === 'info'">ℹ️</span>
                <span v-else>🔔</span>
            </div>
            <div class="flex-1 text-sm">{{ title }}</div>
            <button @click="closeToast" class="ml-2 w-8 h-8 hover:bg-white/10 rounded-full">
                <font-awesome-icon :icon="['fas', 'xmark']" />
            </button>
        </div>
    </transition>
</template>



<script setup>
import { onMounted, ref, watch, onBeforeUnmount, computed } from 'vue'
const props = defineProps({
    title: String,
    icon: {
        type: String,
        default: 'info',
    },
    duration: {
        type: Number,
        default: 3000,
    }
})

const visible = ref(true)
const timer = ref(null)
const remaining = ref(props.duration)
const startTime = ref(Date.now())

const toastType = computed(() => {
    return {
        'bg-green-500': props.icon === 'success',
        'bg-red-500': props.icon === 'error',
        'bg-blue-500': props.icon === 'info',
        'bg-gray-700': !['success', 'error', 'info'].includes(props.icon),
    }
})

function startTimer() {
    startTime.value = Date.now()
    timer.value = setTimeout(() => {
        visible.value = false
    }, remaining.value)
}

function pauseTimer() {
    clearTimeout(timer.value)
    remaining.value -= Date.now() - startTime.value
}

function resumeTimer() {
    startTimer()
}

function closeToast() {
    visible.value = false
}
onMounted(() => {
    startTimer()
})

onBeforeUnmount(() => {
    clearTimeout(timer.value)
})
</script>
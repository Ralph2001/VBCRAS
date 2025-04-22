<template>
    <div class="fixed  z-[99999] top-5 right-5 space-y-2 ">
        <Toast v-for="t in toasts" :key="t.id" :title="t.title" :icon="t.icon" :duration="t.duration" />
    </div>
</template>

<script setup>

import { useToast } from '../lib/useToast';
import Toast from './Toast.vue'

const { toasts } = useToast()
</script>
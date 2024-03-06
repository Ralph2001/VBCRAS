<template>
    <div>
        <button type="button" :value="value"
            class="text-sm font-semibold uppercase antialiased text-gray-800 button-10 w-[6rem] h-[5rem] border border-gray-300 rounded-lg bg-gray-100  hover:shadow-md transition-all"
            @click="pressed">
            {{ title }} 
        </button>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    }
})

const emit = defineEmits(['pressed'])
const pressed = (e) => {
    emit('pressed', e.target.value)
}
</script>

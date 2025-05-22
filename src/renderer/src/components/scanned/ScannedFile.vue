<template>
    <div :class="`h-[${props.size}px]`" class="flex flex-col">
        <div @click="openOption()" :class="[
            'flex items-center justify-between px-4 py-1.5 rounded-md cursor-pointer transition-colors',
            isOptionOpen ? 'bg-blue-500 text-white' : 'hover:bg-blue-100 text-gray-800'
        ]">
            <div class="flex items-center gap-2 truncate w-3/5">
                <font-awesome-icon icon="fa-solid fa-file-pdf" class="text-red-500" />
                <span class="truncate font-medium">
                    {{ file_info.name ? file_info.name.replace(".pdf", "") : 'Unnamed' }}
                </span>
            </div>
            <p class="text-xs italic">
                {{ file_info.type }} {{ file_info.month }} {{ file_info.year }}
            </p>
        </div>

        <div v-if="isOptionOpen" ref="itemDiv"
            class="flex justify-end bg-gray-50 border border-gray-200 rounded-md transition-all duration-300">
            <div class="flex gap-2 px-4 py-3">
                <button @click="emits('open-details', file_info)"
                    class="px-3 py-1.5 text-sm font-medium text-white bg-gray-700 rounded-md hover:bg-gray-600 transition">
                    View File
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onClickOutside } from '@vueuse/core/index.cjs';
import { nextTick, ref } from 'vue';

const itemDiv = ref(null)

const emits = defineEmits(['open-details'])
onClickOutside(itemDiv, event =>
    isOptionOpen.value = false
)
const isOptionOpen = ref(false)

const openOption = () => {
    isOptionOpen.value = !isOptionOpen.value

}

const props = defineProps({
    file_info: {
        type: [Array, Object]
    },
    size: {
        type: Number
    }
})
</script>
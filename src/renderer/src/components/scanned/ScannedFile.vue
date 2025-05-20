<template>
    <div :class="`h-[${props.size}px]`" class="flex flex-col  ">
        <div :class="isOptionOpen ? 'bg-blue-400' : 'hover:bg-blue-200'" @click="openOption()"
            class="text-md h-full relative flex-row justify-between font-semibold antialiased flex items-center  gap-1 hover:cursor-pointer rounded-sm  group">
            <div class="block w-[60%] overflow-hidden truncate">
                <font-awesome-icon icon="fa-solid fa-file-pdf" class="text-red-500 me-2 ms-3" />
                {{ file_info.name ? file_info.name.replace(".pdf", "") : 'Unnamed' }}
            </div>
            <p :class="isOptionOpen ? 'text-white' : 'text-gray-600 '" class="text-xs italic  mr-2  ">
                {{ file_info.type }} {{ file_info.month }} {{ file_info.year }}
            </p>
        </div>
        <div ref="itemDiv" v-if="isOptionOpen"
            class="flex items-center justify-end bg-gray-50 border rounded-md transition-all duration-300 h-full">
            <div class="flex gap-2 px-4 py-3">
                <button @click="emits('open-details', file_info)"
                    class="px-3 py-1.5 text-sm font-medium text-white bg-gray-700 rounded hover:bg-gray-600 transition-colors">
                    View
                </button>

                <button
                    class="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-500 transition-colors">
                    Create Form
                </button>

                <button
                    class="px-3 py-1.5 text-sm font-medium text-white bg-rose-600 rounded hover:bg-rose-500 transition-colors">
                    Remove
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
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
            class="flex transition-all border py-0.5 h-full duration-300  items-center justify-end bg-blue-100">
            <div class="flex flex-row gap-1 px-4 py-2.5 ">
                <button @click="emits('open-details')"
                    class=" rounded-sm bg-green-600 hover:bg-green-600/90 transition-all duration-200 text-white  flex text-start px-2 py-1  font-medium text-sm ">View
                </button>

                <button
                    class=" rounded-sm bg-blue-600 hover:bg-blue-600/90 transition-all duration-200 text-white  flex text-start px-2 py-1  font-medium text-sm ">
                    Create Form</button>
                <button
                    class=" rounded-sm bg-red-600 hover:bg-red-600/90 transition-all duration-200 text-white  flex text-start px-2 py-1  font-medium text-sm ">Remove
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onClickOutside } from '@vueuse/core/index.cjs';
import { nextTick, ref } from 'vue';

const itemDiv = ref(null)
const emits = defineEmits('open-details')
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
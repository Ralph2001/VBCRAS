<template>
    <div class="w-full flex flex-col items-center justify-center h-full relative">
        <button type="button" @click="dropdown = !dropdown" ref="mainBtn"
            :class="{ 'bg-gray-600 text-white hover:bg-gray-700': dropdown, 'text-gray-900 bg-white hover:bg-gray-100': !dropdown }"
            class="px-3 py-1 text-sm tracking-wide hover:border-gray-400 active:scale-95  font-medium text-center  rounded-sm  border transition-all focus:outline-none">
            Manage
        </button>

        <div class="h-auto flex flex-col items-start justify-center bg-white z-50 p-2 absolute top-[95%] right-0 border shadow-md w-auto"
            v-if="dropdown">
            <button type="button" class=" flex items-start text-md font-medium hover:bg-gray-100 px-5 w-[8rem]">Open
                Folder</button>
            <button type="button"
                class=" flex items-start text-md font-medium hover:bg-gray-100 px-5 w-[8rem]">Details</button>
            <button type="button"
                class=" flex items-start text-md font-medium hover:bg-gray-100 px-5 w-[8rem]">ReGenerate</button>
            <button type="button"
                class=" flex items-start text-md font-medium hover:bg-red-400 hover:text-white px-5 w-[8rem]">Remove</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { onClickOutside } from "@vueuse/core";

const mainBtn = ref(null)
onClickOutside(mainBtn, (event) => (dropdown.value = false));
const dropdown = ref(false)
</script>

<style lang="scss" scoped></style>

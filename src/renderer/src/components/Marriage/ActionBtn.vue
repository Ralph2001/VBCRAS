<template>
    <div class="w-full flex flex-col items-center justify-center h-full relative ">
        <button type="button" ref="mainBtn" @click="dropdown = !dropdown"
            :class="{ 'bg-gray-600 text-white hover:bg-gray-700': dropdown, 'text-gray-900 bg-white hover:bg-gray-100': !dropdown }"
            class="px-3 py-1 text-sm tracking-wide hover:border-gray-400 active:scale-95  font-medium text-center  rounded-sm  border transition-all focus:outline-none">
            Manage
        </button>


        <div class="h-auto flex flex-col items-start justify-center bg-white z-50  absolute top-[95%] right-0 border shadow-md w-[10rem]"
            v-if="dropdown">
            <button type="button"
                class=" disabled:bg-gray-100 disabled:hover:cursor-not-allowed flex items-start text-md font-medium hover:bg-gray-100 px-5 w-full">View
            </button>
            <button type="button"
                class=" disabled:bg-gray-100 disabled:hover:cursor-not-allowed flex items-start text-md font-medium hover:bg-gray-100 px-5 w-full">Edit</button>

            <button type="button"
                class=" disabled:bg-gray-100 disabled:hover:cursor-not-allowed flex items-start text-md font-medium hover:bg-gray-100 px-5 w-full">Print
            </button>
            <button type="button"
                class=" disabled:bg-gray-100 disabled:hover:cursor-not-allowed flex items-start text-md font-medium hover:bg-gray-100 px-5 w-full">Delete
            </button>
        </div>
    </div>
</template>
<script setup>
import { onClickOutside } from '@vueuse/core';
import { ref } from 'vue';

const mainBtn = ref(null)
onClickOutside(mainBtn, (event) => (dropdown.value = false));
const dropdown = ref(false)


</script>
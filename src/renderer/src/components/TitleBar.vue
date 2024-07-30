<template>
    <div id="titlebar" tabindex="-1"
        class="fixed z-[999999999999999999999999999999] ring-0  top-0 bg-gray-800  h-6 shadow-none outline-none  w-full  flex white items-center flex-row ">
        <!-- <p class="text-xs text-gray-50">Created by Ralph</p> -->
        <div class="h-full px-4 items-center flex flex-row gap-2">
            <p class="text-xs text-yellow-100 ">Development Mode</p>
            <!-- <p class="text-xs text-gray-500 ">{{ time }}</p> -->
        </div>
        <div class="grid grid-cols-3 w-[5rem]  h-full ml-auto  text-xs items-center text-gray-50 ">
            <div class="titlebar-button  h-full  flex items-center justify-center">
                <button class="flex  hover:text-gray-800 hover:bg-white h-full items-center justify-center  w-full">
                    <font-awesome-icon icon="fa-solid fa-window-minimize " class="pb-[0.5rem]" />
                </button>
            </div>
            <div class="titlebar-button   flex h-full items-center justify-center">
                <button class="flex  hover:text-gray-800 hover:bg-white h-full items-center justify-center  w-full">
                    <font-awesome-icon icon="fa-regular fa-window-maximize" />
                </button>
            </div>
            <div class="titlebar-button h-full flex items-center justify-center ">
                <button title="Close App"
                    class="flex  hover:text-gray-800 hover:bg-red-300 h-full   items-center justify-center w-full">
                    <font-awesome-icon icon="fa-solid fa-xmark" />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

// const time = ref()
// const timer = ref()

// function getCurrentTime() {
//     return new Date().toLocaleTimeString();
// }
// function updateClock() {
//     time.value = getCurrentTime();
// }

// onMounted(() => {
//     timer.value = setInterval(updateClock, 1000);
// })
// </script>

<style lang="scss" scoped>
#titlebar {
    -webkit-app-region: drag;
}

.titlebar-button {
    -webkit-app-region: no-drag;
    /* Ensures buttons are not draggable */
    cursor: pointer;
    transition: all;
    transition-duration: 300ms;
}
</style>
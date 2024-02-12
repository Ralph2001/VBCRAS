<template>
    <div class="flex flex-row h-screen items-center w-full">
        <div class="flex flex-col bg-gray-200 h-full w-[50%] justify-center items-center gap-1 p-4">
            <p class="text-2xl text-gray-900 font-bold font-sans mt-auto">Start Local Server</p>
            <p class="text-sm text-gray-500 font-semibold font-sans">Document Automation | Record Management</p>
            <p class="text-xs mt-auto text-gray-400 font-bold font-mono">Created by Ralph A. Villanueva</p>

        </div>
        <div class="flex flex-col bg-gray-100 h-full w-full justify-center items-center gap-4">

            <p class="text-sm text-gray-900 italic mt-auto" v-if="!server.getStatus">The server is currently not running.
            </p>


            <p class="text-sm text-gray-900 italic mt-auto" v-if="server.getStatus">The server is running.</p>
            <button type="button"
                :class="{ 'bg-red-500 text-white focus:ring-red-300 hover:bg-red-700 border-red-100': server.getStatus }"
                @click="activate"
                class="text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm px-6 py-7 text-center inline-flex items-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500">
                {{ server.getStatus ? 'Stop' : 'Start' }}
            </button>
            <div class="flex flex-row gap-2 mt-auto items-center justify-center w-full p-4 ">
                <button @click="resetMode()" type="button"
                    class="flex items-center py-2 px-8 me-2 mb-2 mr-auto text-sm font-medium  text-gray-900 focus:outline-none bg-gray-50 rounded-sm border border-gray-200 hover:bg-gray-300 focus:z-10   dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                    <span class="me-2 pi pi-arrow-left"></span> Change
                    Mode</button>
                <button type="button" :class="{ 'bg-green-500 text-white font hover:bg-green-600': auto }"
                    @click="autoStart()"
                    class="py-2 px-8 me-2 mb-2 text-sm font-medium hover:shadow-lg text-gray-900 focus:outline-none bg-gray-50  rounded border border-gray-200 hover:bg-gray-300 focus:z-10   dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Auto
                    Start</button>
                <button type="button"
                    class="flex items-center py-2 px-8 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-gray-50 rounded-sm border border-gray-200 hover:bg-gray-300 focus:z-10   dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Dashboard
                </button>


            </div>
        </div>
    </div>
</template>
  
<script setup>
import { onMounted, ref } from 'vue';
import { ServerStore } from '../../stores/server'
import { ConnectionMode } from '../../stores/connection'

const auto = ref(true);

const server = ServerStore();
const mode = ConnectionMode();

onMounted(() => {
    server.getStatus;
    mode.checkMode()
})

const activate = async () => {
    server.activate()
};

const resetMode = () => {
    if (server.getStatus) {
        alert('You must turn off the server first')
        return
    }
    mode.resetMode()
}
const autoStart = () => {
    auto.value = !auto.value
}
</script>


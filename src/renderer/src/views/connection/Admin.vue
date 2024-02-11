<template>
    <div class="flex flex-row h-screen items-center w-screen">
        <div class="flex flex-col bg-gray-200 h-full w-[50%] justify-center items-center gap-1 p-4">
            <p class="text-2xl text-gray-900 font-bold font-sans mt-auto">Start Local Server</p>
            <p class="text-sm text-gray-500 font-semibold font-sans">Document Automation | Record Management</p>
            <p class="text-xs mt-auto text-gray-500 font-bold font-mono">Created by Ralph A. Villanueva</p>
        </div>
        <div class="flex flex-col bg-gray-100 h-full w-full justify-center items-center gap-4">
            <p class="text-sm text-gray-900 italic" v-if="!server.active">The server is currently not running.</p>
            <p class="text-sm text-gray-900 italic" v-if="server.active">The server is running.</p>
            <button type="button"
                :class="{ 'bg-red-700 text-white focus:ring-red-300 hover:bg-red-800 border-red-100': server.active }"
                @click="activate"
                class="text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm px-6 py-7 text-center inline-flex items-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500">
                {{ server.active ? 'Stop' : 'Start' }}
            </button>
        </div>
    </div>
</template>
  
<script setup>
import { onMounted, ref } from 'vue';
import { ServerStore } from '../../stores/server'

const active = ref(false);
const server = ServerStore();

onMounted(() => {
    server.getStatus();
})

const activate = async () => {
    server.activate()
};
</script>
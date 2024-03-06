<template>
    <div class="h-full ">
        <Sidebar header="Create Server" />
        <div
            class="flex flex-col h-full justify-center items-center p-4  md:ml-[50%] lg:ml-[30%] bg-gradient-to-r from-blue-50/20 relative ">
            <Transition enter-active-class="animate__animated animate__fadeInDown"
                leave-active-class="animate__animated animate__fadeOutUp">
                <Alert v-if="notoff" message="Turn off server first." error />
            </Transition>
            <p class="mt-auto text-sm text-gray-900 italic " v-if="!server.server">The
                server is currently not running.
            </p>
            <p class="mt-auto text-sm text-gray-900 italic " v-if="server.server">The
                server is running. <span class="text-md font-bold">({{ server.serverAddress }})</span></p>

            <button @click="switcher()" :class="{ 'bg-blue-400 ': !server.server, 'bg-red-400 ': server.server }"
                class="switcher mt-2 px-7 py-8 antialiased   text-white text-base font-semibold whitespace-nowrap border border-slate-200 rounded-full active:scale-90 transition-all">
                {{ server.server ? 'Stop' : 'Start' }}
            </button>
            <div class="mt-auto flex flex-row items-center w-full px-5 justify-between md:justify-normal">
                <HandleButton title="Change Mode" @click="changeMode()" />
                <div class="ml-none md:ml-auto flex flex-row ">
                    <!-- <HandleButton title="Auto Connect" @click="server.autoServerSwitch()" :isActive="server.auto" /> -->
                    <!-- <HandleButton title="Dashboard" v-if="server.server" :disabled="!server.server"
                        @click="goToDashboard()" /> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import HandleButton from '../components/mode/HandleButton.vue';
import Sidebar from '../components/mode/Sidebar.vue';
import { ref } from 'vue';
import { useModeStore } from '../stores/mode'
import { useServerStore } from '../stores/server'
import { onMounted } from 'vue';
import { useRouter } from "vue-router";
import Alert from '../components/Alert.vue'
const router = useRouter();

const notoff = ref(false)

const mode = useModeStore()
const server = useServerStore()

const status = ref(false);

onMounted(() => {
    server.isServerRunning()
})

const switcher = () => {
    server.serverSwitch()
}
const changeMode = () => {
    if (server.server) {
        notoff.value = true

        setTimeout(() => {
            notoff.value = false
        }, 3000);
        return
    }
    mode.removeMode()
}

</script>

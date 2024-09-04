<template>
    <div class="flex flex-col w-full min-h-screen  flex-grow justify-center p-4 items-center relative">
        <ConnectModal />
        <div class="absolute top-0 right-0 p-4">
            <button @click="more_option = !more_option">
                <font-awesome-icon icon="fa-solid fa-bars" class="text-gray-700" />
            </button>

        </div>
        <Transition mode="out-in">
            <div v-if="more_option"
                class="absolute flex flex-col gap-2 top-10 right-4 items-start justify-center border shadow-sm  rounded-sm bg-white">
                <button
                    class="text-sm text-gray-800 hover:bg-blue-500 hover:text-white px-4 tracking-wider py-2.5 flex items-start w-full font-semibold">Create
                    Own
                    Server</button>
                <!-- <button class="text-sm text-gray-800 hover:bg-blue-500 hover:text-white px-4 tracking-wider py-2.5 flex items-start w-full font-semibold">Exit</button> -->

            </div>
        </Transition>
        <Wave />
        <div class="flex flex-col items-center p-3 gap-5">
            <p class="text-2xl font-medium text-gray-800 mb-20 font-mono">Vital Bridge Civil Registry and Archive System
            </p>
            <!-- <ButtonMode title="Server" @click="serverMode()" /> -->
            <div>
                <ButtonMode title="Connect" @click="clientMode()" />
            </div>
        </div>
    </div>
</template>

<script setup>
import Wave from '../components/Wave.vue';
import ButtonMode from '../components/mode/ButtonMode.vue';
import { useModeStore } from '../stores/mode'
import { onMounted, ref } from 'vue';
import ConnectModal from './ConnectModal.vue';

const more_option = ref(false)

const mode = useModeStore()
onMounted(() => {
    // mode.checkMode()
})

const serverMode = () => {
    mode.changeMode('server')
}
const clientMode = () => {
    mode.changeMode('client')
}

</script>

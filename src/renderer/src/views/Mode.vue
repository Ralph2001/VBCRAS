<template>
    <div class="flex flex-col w-full bg-slate-100  min-h-screen  flex-grow justify-center p-4 items-center relative">
        <Wave />
        <p class="text-md uppercase text-gray-800 font-bold mb-10 font-mono antialiased tracking-wider">Connection Mode</p>
        <!-- <p class="text-md uppercase text-gray-800 font-bold mb-10 font-mono antialiased">{{ mode.getMode() }}</p> -->
        <div class="flex flex-row p-3 gap-5">
            <ButtonMode title="Server" @click="serverMode()" />
            <ButtonMode title="Client" @click="clientMode()" />
        </div>
    </div>
</template>

<script setup>
import Wave from '../components/Wave.vue';
import ButtonMode from '../components/mode/ButtonMode.vue';
import { useModeStore } from '../stores/mode'
import { onMounted } from 'vue';


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

<template>
    <div class="flex flex-col w-full bg-slate-100 h-screen justify-center p-4 items-center relative">


        <svg class="waves" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 24 150 28" preserveAspectRatio="none" shape-rendering="auto">
            <defs>
                <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
            </defs>
            <g class="parallax opacity-40">
                <use xlink:href="#gentle-wave" x="48" y="0" fill="#60a5fa" />
                <use xlink:href="#gentle-wave" x="48" y="3" fill="#60a5fa" />
                <use xlink:href="#gentle-wave" x="48" y="5" fill="#93c5fd" />
                <use xlink:href="#gentle-wave" x="48" y="7" fill="#bfdbfe" />
            </g>
        </svg>


        <p class="text-md uppercase text-gray-800 font-bold mb-10 font-mono antialiased">Connection Mode</p>
        <div class="">
            <div class="flex flex-row p-3 gap-5">
                <ButtonMode title="Server" value="Server" @pressed="choose" />
                <ButtonMode title="Client" value="Client" @pressed="choose" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ConnectionMode } from '../../stores/connection';
import ButtonMode from '../../components/connection/ButtonMode.vue';
const Connect = ConnectionMode();

const mode = ref('')

const choose = async (chose) => {
    mode.value = chose
    await Connect.changeMode(mode.value)
};

onMounted(() => {
    Connect.checkConnection()
    Connect.checkMode()
})
</script>
<style scoped>
.waves {
    position: absolute;
    width: 100%;
    height: 15vh;
    bottom: 0;
    left: 0;
}

.parallax>use {
    animation: move-forever 25s cubic-bezier(.55, .5, .45, .5) infinite;
}

.parallax>use:nth-child(1) {
    animation-delay: -2s;
    animation-duration: 7s;
}

.parallax>use:nth-child(2) {
    animation-delay: -3s;
    animation-duration: 10s;
}

.parallax>use:nth-child(3) {
    animation-delay: -4s;
    animation-duration: 13s;
}

.parallax>use:nth-child(4) {
    animation-delay: -5s;
    animation-duration: 20s;
}

@keyframes move-forever {
    0% {
        transform: translate3d(-90px, 0, 0);
    }

    100% {
        transform: translate3d(85px, 0, 0);
    }
}


/*Shrinking for mobile*/

@media (max-width: 768px) {
    .waves {
        height: 40px;
        min-height: 40px;
    }
}

/* Waves Animation end*/
</style>
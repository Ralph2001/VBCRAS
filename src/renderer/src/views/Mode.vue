<template>
    <div class="flex flex-col w-full min-h-screen  flex-grow justify-center p-4 items-center relative bg-gray-50">
        <ConnectModal @connect-to-ip="connect_host" @close-connect-modal="connect_modal = false" v-if="connect_modal">
            <template v-slot:body>
                <div class="w-full mb-5">
                    <ul class="list-disc list-inside">
                        <li class="text-sm font-mono text-gray-800">Please ensure you use the host address provided by
                            the admin.
                        </li>
                        <li class="text-sm font-mono text-gray-800">Ensure you're on the same network as the admin.</li>
                    </ul>
                </div>
                <div class="flex flex-col gap-2 w-full">
                    <label for="host" class="text-sm font-medium mb-2">Host Address <span
                            class="text-xs italic font-normal">Example: 192.168.1.1</span></label>
                    <input type="text" id="host" v-model="data.host"
                        :class="[v$.host.$error ? 'border border-red-500 focus:border-red-500' : ' border border-gray-300 focus:border-blue-500 ']"
                        class="w-full rounded font-medium border outline-none focus:ring-0 ring-0">
                    <p v-if="v$.host.$error" class="text-red-500 text-xs h-4">Invalid *</p>
                </div>
            </template>
        </ConnectModal>

        <div class="absolute top-0 right-0 p-4">
            <button @click="more_option = !more_option">
                <font-awesome-icon icon="fa-solid fa-bars" class="text-gray-700" />
            </button>

        </div>
        <Transition mode="out-in">
            <div v-if="more_option"
                class="absolute flex  flex-col gap-2 top-10 right-4 items-center justify-center border shadow-sm  rounded bg-white h-[10rem] w-[20rem]">
                <button class="rounded-full border w-20 h-20 text-xs font-mono bg-white
                    font-bold shadow-sm
                     border-gray-300 hover:bg-blue-500 hover:text-white active:scale-95 transition-all">Start</button>
                <p class="font-mono font-medium mt-3">Start your own local server.</p>
            </div>
        </Transition>
        <Wave />
        <div class="flex flex-col items-center p-3 gap-5">
            <p class="text-2xl font-medium text-gray-800 mb-20 font-mono">Vital Bridge Civil Registry and Archive System
            </p>
            <!-- <ButtonMode title="Server" @click="serverMode()" /> -->
            <div>
                <!-- <ButtonMode title="Connect" @click="clientMode()" /> -->
                <ButtonMode title="Connect" @click="connect_modal = true" />
            </div>
        </div>
    </div>
</template>

<script setup>
import Wave from '../components/Wave.vue';
import ButtonMode from '../components/mode/ButtonMode.vue';
import { useModeStore } from '../stores/mode'
import { computed, onMounted, reactive, ref } from 'vue';
import ConnectModal from './ConnectModal.vue';
import { useVuelidate } from "@vuelidate/core";
import { required, maxLength, ipAddress } from "@vuelidate/validators";

const more_option = ref(false)
const connect_modal = ref(false)

const data = reactive({
    host: ''
})


const rules = computed(() => {
    return {
        host: { required, ipAddress },
    };
});


const v$ = useVuelidate(rules, data);

const connect_host = () => {
    v$.value.$touch();
    if (v$.value.$error) {
        console.log(v$.value)
        return;
    }
}
// const mode = useModeStore()
// onMounted(() => {
//     mode.checkMode()
// })

// const serverMode = () => {
//     mode.changeMode('server')
// }
// const clientMode = () => {
//     mode.changeMode('client')
// }

</script>

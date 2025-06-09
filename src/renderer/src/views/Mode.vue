<template>
    <div class="flex flex-col w-full min-h-screen  flex-grow justify-center p-4 items-center relative bg-gray-100">
        <ConnectModal @close-connect-modal="unsetConnectMode" v-if="connect_modal">
            <template v-slot:body>
                <div class=" w-full mb-5">
                    <ul class="list-disc list-inside">
                        <li class="text-sm font-mono text-gray-800">Make sure to use the host address given by the
                            admin.</li>
                        <li class="text-sm font-mono text-gray-800">Ensure that you're connected to the same network as
                            the admin.</li>

                    </ul>
                </div>
                <div class="flex flex-col gap-2 w-full">
                    <label for="host" class="text-sm font-medium mb-2">Host Address <span
                            class="text-xs italic font-normal">Example: 192.168.1.1</span></label>
                    <input @input="connection_error = false" @keyup.enter="connect_host" :readonly="is_connecting"
                        type="text" id="host" v-model="data.host"
                        :class="[v$.host.$error ? 'border border-red-500 focus:border-red-500' : ' border border-gray-300 focus:border-blue-500 ']"
                        class="read-only:select-none  w-full rounded font-medium border outline-none focus:ring-0 ring-0">


                    <div class="h-5">
                        <p v-if="v$.host.$error && !connection_error" class="text-red-500 text-sm h-4">Invalid *</p>
                        <p v-if="connection_error" class="text-red-500 text-sm h-4">Connection Error, Please try again.
                        </p>
                    </div>
                </div>
            </template>

            <template v-slot:footer>
                <button :disabled="is_connecting"
                    class="disabled:bg-blue-400 disabled:active:scale-100 disabled:cursor-progress w-max shadow-sm px-2.5 py-1 rounded ml-auto active:scale-95 hover:bg-blue-600 font-medium bg-blue-500 text-white text-sm"
                    @click="connect_host">{{ connection_status }}</button>
            </template>
        </ConnectModal>

        <div class="absolute top-0 right-0 p-4">
            <button @click="more_option = !more_option" title="Connect">
                <font-awesome-icon icon="fa-solid fa-tower-cell" class="text-lg text-gray-700 hover:text-gray-600 " />
            </button>

        </div>
        <Transition mode="out-in">
            <div v-if="more_option" ref="start_server_ref"
                class="absolute flex  flex-col gap-2 top-10 right-4 items-center justify-center border shadow-md  rounded bg-white h-[10rem] w-[20rem]">
                <button @click="setSetupConnect"
                    class="rounded-full border w-20 h-20 text-xs font-mono bg-white
                    font-bold shadow-sm
                     border-[#1cbfff] hover:bg-blue-500 hover:text-white active:scale-95 transition-all">Connect</button>
                <p class="font-mono font-medium mt-3">Connect to local server.</p>
            </div>
        </Transition>
        <Wave />
        <div class="flex flex-col items-center p-3 gap-5">
            <p class="text-2xl font-medium text-gray-800 mb-20 font-mono">Vital Bridge Civil Registry and Archive System
            </p>
            <!-- <ButtonMode title="Server" @click="serverMode()" /> -->
            <div>
                <!-- <ButtonMode title="Connect" @click="clientMode()" /> -->
                <ButtonMode :title="server_stat" @click="createOwnServer()" />
            </div>
        </div>
    </div>
</template>

<script setup>
import Wave from '../components/Wave.vue';
import ButtonMode from '../components/mode/ButtonMode.vue';
import { useModeStore } from '../stores/mode'
import { computed, onMounted, reactive, ref } from 'vue';
import ConnectModal from '../components/ConnectModal.vue';
import { useVuelidate } from "@vuelidate/core";
import { required, maxLength, ipAddress } from "@vuelidate/validators";
import { onClickOutside } from '@vueuse/core/index.cjs';
import { useHostStore } from '../stores/Connection';

import { useServerStore } from '../stores/ServerApp';
import { useRouter } from 'vue-router';
import { decrypt, encrypt } from '../lib/crypto';

onMounted(() => {
    const isLastSetupConnect = localStorage.getItem('isLastSetupConnectMode') === 'true';

    if (isLastSetupConnect) {
        connect_modal.value = true;
    }
    return
})

const setSetupConnect = () => {
    connect_modal.value = true
    more_option.value = false
    localStorage.setItem('isLastSetupConnectMode', true)
}

const unsetConnectMode = () => {
    connect_modal.value = false
    localStorage.setItem('isLastSetupConnectMode', false)
}

const router = useRouter()
const mode = useModeStore();
const connection = useHostStore();
const server = useServerStore()


const connection_status = ref('Connect')
const connection_error = ref(false)
const is_connecting = ref(false)
const more_option = ref(false)
const connect_modal = ref(false)
const start_server_ref = ref(null)
const server_stat = ref('Start')

onClickOutside(start_server_ref, event => more_option.value = false)

const data = reactive({
    host: decrypt(localStorage.getItem('lastTryHost')) || null
})

// const privateIpAddress = (value) => {
//     const privateRanges = [
//         /^192\.168\.\d{1,3}\.\d{1,3}$/,
//         /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
//         /^172\.(1[6-9]|2[0-9]|3[01])\.\d{1,3}\.\d{1,3}$/,
//     ];
//     return privateRanges.some((regex) => regex.test(value));
// };


const rules = computed(() => {
    return {
        host: { required, ipAddress },
    };
});


const v$ = useVuelidate(rules, data);



const connect_host = async () => {
    localStorage.setItem('lastTryHost', encrypt(data.host))
    connection_error.value = false
    connection_status.value = 'Connecting'
    is_connecting.value = true
    v$.value.$touch();
    if (v$.value.$error) {
        connection_status.value = 'Connect'
        is_connecting.value = false
        return;
    }
    const hostAddress = data.host
    const connect = await connection.connectHost(hostAddress);

    if (!connect) {
        connection_error.value = true
        connection_status.value = 'Connect'
        is_connecting.value = false
        return
    }

    mode.changeMode('client')

}

const createOwnServer = async () => {
    server_stat.value = 'Starting'
    const start = await server.start_server()
    if (!start) {
        server_stat.value = 'Start'
        return
    }

}


</script>

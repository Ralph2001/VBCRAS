<template>
    <div class="flex flex-col w-full bg-slate-50 h-screen mx-auto items-center justify-center">
        <p class="text-3xl font-sans uppercase text-gray-900 font-semibold mb-5">Connection Mode</p>
        <span class="text-md text-red-600 font-normal mb-5"> {{ Connect.error }}</span>

        <div class="flex flex-row justify-center item-center gap-4 uppercase" v-if="mode != `Client`">
            <button type="button"
                class="text-md font-medium text-gray-900 button-10 w-28 h-24 border bg-gray-100 hover:bg-gray-200"
                @click="choose('Server')">
                Server</button>
            <button type="button"
                class="text-md font-medium text-gray-900 button-10 w-28 h-24 border bg-gray-100 hover:bg-gray-200"
                @click="choose('Client')">
                Client</button>

        </div>

        <fwb-input v-if="mode === `Client`" v-model="address" placeholder="0.0.0.0" label="Host Address"
            class="rounded-sm" />
        <div class="mt-10 ml-36" v-if="mode === `Client`">
            <button type="submit" @submit.prevent @click="Submit()"
                class="h-10 w-20 border bg-blue-600 text-white rounded-sm">Connect</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { FwbInput } from 'flowbite-vue'
import { ConnectionMode } from '../stores/connection'


const Connect = ConnectionMode();
const address = ref('');
const mode = ref()

const choose = (modeSelected) => {
    mode.value = modeSelected
}

const Submit = async () => {
    const connect = await Connect.assignHost(address.value)
}

</script>
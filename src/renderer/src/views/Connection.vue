<template>
    <!-- <div class="flex flex-col w-full bg-slate-50 h-screen mx-auto items-center justify-center">
        <p class="text-3xl font-sans uppercase text-gray-900 font-semibold mb-5">Connection Mode</p>
        <span class="text-md text-red-600 font-normal mb-5">{{ Connect.error }}</span>

        <div class="flex flex-row justify-center item-center gap-4 uppercase" v-show="selectedMode !== 'Client'">
            <button type="button"
                class="text-md font-medium text-gray-900 button-10 w-28 h-24 border bg-gray-100 hover:bg-gray-200"
                @click="chooseMode('Server')">
                Server
            </button>
            <button type="button"
                class="text-md font-medium text-gray-900 button-10 w-28 h-24 border bg-gray-100 hover:bg-gray-200"
                @click="chooseMode('Client')">
                Client
            </button>
        </div>

        <fwb-input v-show="selectedMode === 'Client'" v-model="hostAddress" placeholder="0.0.0.0" label="Host Address"
            class="rounded-sm" />
        <div class="mt-10 ml-36" v-show="selectedMode === 'Client'">
            <button type="button" @click="connectToHost()"
                class="h-10 w-20 border bg-blue-600 text-white rounded">Connect</button>
        </div>
    </div> -->

    <div class="flex flex-col w-full bg-slate-50 h-screen justify-normal p-4 items-center">
        <p class="text-3xl font-sans uppercase text-gray-600 font-bold mb-auto"></p>
        <div class="mb-auto relative">
            <!-- <span class="text-md text-red-600 font-normal mb-5" v-show="v$.hostAddress.$error">Required Fields</span> -->
            <span class="text-sm  text-red-600 font-normal mb-5 absolute top-20 text-center" v-if="v$.hostAddress.$error">{{
                v$.hostAddress.$errors[0].$message }}</span>



            <div class="flex flex-row p-3 gap-2" v-show="Connect.mode !== 'Client'">
                <button type="button"
                    class="text-md font-medium text-gray-900 button-10 w-28 h-24 border bg-gray-100 hover:bg-gray-200"
                    @click="chooseMode('Server')">
                    Server
                </button>
                <button type="button"
                    class="text-md font-medium text-gray-900 button-10 w-28 h-24 border bg-gray-100 hover:bg-gray-200"
                    @click="chooseMode('Client')">
                    Client
                </button>
            </div>

            <div class="flex flex-col gap-6 relative" v-show="Connect.mode === 'Client'">
                <div class="card flex justify-center">
                    <div class="flex flex-col gap-2">
                        <label for="username" class="text-md font-semibold text-gray-800">Host Address</label>
                        <InputText v-model="formData.hostAddress" class="rounded ring-0 font-bold" />

                    </div>
                </div>
                <div class="card flex flex-col gap-2 justify-center">
                    <div class="flex flex-row gap-2 justify-between w-full items-center">
                        <label for="reconnect" class="text-sm font-semibold text-gray-800 ">Auto
                            Connect</label>
                        <Checkbox v-model="checked" :binary="true" />

                    </div>

                </div>
                <div>
                    <div class="card flex justify-end mt-5">
                        <Button :label="label" :loading="loading" size="small" class="rounded" @click="connectToHost" />
                    </div>
                </div>
                <div class=" absolute -top-[55px] -left-[25px]">
                    <button class="bg-blue-100 rounded-full px-3 py-2" type="button" title="Change Mode"><span
                            class="pi pi-arrow-right-arrow-left" @click="chooseMode('None')"></span></button>
                </div>
            </div>


        </div>
    </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;

}
</style>
<script setup>
import { ref } from 'vue';
import InputText from 'primevue/inputtext';
import Checkbox from 'primevue/checkbox';
import Button from 'primevue/button';
import { ConnectionMode } from '../stores/connection';
import { reactive, computed, onMounted } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, ipAddress } from "@vuelidate/validators";


const checked = ref(true);
const loading = ref(false);
const label = ref('Connect')


const Connect = ConnectionMode();
const selectedMode = ref();

const chooseMode = async (modeSelected) => {
    await Connect.changeMode(modeSelected)
};


const formData = reactive({
    hostAddress: null,

});

const rules = computed(() => {
    return {
        hostAddress: { required, ipAddress },
    };
});

const v$ = useVuelidate(rules, formData);

const connectToHost = async () => {
    v$.value.$touch();
    if (v$.value.$error) {
        console.log(v$)

        return;
    }
    try {
        loading.value = true;
        label.value = 'Connecting';
        const connect = await Connect.assignHost(formData.hostAddress);
        if (!connect) {
            loading.value = false;
            label.value = 'Connect';
        }
    } catch (error) {
        loading.value = false;
        label.value = 'Connect';
        console.error('Connection error:', error);
    }
};
</script>
  
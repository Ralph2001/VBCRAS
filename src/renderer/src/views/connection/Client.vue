<template>
    <div class="flex flex-row h-screen items-center w-full ">
        <div class="md:flex flex-col bg-gray-200 h-full w-[50%] justify-center items-center gap-1 p-4 hidden">
            <p class="text-2xl text-gray-900 font-bold font-sans mt-auto">Connect to Local Server</p>
            <p class="text-sm text-gray-500 font-semibold font-sans">Document Automation | Record Management</p>
            <p class="text-xs mt-auto text-gray-400 font-bold font-mono"></p>

        </div>

        <div class="flex flex-col bg-gray-100 h-full w-full justify-center items-center gap-4">

            <div class="flex flex-col gap-2 mt-auto h-44 items-center justify-center  ">
                    <HostInput label="Host Address" :error="v$.hostAddress.$error" @hostInput="host"
                        :errormessage="error" />
            </div>

            <div class="flex flex-row gap-2 mt-auto items-center justify-center w-full p-4 ">
                <button @click="resetMode()" type="button"
                    class="flex items-center py-2 px-4 me-2 mb-2 mr-auto text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-sm border border-gray-200 hover:bg-gray-300 focus:z-10   dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                    <span class="me-2 pi pi-arrow-left"></span> Change
                    Mode</button>
                <button type="button"
                    class="py-2 px-4 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-sm border border-gray-200 hover:bg-gray-300 focus:z-10   dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Auto
                    Connect</button>
                <SubmitBtn :label="label" :loading="loading" @click="connectToHost" />
            </div>

        </div>

    </div>
</template>

<script setup>
import { reactive, computed, onMounted, ref, inject } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, ipAddress } from "@vuelidate/validators";
import HostInput from "../../components/connection/HostInput.vue";
import { ConnectionMode } from "../../stores/connection";
import SubmitBtn from "../../components/connection/SubmitBtn.vue";


const swal = inject("$swal");
const Toast = swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.onmouseenter = swal.stopTimer;
        toast.onmouseleave = swal.resumeTimer;
    },
});



const Connect = ConnectionMode();

const formData = reactive({
    hostAddress: null,
});


const loading = ref(false);
const label = ref("Connect");

const host = (host) => {
    formData.hostAddress = host;
    error.value = v$.value.$errors[0]?.$message || '';
};

const error = ref()

const rules = computed(() => {
    return {
        hostAddress: { required, ipAddress },
    };
});

const v$ = useVuelidate(rules, formData);

const connectToHost = async () => {
    v$.value.$touch();
    if (v$.value.$error) {
        error.value = v$.value.$errors[0].$message
        console.log(v$.value)
        return;
    }
    try {
        loading.value = true;
        label.value = 'Connecting';
        const connect = await Connect.assignHost(formData.hostAddress);
        // console.log(connect)
        if (!connect) {
            loading.value = false;
            label.value = "Connect";
            Toast.fire({
                icon: "error",
                title: "Connection Refused: The host is not accepting connections.",
            });
        }
    } catch (error) {
        // console.error("Connection error:", error);
        loading.value = false;
        label.value = "Connect";
    }
};

const resetMode = () => {
    Connect.resetMode()
}
</script>

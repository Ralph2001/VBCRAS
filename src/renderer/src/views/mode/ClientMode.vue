<template>
    <div class="flex flex-row h-screen items-center w-full ">
        <div class="md:flex flex-col bg-gray-200 h-full w-[50%] justify-center items-center gap-1 p-4 hidden">
            <p class="text-2xl text-gray-900 font-bold font-sans mt-auto">Connect to Local Server</p>
            <p class="text-sm text-gray-500 font-semibold font-sans">Document Automation | Record Management</p>
            <p class="text-xs mt-auto text-gray-400 font-bold font-mono"></p>

        </div>

        <div class="flex flex-col bg-gray-100 h-full w-full justify-center items-center gap-4">
            <div class="flex flex-col gap-2 mt-auto h-44 items-center justify-center  ">
                <HostInput label="Host Address"  :error="v$.hostAddress.$error" @hostInput="host" :errormessage="error" />
            </div>

            <!-- -->
            <div class="flex flex-row gap-2 mt-auto items-center justify-center w-full p-4 ">
                <handleBtn label="Change Mode" @click="resetMode()" :addClass="changeMode" />
                <handleBtn label="Auto Connect" :addClass="autoClass" @click="autoConnect()" />

                <SubmitBtn :label="label" :loading="loading" @click="connectToHost" type="submit" />
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
import handleBtn from "../../components/connection/handleBtn.vue";


const swal = inject("$swal");
const con = ConnectionMode();

const changeMode = ref('bg-white mr-auto')
const autoClass = ref('bg-white hover:bg-green-600 hover:text-white')


onMounted(() => {
    con.checkMode();
    // con.checkConnection()

})

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
        const connect = await con.assignHost(formData.hostAddress);
        if (!connect) {
            loading.value = false;
            label.value = "Connect";
            Toast.fire({
                icon: "error",
                title: "Connection Refused: The host is not accepting connections.",
            });
        }
    } catch (error) {

        loading.value = false;
        label.value = "Connect";
    }
};

const resetMode = () => {
    con.resetMode()
}
const autoConnect = () => {
    Toast.fire({
        icon: "success",
        title: "Auto Connect",
    });
}
</script>

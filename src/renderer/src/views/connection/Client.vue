<template>
    <div class="flex flex-col w-full bg-slate-100 h-screen justify-center p-4 items-center">
        <div class="flex flex-col gap-6">
            <div class="card flex justify-center">
                <div class="flex flex-col gap-2">
                    <HostInput label="Host Address" :error="v$.hostAddress.$error" @hostInput="host"
                        :errormessage="error" />
                </div>
            </div>
            <div class="card flex flex-col gap-2 justify-center">
                <div class="flex flex-row gap-2 justify-between w-full items-center">
                    <CheckBox label="Auto Connect" />
                </div>
            </div>
            <div class="flex justify-end">
                <SubmitBtn :label="label" :loading="loading" @click="connectToHost" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, computed, onMounted, ref } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, ipAddress } from "@vuelidate/validators";
import HostInput from "../../components/connection/HostInput.vue";
import CheckBox from "../../components/connection/CheckBox.vue";
import { ConnectionMode } from "../../stores/connection";
import SubmitBtn from "../../components/connection/SubmitBtn.vue";
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
        if (!connect) {
            loading.value = false;
            label.value = "Connect";
        }
    } catch (error) {
        console.error("Connection error:", error);
        loading.value = false;
        label.value = "Connect";
    }
};
</script>

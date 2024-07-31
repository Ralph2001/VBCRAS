<template>
    <!-- <div class="grid grid-cols-2 gap-5 items-start w-full p-4 ">
                    <p class="text-lg font-semibold">Backup and Restore</p>
                    <div class="flex flex-col gap-2">
                        <div class="flex flex-row">
                            <div class="flex flex-row items-center gap-2">
                                <input type="checkbox" class="border-gray-400 rounded-sm" name="" id="backup">
                                <label for="backup" class="text-md font-semibold text-gray-700 font-mono">Auto Backup
                                    Database</label>
                            </div>
                            <div class="ml-auto"><button class="px-4 border  bg-white">Restore</button></div>
                        </div>

                    </div>
                </div> -->

    <div class="grid sm:grid-cols-1 md:lg:grid-cols-2 gap-5 items-start     p-4 w-full">
        <p class="text-lg font-semibold ">Applications</p>
        <div class="flex flex-col gap-5">
            <div class="grid grid-cols-2 items-center gap-2">
                <div v-for="app in system_apps" :key="app"
                    class="flex flex-row flex-wrap grow rounded gap-2 sm:w-full  h-[5rem] items-center shadow-sm bg-white  hover:bg-gray-50 hover:cursor-pointer  border px-5 py-2">
                    <input type="checkbox" checked disabled
                        class="border-gray-300 rounded disabled:bg-blue-300 font-semibold" name="" :id="app">
                    <label :for="app" class="text-gray-800 text-sm font-medium">{{ app }}</label>
                </div>

            </div>
            <div class="flex flex-col gap-2 bg-yellow-50  p-2">

                <p class="text-sm text-justify"><span class="font-medium">Note: </span> For all users to
                    access and
                    open scanned documents without any issues, everyone needs to be connected to the same
                    storage server. For example, if you use a storage server like Synology, make sure that
                    all files are stored in the same location, such as Synology/Scanned Documents/Birth/.
                    This way, everyone will be able to find and open the files correctly.</p>
                <p class="text-sm text-justify ">If you don’t have a storage server, you should uncheck
                    the
                    'Scanned Documents' option, as
                    it will not work without a shared storage setup.</p>
            </div>
        </div>
    </div>
    <div class="grid grid-cols-2 gap-5 items-start w-full p-4 ">
        <p class="text-lg font-semibold">Office</p>
        <div class="flex flex-col gap-2">
            <Input :error="v$.municipality_province.$error" label="Municipality, Province"
                v-model="formData.municipality_province" />
            <Input :error="v$.municipal_civil_registrar.$error" label="Municipal Civil Registrar" class="mt-10"
                v-model="formData.municipal_civil_registrar" />
            <Input :error="v$.mayor.$error" label="Municipal Mayor" v-model="formData.mayor" />
            <Input label="Where can people obtain their receipt or cedula? ex. Bayambang, Pangasinan (Optional)"
                class="mt-10" v-model="formData.reciept_municipality_province" />

        </div>
    </div>
</template>

<script setup>
import Input from '../essentials/inputs/Input.vue'

import { useVuelidate } from "@vuelidate/core";
import { required, requiredIf, numeric } from "@vuelidate/validators";
import { computed, reactive, ref } from 'vue';
const system_apps = ref([
    'CCE & CFN',
    'Forms',
    'Registry Records',
    'AUSF',
    'Scanned Documents',
])

const formData = reactive({
    municipality_province: '',
    municipal_civil_registrar: '',
    mayor: '',
    reciept_municipality_province: '',
})


const rules = computed(() => ({
    municipality_province: { required },
    municipal_civil_registrar: { required },
    mayor: { required },
}))

const v$ = useVuelidate(rules, formData);


const submit = async () => {
    const isFormValid = await v$.value.$validate();
    if (!isFormValid) {
        console.log(v$.value)
        return
    }

    const change_setting = system_setting.setSystemSetting(formData)
    if (change_setting) {
        router.push('/client/welcome')
    }
}
</script>

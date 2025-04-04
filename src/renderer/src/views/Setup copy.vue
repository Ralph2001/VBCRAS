<template>
    <div class="h-full w-full  ">
        <div v-if="auth.user_role === 1" class=" flex h-full flex-col p-4 gap-4 relative">
            <p class=" text-lg font-bold text-gray-700 font-mono uppercase">System Setup</p>

            <div class="flex flex-col border rounded-md p-10  bg-gray-50  overflow-y-scroll ">
                <div class="flex flex-col h-full p-4 py-8  gap-4 ">
                    <p class="font-medium text-xl text-gray-800   md:lg:px-20 uppercase font-mono ">Default Saving Path
                        for all files</p>
                    <div class="w-full flex flex-col md:lg:grid-cols-2 md:lg:px-20">

                        <div class="flex flex-row gap-2 w-full items-center justify-center">
                            <Input label="Path" class="w-full" readonly :error="v$.file_path.$error"
                                v-model="formData.file_path" />
                            <button class="border rounded p-2 mt-auto font-medium bg-blue-500 text-white px-4"
                                v-if="!formData.file_path" @click="open">Select</button>
                            <button class="border rounded p-2 mt-auto font-medium bg-red-400 text-white px-4"
                                v-if="formData.file_path" @click="formData.file_path = ''">Remove</button>

                        </div>

                    </div>
                    <div class="flex flex-col md:lg:px-20">
                        <p class="font-medium text-xl text-gray-800    uppercase font-mono ">Default Value
                        </p>
                        <div class="grid grid-cols-2 gap-2">
                            <InputAutoComplete label="Province" v-model="formData.header_province"
                                :suggestion_data="province" :error="v$.header_province.$error" />
                            <InputAutoComplete label="City/Municipality" cap :error="v$.header_municipality.$error"
                                v-model="formData.header_municipality" :suggestion_data="municipality_with_word" />
                        </div>
                    </div>

                    <div class="flex flex-col  md:lg:px-20 gap-5">
                        <p class="font-medium text-2xl text-gray-800">Header for Correction of Clerical
                            Error and Change of First Name</p>
                        <div class="flex flex-col gap-2 w-full">
                            <div class="grid grid-cols-2 gap-2">
                                <InputAutoComplete label="Province" v-model="formData.header_province"
                                    :suggestion_data="province" :error="v$.header_province.$error" />
                                <InputAutoComplete label="City/Municipality" cap :error="v$.header_municipality.$error"
                                    v-model="formData.header_municipality" :suggestion_data="municipality_with_word" />
                            </div>

                        </div>
                    </div>
                    <p class="font-medium text-2xl text-gray-800  md:lg:px-20 ">Correction of Clerical Error and Change
                        of First
                        Name
                    </p>
                    <div class="grid  gap-10 sm:grid-cols-1 md:lg:grid-cols-2 md:lg:px-20 w-full">



                        <div class="flex flex-col gap-2">
                            <p class="font-medium italic">Most Use</p>

                            <Input label="Nationality" v-model="formData.nationality" />
                            <Input label="Country" v-model="formData.country" />
                        </div>
                        <div class="flex flex-col gap-2">
                            <p class="font-medium italic">Filling This petition at</p>
                            <InputAutoComplete label="Province" v-model="formData.filing_province"
                                :suggestion_data="province" :error="v$.filing_province.$error" />
                            <InputAutoComplete label="City/Municipality" v-model="formData.filing_municipality"
                                :suggestion_data="municipality" :error="v$.filing_municipality.$error" />

                        </div>
                        <div class="flex flex-col gap-2">
                            <p class="font-medium italic">Administering Officer</p>
                            <Input label="Name" cap v-model="formData.administering_officer_name" />
                            <Input label="Position" v-model="formData.administering_officer_position" />
                        </div>
                        <div class="flex flex-col gap-2">
                            <p class="font-medium italic">Subscribe and Sworn</p>
                            <InputAutoComplete label="City/Municipality"
                                v-model="formData.subscribe_sworn_city_municipality"
                                :suggestion_data="municipality_province" />
                            <InputAutoComplete label="Issued At" v-model="formData.issued_at"
                                :suggestion_data="municipality_province" />

                        </div>

                    </div>
                    <div class="flex flex-col gap-4">
                        <p class="font-medium text-2xl text-gray-800   md:lg:px-20">Municipality</p>
                        <div class="grid  w-full gap-10 items-center sm:grid-cols-1 md:lg:grid-cols-2 md:lg:px-20">
                            <Input label="Municipal Civil Registrar" :error="v$.municipal_civil_registrar.$error" cap
                                v-model="formData.municipal_civil_registrar" />
                            <Input label="Municipal Mayor" :error="v$.mayor.$error" cap v-model="formData.mayor" />

                        </div>
                    </div>
                    <!-- <div class="flex flex-col  md:lg:px-20 gap-5">
                        <p class="font-medium text-2xl text-gray-800">Default Date Configuration</p>
                        <DateChangerClearical />
                    </div> -->
                </div>
            </div>

            <div class="flex flex-row gap-4 justify-end">
                <button @click="auth.logout" tabindex="-1"
                    class="border px-4 py-1.5 hover:bg-red-400 rounded shadow-sm hover:text-white">Logout</button>
                <button :disabled="is_submitting"
                    class="w-max  border px-4 py-1.5 disabled:cursor-progress rounded disabled:bg-blue-200  bg-blue-500 text-white font-medium bottom-2 right-2"
                    @click="submit_setup">Submit</button>
            </div>

        </div>
        <div v-if="auth.user_role === 2"
            class="h-full w-full flex flex-row flex-wrap gap-5 items-center justify-center relative">
            <div class=" basis-[45%]">
                <p class="font-mono text-4xl">VBCRAS</p>
                <p class="font-mono">The system has not been configured yet. The administrator needs to set it up.</p>
            </div>

            <div class="basis-[45%] ">
                <SetupSVG />
            </div>
            <div class="absolute bottom-10 px-4 right-0 ">
                <button @click="auth.logout"
                    class="border px-4 py-1.5 hover:bg-red-400 rounded shadow-sm hover:text-white">Logout</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import Input from '../components/essentials/inputs/Input.vue'
import { useSetup } from '../stores/Setting/setup';
import { useRouter } from 'vue-router';

import { AuthStore } from '../stores/Authentication';
import SetupSVG from '../components/svg/setupSVG.vue';
import { useVuelidate } from "@vuelidate/core";
import { required, requiredIf, numeric } from "@vuelidate/validators";
import InputAutoComplete from '../components/InputAutoComplete.vue';
import { complete_municipality, complete_municipality_with_province, complete_municipality_with_province_with_words, complete_province } from '../utils/Address';
import DateChangerClearical from '../components/settings/DateChangerClearical.vue';
import { useDate } from '../stores/Date';

const router = useRouter()
const date_config = useDate()

const auth = AuthStore()
const system_setting = useSetup()

const province = ref(complete_province())
const municipality = computed(() => {
    return complete_municipality(formData.filing_province)
})
const municipality_province = computed(() => {
    return complete_municipality_with_province(formData.filing_province)
})

const municipality_with_word = computed(() => {
    return complete_municipality_with_province_with_words(formData.header_province)
})

const is_submitting = ref(false)



onMounted(async () => {
    await date_config.get_date_rules()
    system_setting.getSystemSetting()
    system_setting.getScannedType()

})

const open = async () => {
    const folder = await window.LocalCivilApi.selectFolder()
    formData.file_path = folder
}

const formData = reactive({
    header_province: '',
    header_municipality: 'MUNICIPALITY OF ',


    file_path: '',
    nationality: 'Filipino',
    country: 'Philippines',
    filing_province: '',
    filing_municipality: '',
    administering_officer_name: '',
    administering_officer_position: '',
    subscribe_sworn_city_municipality: '',
    issued_at: '',
    municipal_civil_registrar: '',
    mayor: '',
})


const rules = computed(() => ({
    header_province: { required },
    header_municipality: { required },

    file_path: { required },
    municipal_civil_registrar: { required },
    filing_province: { required },
    filing_municipality: { required },
    mayor: { required },
}))

const v$ = useVuelidate(rules, formData);

const submit_setup = async () => {
    is_submitting.value = true
    const isFormValid = await v$.value.$validate();
    if (!isFormValid) {
        console.log(v$.value)
        is_submitting.value = false
        return
    }

    const data = {
        header_province: formData.header_province,
        header_municipality: formData.header_municipality,


        municipal_civil_registrar: formData.municipal_civil_registrar,
        mayor: formData.mayor,
        petition_default_file_path: formData.file_path,
        petition_default_nationality: formData.nationality,
        petition_default_country: formData.country,
        petition_default_filling_province: formData.filing_province,
        petition_default_filling_municipality: formData.filing_municipality,
        petition_default_administering_officer_name: formData.administering_officer_name,
        petition_default_administering_officer_position: formData.administering_officer_position,
        petition_default_subscribe_sworn_municipality: formData.subscribe_sworn_city_municipality,
        petition_default_issued_at: formData.issued_at,
    }

    const change_setting = await system_setting.setSystemSetting(data)

    if (change_setting) {
        router.push('/pages/welcome')
    }
}



</script>

<style lang="scss" scoped></style>
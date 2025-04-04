<template>
    <div class="w-full h-screen flex items-center justify-center ">
        <div class="fixed top-0 left-0 right-0 justify-center items-center flex border w-full  h-12 bg-white z-50">
            <p class=" text-lg font-bold text-gray-700 font-mono uppercase f">{{ auth.user_role === 1 ? 'SYSTEM SETUP' :
                ':('}}</p>
        </div>
        <div v-if="auth.user_role === 1"
            class="max-w-screen-xl  flex-1 w-full h-full flex flex-col p-4 gap-4 relative overflow-y-auto">

            <div class="mt-10 flex flex-col lg:px-20 h-full">
                <div class="flex flex-col">
                    <p class="font-bold text-xl text-gray-700 uppercase font-mono ">Default Saving Path
                        for all files</p>
                    <p class=" text-sm text-gray-700 mt-2">This will be the default saving path for all generated
                        documents.
                        Please
                        ensure that the location is a shared drive if you plan to share your data with others so they
                        can access and open the generated documents as well. Thank you!

                    </p>

                    <div class="w-full flex flex-col md:lg:grid-cols-2  mt-2  ">
                        <div class="flex flex-row gap-2 w-full items-center justify-center mt-4">
                            <input type="text"
                                class="border border-gray-300 w-full focus:border-gray-400 pointer-events-none focus:ring-0 ring-0  p-2 read-only:bg-gray-50 rounded-md font-mono font-normal outline-none text-gray-700"
                                placeholder="Select File Path" readonly :error="v$.file_path.$error"
                                v-model="formData.file_path" />

                            <button class="border rounded p-2 mt-auto font-medium bg-blue-500 text-white px-4"
                                v-if="!formData.file_path" @click="open">Select</button>
                            <button class="border rounded p-2 mt-auto font-medium bg-red-400 text-white px-4"
                                v-if="formData.file_path" @click="formData.file_path = ''">Remove</button>
                        </div>

                    </div>
                    <div class="flex flex-col mt-6 gap-2" v-if="formData.file_path">
                        <p class="font-mono font-semibold text-gray-600 text-sm">Path Preview:</p>

                        <div class="w-full py-1.5 px-2 rounded-sm bg-gray-50 flex items-center overflow-hidden ">
                            <p class="text-gray-700 font-mono text-sm truncate"><span class="hover:text-blue-500"
                                    :title="formData.file_path">...</span> > <span class="text-blue-500"
                                    title="System Name">VBCRAS</span> > Corrections > Year >
                                Month > Document
                                Name</p>
                        </div>
                        <div class="w-full py-1.5 px-2 rounded-sm bg-gray-50 flex items-center overflow-hidden ">
                            <p class="text-gray-700 font-mono text-sm truncate"><span class="hover:text-blue-500"
                                    :title="formData.file_path">...</span> > <span class="text-blue-500"
                                    title="System Name">VBCRAS</span> > Forms > Form Type >
                                Year
                                > Month >
                                Document
                                Name</p>
                        </div>
                        <div class="w-full py-1.5 px-2 rounded-sm bg-gray-50 flex items-center overflow-hidden ">
                            <p class="text-gray-700 font-mono text-sm truncate"><span class="hover:text-blue-500"
                                    :title="formData.file_path">...</span> > <span class="text-blue-500"
                                    title="System Name">VBCRAS</span> > Application for
                                Marriage
                                License > Year > Month > Document
                                Name</p>
                        </div>
                        <div class="w-full py-1.5 px-2 rounded-sm bg-gray-50 flex items-center overflow-hidden ">
                            <p class="text-gray-700 font-mono text-sm truncate"><span class="hover:text-blue-500"
                                    :title="formData.file_path">...</span> > <span class="text-blue-500"
                                    title="System Name">VBCRAS</span> > Type > Legitimation >
                                Year >
                                Month > Document
                                Name</p>
                        </div>
                    </div>
                </div>


                <div class="w-full flex flex-col ">
                    <p class="font-bold text-xl text-gray-700 uppercase font-mono mt-10 mb-4">Default Value</p>

                    <div class="grid lg:grid-cols-2 gap-2">
                        <InputAutoComplete label="Province" v-model="formData.filing_province"
                            :suggestion_data="province" :error="v$.filing_province.$error" />
                        <InputAutoComplete label="City/Municipality" :error="v$.filing_municipality.$error"
                            v-model="formData.filing_municipality" :suggestion_data="municipality" />
                        <Input label="Municipal Civil Registrar" :error="v$.municipal_civil_registrar.$error" cap
                            v-model="formData.municipal_civil_registrar" />
                        <Input label="Municipal Mayor" :error="v$.mayor.$error" cap v-model="formData.mayor" />

                    </div>
                </div>


                <div class="flex flex-row gap-2 justify-end mt-auto">
                    <button @click="auth.logout" tabindex="-1"
                        class="border px-4 py-1.5 hover:bg-red-400 rounded shadow-sm hover:text-white">Logout</button>
                    <button :disabled="is_submitting"
                        class="w-max  border px-4 py-1.5 disabled:cursor-progress rounded disabled:bg-blue-200  bg-blue-500 hover:bg-blue-600 text-white font-medium bottom-2 right-2"
                        @click="submit_setup">Submit</button>
                </div>
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
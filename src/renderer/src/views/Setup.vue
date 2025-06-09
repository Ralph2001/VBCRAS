<template>
    <div class="w-full h-screen flex items-center justify-center ">
        <div class="fixed top-0 left-0 right-0 justify-center items-center flex border w-full  h-12 bg-white z-50">
            <p class=" text-lg font-bold text-gray-700 font-mono uppercase f">{{ auth.user_role === 1 ? 'SYSTEM SETUP' :
                ':(' }}</p>
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
                        <!-- <div class="w-full py-1.5 px-2 rounded-sm bg-gray-50 flex items-center overflow-hidden ">
                            <p class="text-gray-700 font-mono text-sm truncate"><span class="hover:text-blue-500"
                                    :title="formData.file_path">...</span> > <span class="text-blue-500"
                                    title="System Name">VBCRAS</span> > Type > Legitimation >
                                Year >
                                Month > Document
                                Name</p>
                        </div> -->
                    </div>
                </div>


                <div class="w-full flex flex-col ">
                    <p class="font-bold text-xl text-gray-700 uppercase font-mono mt-10 mb-4">Default Value</p>

                    <div class="grid lg:grid-cols-2 gap-2">
                        <InputAutoComplete label="Province" v-model="formData.province" :suggestion_data="province"
                            :error="v$.province.$error" />
                        <InputAutoComplete label="City/Municipality" :error="v$.municipality.$error"
                            v-model="formData.municipality" :suggestion_data="municipality" />
                        <Input label="Municipal Civil Registrar" :error="v$.civil_registrar.$error" cap
                            v-model="formData.civil_registrar" />
                        <Input label="Municipal Mayor" :error="v$.mayor.$error" cap v-model="formData.mayor" />

                    </div>
                </div>


                <div class="flex flex-row gap-4 justify-end mt-auto">
                    <!-- Logout Button -->
                    <button @click="auth.logout" tabindex="-1"
                        class="border border-gray-400 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 hover:text-black transition-colors">
                        Logout
                    </button>

                    <!-- Submit Button -->
                    <button :disabled="is_submitting"
                        class="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-200 disabled:text-blue-500 disabled:cursor-not-allowed transition-all"
                        @click="submit_setup">
                        Submit
                    </button>
                </div>

            </div>
        </div>
<div v-if="auth.user_role === 2" class="flex flex-col items-center justify-center h-full w-full p-8 text-center bg-white">
  <div class="mb-8">
    <SetupSVG class="w-64 h-64 text-green-500 " />
  </div>

  <h2 class="text-4xl font-semibold text-gray-800 mb-3">Setup Required</h2>
  <p class="text-lg text-gray-600 max-w-lg">The system needs to be configured by an administrator before you can proceed.</p>

  <div class="mt-12">
    <button @click="auth.logout" class="px-8 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-red-500 hover:text-white transition duration-300 ease-in-out shadow-md">
      Sign Out
    </button>
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
import { required } from "@vuelidate/validators";
import InputAutoComplete from '../components/InputAutoComplete.vue';
import { complete_municipality, complete_province } from '../utils/Address';

import { useDate } from '../stores/Date';

const router = useRouter()
const date_config = useDate()

const auth = AuthStore()
const system_setting = useSetup()

const province = ref(complete_province())
const municipality = computed(() => {
    return complete_municipality(formData.province)
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
    province: '',
    municipality: '',
    civil_registrar: '',
    mayor: '',
    file_path: ''
})


const rules = computed(() => ({
    province: { required },
    municipality: { required },
    civil_registrar: { required },
    mayor: { required },
    file_path: { required }
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
        province: formData.province,
        municipality: formData.municipality,
        civil_registrar: formData.civil_registrar,
        mayor: formData.mayor,
        file_path: formData.file_path,
    }

    const change_setting = await system_setting.setSystemSetting(data)

    if (change_setting) {
        router.push('/pages/welcome')
    }
}



</script>

<style lang="scss" scoped></style>
<template>
    <div class="h-full w-full  ">
        <div v-if="auth.user_role === 1" class=" flex h-full flex-col gap-5 p-10 relative">

            <div class="fixed bottom-0 right-0 p-4 gap-2 flex">

                <button @click="auth.logout" tabindex="-1"
                    class="border px-4 py-1.5 hover:bg-red-400 rounded shadow-md hover:text-white">Logout</button>

                <button class="px-4 py-1.5 border font-medium tracking-wider shadow bg-blue-500 rounded text-white"
                    @click="submit">Save
                    Setttings</button>
            </div>
            <!-- <p class="text-2xl uppercase font-medium text-gray-800">Welcome to VBCRAS</p> -->

            <div class=" flex flex-row px-10 py-5 w-full items-center justify-between">
                <p class="text-2xl font-mono text-gray-600"> System Setup</p>
                <p class="italic text-gray-500">Welcome to VBCRAS</p>
            </div>


            <div
                class=" flex flex-col sm:px-3 md:lg:px-40 py-5 gap-10 border rounded h-[calc(100vh-200px)] overflow-scroll  w-full items-center justify-between">

                <div class="grid grid-cols-2 gap-5 items-start w-full p-4 ">
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
                        <!-- <div class="text-sm text-gray-800">
                            <p>
                                <span class="font-semibold ">Note:</span> As the data grows, backup files can become
                                very large, taking up a
                                significant
                                amount of space. It is advisable to set the backup location to a storage server.
                            </p>
                        </div> -->

                    </div>
                </div>

                <div class="grid sm:grid-cols-1 md:lg:grid-cols-2 gap-5 items-start     p-4 w-full">
                    <p class="text-lg font-semibold ">Applications</p>
                    <div class="flex flex-col gap-5">
                        <div class="grid grid-cols-2 items-center gap-2">
                            <div v-for="app in system_apps" :key="app"
                                class="flex flex-row flex-wrap grow rounded gap-2 sm:w-full  h-[5rem] items-center shadow-sm bg-white  hover:bg-gray-50 hover:cursor-pointer  border px-5 py-2">
                                <input type="checkbox" checked disabled
                                    class="border-gray-300 rounded disabled:bg-blue-300 font-semibold" name=""
                                    :id="app">
                                <label :for="app" class="text-gray-800 text-sm font-medium">{{ app }}</label>
                            </div>

                        </div>
                        <div class="flex flex-col gap-2 bg-yellow-50  p-2">
                            <!-- <p class="text-sm text-justify"><span class="font-medium">The CCE&CFN System</span>
                                streamlines the process of correcting clerical errors and changing first names. It
                                automatically tracks the days required for posting and generates PDF documents, ensuring
                                efficiency and compliance. This automation reduces manual effort and minimizes errors,
                                providing a reliable solution for managing corrections and name changes.</p> -->
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
                    <p class="text-lg font-semibold">Default Values</p>
                    <div class="flex flex-col gap-2">
                        <Input :error="v$.municipality_province.$error" label="Municipality, Province"
                            v-model="formData.municipality_province" />
                        <Input  :error="v$.municipal_civil_registrar.$error" label="Municipal Civil Registrar"
                            class="mt-10" v-model="formData.municipal_civil_registrar" />
                        <Input :error="v$.mayor.$error" label="Municipal Mayor" v-model="formData.mayor" />
                        <Input
                            label="Where can people obtain their receipt or cedula? ex. Bayambang, Pangasinan (Optional)"
                            class="mt-10" v-model="formData.reciept_municipality_province" />

                    </div>
                </div>
                <!-- <div class="grid grid-cols-2 gap-5 items-start w-full p-4 ">
                    <p class="text-lg font-semibold">User Position</p>
                    <div class="flex flex-col gap-2">
                        <div class="flex flex-row items-center gap-2">
                            <input type="text" class="w-full font-semibold  border-gray-300 rounded-sm placeholder:italic"
                                placeholder="Position Name ex. Administrative Aide I" v-model="position_name">
                            <div class="ml-auto">
                                <button type="button" class="border bg-gray-50 shadow-sm px-4 rounded-sm"
                                    @click="add_position">Add </button>
                            </div>
                        </div>
                        <p class="text-sm mt-10">Available Positions</p>
                        <div class="h-auto bg-gray-50 shadow-inner p-4">
                            <ul class="flex flex-col gap-2 items-start justify-center">
                                <li v-for="position in system_setting.user_positions" :key="position.id"
                                    class="font-semibold text-sm flex w-full font-mono hover:bg-blue-50 p-1">
                                    {{
                                        position.name
                                    }}

                                    <div class="ml-auto">
                                        <button>
                                            <font-awesome-icon icon="fa-solid fa-xmark" class="text-red-500 " />
                                        </button>
                                    </div>
                                </li>
                            </ul>
                        </div>

                    </div>
                </div> -->

                <div class="grid grid-cols-2 gap-5 items-start w-full ">
                    <p class="text-lg font-semibold">Templates</p>
                    <div class="flex flex-col gap-2">
                        <div class="flex flex-col gap-2">
                            <p class="text-sm font-semibold">Select PDF Template</p>
                            <p class="italic font-mono text-gray-500">Available Soon <span
                                    class="text-xs text-gray-50">kung kaya pa magwork dito
                                    400/day ba
                                    naman. Job Order numbawan </span></p>
                            <p class="italic font-mono text-gray-500">(Default Bayambang Template)</p>
                        </div>
                    </div>
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
import { AuthStore } from '../stores/clientAuth';
import SetupSVG from '../components/svg/setupSVG.vue';


import { useVuelidate } from "@vuelidate/core";
import { required, requiredIf, numeric } from "@vuelidate/validators";



const auth = AuthStore()

const router = useRouter()
const system_setting = useSetup()

onMounted(() => {
    system_setting.getSystemSetting()
    // system_setting.getUserPositions()
})
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


// const position_name = ref()

// const add_position = () => {
//     const name = position_name.value
//     const data = { name }
//     system_setting.addUserPositions(data)
//     position_name.value = ''
// }

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

<style lang="scss" scoped></style>
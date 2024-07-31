<template>
    <TitleBar />
    <div class="h-full w-full  ">
        <div v-if="auth.user_role === 1" class=" flex h-full flex-col gap-5 p-10 relative">
            <Stepper :steps="steps">
                <template #step-0>
                    <div>
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

                                    <p class="text-sm text-justify"><span class="font-medium">Note: </span> For all
                                        users to
                                        access and
                                        open scanned documents without any issues, everyone needs to be connected to the
                                        same
                                        storage server. For example, if you use a storage server like Synology, make
                                        sure that
                                        all files are stored in the same location, such as Synology/Scanned
                                        Documents/Birth/.
                                        This way, everyone will be able to find and open the files correctly.</p>
                                    <p class="text-sm text-justify ">If you don’t have a storage server, you should
                                        uncheck
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
                                <Input :error="v$.municipal_civil_registrar.$error" label="Municipal Civil Registrar"
                                    class="mt-10" v-model="formData.municipal_civil_registrar" />
                                <Input :error="v$.mayor.$error" label="Municipal Mayor" v-model="formData.mayor" />
                                <Input
                                    label="Where can people obtain their receipt or cedula? ex. Bayambang, Pangasinan (Optional)"
                                    class="mt-10" v-model="formData.reciept_municipality_province" />

                            </div>
                        </div>
                    </div>
                </template>
                <template #step-1>
                    <div class="flex flex-col h-full">
                        <div class="flex flex-col p-4 px-10 border gap-4 items-center ">
                            <div class="flex flex-col">
                                <p class="font-mono">Add Document Types <span class="italic">ex. Birth</span></p>
                                <p class="font-mono text-xs italic text-gray-800">Note: You can add later</p>
                            </div>
                            <div class="flex flex-row w-[20rem] gap-2">
                                <input type="text" class="w-full rounded border-gray-200 font-medium" v-model="data">
                                <button class="px-2 bg-white rounded border hover:bg-gray-100 transition-all"
                                    @click="add">Add</button>
                            </div>

                            <div
                                class="h-auto bg-gray-50 w-[20rem] overflow-y-scroll shadow-inner p-3 gap-1 flex flex-col">
                                <p v-for="type in system_setting.scanned_types" :key="type.id"
                                    class="font-semibold p-1 border hover:bg-blue-50">
                                    {{ type.name }}
                                </p>
                            </div>
                        </div>
                        <p class="text-2xl p-4">How it works?</p>
                        <div
                            class="flex flex-col gap-2 mt-2 px-10 text-justify text-pretty text-gray-800 tracking-wide">

                            <p class="">The <span class="font-bold"> scanned documents system</span> is specifically
                                designed
                                to
                                handle PDF files, ensuring a streamlined and
                                organized approach to document management. Unlike traditional systems that save the
                                actual files, this
                                system only stores the file paths. This means that the original PDF files remain on the
                                local server
                                storage, making them easily accessible to other users. By using local server storage,
                                the system ensures
                                that all users can access and share the documents efficiently.
                            </p>
                            <p>
                                Here's how the system works in detail: Users can drag and drop one or more PDF files
                                into the system.
                                Once
                                the files are uploaded, users are prompted to define important details such as the
                                document type, the
                                year,
                                and the month. This categorization helps in better searching and organizing the
                                documents later on.
                            </p>
                            <p> Another key feature of the system is its ability to track user interactions with the
                                PDFs. It saves
                                records
                                of who views each PDF and who prints them. This tracking functionality is particularly
                                useful for
                                maintaining accountability and ensuring that the usage of sensitive documents is
                                monitored. By knowing
                                who
                                accessed or printed a document, organizations can enhance their security and compliance
                                measures.</p>
                            <p> However, it's important to note that the system relies on the integrity of the stored
                                file paths. If a
                                PDF
                                file is deleted, moved, or renamed, the path stored in the system will no longer be
                                valid, and the
                                document
                                will not be accessible through the system. This highlights the importance of maintaining
                                a stable and
                                consistent file storage environment. Users and administrators need to be aware of these
                                limitations to
                                ensure smooth operation and avoid issues related to missing files.</p>
                            <p> In summary, the scanned documents system provides a robust and user-friendly solution
                                for managing PDF
                                files. By storing file paths instead of the actual files, it optimizes storage and
                                access. The
                                drag-and-drop
                                feature, along with detailed categorization options, makes organizing documents simple
                                and efficient.
                                Additionally, the system’s ability to log user interactions with the PDFs adds an extra
                                layer of
                                accountability and security. However, maintaining the integrity of file paths is crucial
                                for the
                                system's
                                effectiveness, as any changes to the original files can disrupt access and
                                functionality.</p>
                        </div>
                    </div>
                </template>
            </Stepper>
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
import { computed, onMounted, reactive, ref, markRaw } from 'vue';
import Input from '../components/essentials/inputs/Input.vue'
import { useSetup } from '../stores/Setting/setup';
import { useRouter } from 'vue-router';
import { AuthStore } from '../stores/clientAuth';
import SetupSVG from '../components/svg/setupSVG.vue';
import TitleBar from '../components/TitleBar.vue'
import DefaultValues from '../components/configure/DefaultValues.vue';
import ConfigureScanned from '../components/configure/ConfigureScanned.vue';
import Stepper from '../components/configure/Stepper.vue';
import { useVuelidate } from "@vuelidate/core";
import { required, requiredIf, numeric } from "@vuelidate/validators";


const steps = ref([
    { title: 'Main' },
    { title: 'Scanned Documents' },
    { title: 'Correction of Clerical Error and Change of First Name' },

])

const auth = AuthStore()
const router = useRouter()
const system_setting = useSetup()

onMounted(() => {
    system_setting.getSystemSetting()
    system_setting.getScannedType()
})


const data = ref()

const add = () => {
    const name = data.value
    if (data.value === '' || data.value == null) {
        return
    }
    const add = system_setting.addScannedType({ name })
    if (add) {
        data.value = ''
    }
}

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

<style lang="scss" scoped></style>
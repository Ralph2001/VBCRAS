<template>
    <div class="flex flex-col relative justify-center w-full p-10">
        <Header label="Affidavit to use the Surname of the Father">
            <Button label="Create" isActive :class="`rounded`" @click="open_ausf" />
        </Header>


        <div class="h-[calc(100vh-250px)]">
            <TableGrid :data="aufs_.ausf" :dataColumns="colDefs" :suppressRowTransform="true" />

        </div>



        <Modal v-if="ausf_modal" medium label=" Affidavit to use the Surname of the Father" footerBG="bg-white">
            <template v-slot:header>
                <ModalCloseButton @click="close_ausf" />
            </template>
            <!-- <iframe v-if="previewUrl" class="h-full w-full " :src="previewUrl" frameborder="1"
                allowfullscreen=""></iframe> -->
            <div class="h-full" v-if="previewUrl">
                <PDFViewer :pdf="previewUrl" @cancel-btn="previewUrl = ''" @save-print="submit" :status="document_status"/>
            </div>
            <div class="flex flex-col h-full w-full scale-95 " v-if="!previewUrl">
                <div class="grid grid-cols-2 w-full">
                    <div></div>
                    <div class="flex flex-col gap-1 ">
                        <p class="underline text-sm font-neutral font-serif">LEGAL INSTRUMENT</p>
                        <div class="flex flex-row gap-2">
                            <label for="">Registry Number: </label>
                            <InputButtomBorder v-model="formData.registry_number" :width="`10rem`" skip />
                        </div>
                        <div class="flex flex-row gap-2">
                            <label for="">Date of Registration:</label>
                            <InputButtomBorder v-model="formData.date_registration" :width="`10rem`" skip />
                        </div>

                    </div>
                </div>
                <div class="w-full flex  justify-center">
                    <p class="text-center border-b-2 border-gray-400 border-dashed h-fit  font-medium w-fit">AFFIDAVIT
                        TO USE THE
                        SURNAME OF THE FATHER</p>
                </div>

                <div class="flex flex-col w-full  h-full px-16 mt-5 ">
                    <div>
                        <div class="flex flex-row gap-2">
                            <p class=" indent-8">I,</p>
                            <InputButtomBorder :error="v$.affiant_name.$error" v-model="formData.affiant_name"
                                label="Affiant's name" isBold />,
                            <InputButtomBorder :error="v$.citizenship.$error" v-model="formData.citizenship"
                                label="Citizenship" :width="`5%`" skip />,
                            <div class="flex flex-row">
                                <InputButtomBorder v-model="age" :error="v$.age.$error" type="number"
                                    @change="change_age_full" label="Age" text-position="text-end" :width="`4rem`" />
                                <InputButtomBorder :width="`6rem`" :error="v$.age.$error" @change="change_age_full" skip
                                    v-model="age_text" />
                            </div>
                        </div>
                        <div class="flex flex-row w-full">
                            <p class="text-nowrap">and a resident of </p>
                            <InputButtomBorder :error="v$.address.$error" v-model="formData.address"
                                label="Complete Address" />
                            <p class="text-nowrap">after having been duly</p>
                        </div>
                        <p>sworn in accordance with law, do hereby declare that:</p>
                    </div>
                    <div class="flex flex-col gap-2 tracking-wide text-gray-800 ">
                        <div class="flex flex-col gap-2">
                            <div class="flex flex-row"> 1. I am seeking the use of the surname
                                <InputButtomBorder :error="v$.surname.$error" v-model="formData.surname"
                                    :width="'20rem'" isBold />
                                in:
                            </div>
                            <div class="flex flex-row items-center gap-2">
                                <input type="radio" value="my" name="in_my_the" checked id="my"
                                    v-model="formData.in_my_the" class="border-gray-200 rounded">
                                <label for="my">My Certificate of Live Birth/Report of Birth, pursuant to R.A. No.
                                    9255.</label>
                            </div>
                            <div class="flex flex-row items-center gap-2 ">
                                <input type="radio" value="the" name="in_my_the" id="the" v-model="formData.in_my_the"
                                    class="border-gray-200 rounded">
                                <label for="the" class="text-nowrap">The Certificate of Live Birth/Report of Birth
                                    of</label>
                                <InputButtomBorder :error="v$.child_name.$error" v-model="formData.child_name" isBold />
                            </div>
                            <div class="flex flex-row items-center">
                                <p class="text-nowrap"> who is my
                                </p>
                                <InputButtomBorder :error="v$.relation.$error" :width="'13rem'"
                                    v-model="formData.relation" />
                                <p class="text-nowrap">pursuant to R.A. No.
                                    9255.</p>

                            </div>
                        </div>
                        <div class="flex flex-col w-full">
                            <div class="flex flex-row text-nowrap"> 2. I/He/She was born on
                                <InputButtomBorder :error="v$.date_birth.$error" v-model="formData.date_birth"
                                    :width="'13rem'" />
                                at
                                <InputButtomBorder :error="v$.at_municipality.$error" v-model="formData.at_municipality"
                                    :width="'6.2rem'" skip />,
                                <InputButtomBorder :error="v$.at_province.$error" v-model="formData.at_province"
                                    :width="'6.1rem'" skip />,
                                <InputButtomBorder :error="v$.at_country.$error" v-model="formData.at_country"
                                    :width="'6.2rem'" skip />.
                            </div>
                        </div>
                        <div class="flex flex-col">
                            <div class="flex flex-row text-nowrap"> 3. The birth was recorded under Registry No.
                                <InputButtomBorder :width="'6.2rem'" v-model="formData.registry_number" skip /> on
                                <InputButtomBorder :width="'6.2rem'" v-model="formData.date_registration" skip />.
                            </div>
                        </div>
                        <div class="flex flex-col w-full">
                            <p class=" text-nowrap">4. The Affidavit of Admission of Paternity or the
                                Private
                                Handwritten Instrument was
                                recorded under</p>
                            <div class="flex flex-row">
                                <p class=" text-nowrap">Registry No.</p>
                                <InputButtomBorder :modelValue="`N/A`" skip />
                                <p class=" text-nowrap">on</p>
                                <InputButtomBorder :modelValue="`N/A`" skip />
                                <p class=" text-nowrap">at the</p>
                                <p class=" text-nowrap">Local Civil Registry Office</p>
                            </div>
                            <div class="flex flex-row">
                                <p class="text-nowrap">(LCRO)/Philippine Foreign
                                    Service Post
                                    (PFSP) of</p>
                                <InputButtomBorder :modelValue="`N/A`" skip />
                                <p class=" text-nowrap">(if applicable).</p>
                            </div>

                        </div>
                        <div class="flex flex-col">
                            <div class="flex flex-row text-nowrap">
                                <p class=" tracking-widest">
                                    5. I am filing this AUSF at the Local Civil Registrar’s Office
                                    of</p>
                                <InputButtomBorder :error="v$.lcro_at.$error" v-model="formData.lcro_at" skip />
                                <p>in</p>

                            </div>
                            <div>
                                <p> accordance with R.A. No. 9255 and its Revised Implementing Rules and Regulations.
                                </p>
                            </div>
                        </div>
                        <div class="flex flex-col">
                            <div class="flex flex-row text-justify "> 6. I hereby certify that the statements made
                                herein are true
                                and
                                correct to
                                the
                                best of my
                                knowledge and belief.
                            </div>
                        </div>
                        <div class="flex flex-col">
                            <div class="flex flex-row text-justify">
                                <p class=" text-nowrap">7. In witness whereof, I have hereby affix my
                                    signature on this</p>
                                <InputButtomBorder :error="v$.day_signature.$error" v-model="formData.day_signature"
                                    skip :width="'6.2rem'" />
                                <p class=" text-nowrap">day of</p>
                                <InputButtomBorder :error="v$.month_signature.$error" v-model="formData.month_signature"
                                    skip :width="'6.2rem'" />.
                            </div>
                        </div>
                    </div>

                    <div class="mt-5 flex flex-col w-[50%] self-end items-center ">
                        <InputButtomBorder :error="v$.affiant_name.$error" v-model.capitalize="formData.affiant_name"
                            skip isBold />
                        <p class="text-gray-700 text-md">Signature over printed name of Affiant</p>
                    </div>

                    <div class="mt-10 px-10 ">
                        <div class="flex flex-row gap-2 w-full items-center text-nowrap">
                            <p class=" indent-12 text-gray-700 text-md"> SUBSCRIBED AND SWORN to before me this</p>
                            <InputButtomBorder :error="v$.sworn_day.$error" v-model="formData.sworn_day" skip
                                :width="'13rem'" />
                            <p class=" text-gray-700 text-md">day of</p>
                            <InputButtomBorder :error="v$.sworn_month.$error" v-model="formData.sworn_month" skip />
                            <p class=" text-gray-700 text-md">in</p>
                            <p class=" text-gray-700 text-md"> the</p>
                        </div>
                        <div class="flex flex-row gap-2 w-full items-center text-nowrap">
                            <p class=" text-gray-700 text-md">city/municipality of</p>
                            <InputButtomBorder :error="v$.sworn_at.$error" v-model="formData.sworn_at" skip />
                            <p class=" text-gray-700 text-md">, affiant exhibiting his/</p>
                        </div>
                        <div class="flex flex-row gap-2 w-full items-center text-nowrap">
                            <InputButtomBorder v-model="formData.exhibiting" skip />
                            <InputButtomBorder v-model="formData.exhibiting_number" :width="'50%'" />
                            <p class=" text-gray-700 text-md">issued at</p>
                            <InputButtomBorder v-model="formData.exhibiting_at" skip />
                            <p class=" text-gray-700 text-md">on</p>
                        </div>
                        <div class="flex flex-row gap-2 w-full items-center text-nowrap">
                            <InputButtomBorder v-model="formData.exhibiting_on" skip />
                            <p class=" text-gray-700 text-md text-justify">. I certify that I personally examined the
                                affiant and
                                that he
                                voluntarily
                                executed</p>
                        </div>
                        <div class="flex flex-row gap-2 w-full items-center text-nowrap">
                            <p class=" text-gray-700 text-md">the foregoing affidavit and understood the contents
                                thereof.</p>
                        </div>
                    </div>
                </div>
            </div>
            <template v-slot:footer>
                <div class="items-center text-nowrap">
                    <p class="text-gray-500 font-normal text-xs " v-if="!previewUrl"><span
                            class="font-bold">Note:</span> What
                        you
                        see on
                        screen is not
                        the final
                        output. Click 'Check' to preview the actual result.
                    </p>
                    <p class="text-gray-500 font-normal text-xs " v-if="previewUrl">This is a preview of the output</p>
                </div>
                <div class="h-full flex items-center justify-end gap-2 w-full">
                    <Button label="Edit" v-if="previewUrl" @click="previewUrl = ''" />
                    <Button v-if="!previewUrl" :label="'Check'" @click="check" />
                    <Button v-if="previewUrl" :label="'Submit'" @click="submit" />

                </div>
            </template>
        </Modal>

    </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import Modal from '../../components/client/modal/Modal.vue';
import Header from '../../components/essentials/header.vue';
import Button from '../../components/essentials/buttons/Button.vue';
import ModalCloseButton from '../../components/client/modal/ModalCloseButton.vue';
import InputforForm from '../../component/FormPageComponents/InputforForm.vue';
import InputButtomBorder from '../../components/essentials/inputs/InputButtomBorder.vue';
import { format } from 'date-fns';
import { useAusf } from '../../stores/Ausf';
import TableGrid from '../../components/TableGrid.vue';
import TableAction from '../../components/essentials/action/TableAction.vue';
import { AuthStore } from '../../stores/clientAuth';
import { useVuelidate } from "@vuelidate/core";
import { required, requiredIf, numeric } from "@vuelidate/validators";
import PDFViewer from '../../components/PDFViewer.vue';


const aufs_ = useAusf()
const auth = AuthStore()

onMounted(() => {
    aufs_.getAUSF()
    auth.isAuthenticated()
})


const previewUrl = ref() //PDF Base64
const ausf_modal = ref(false)


const date = new Date()
const year = date.getFullYear()
const month = date.getMonth()

const age = ref()
const age_text = ref('yrs. old')

const colDefs = ref([
    {
        field: "affiant_name",
        headerName: "Affiant's Name",
        flex: 2,
        filter: true,
        pinned: "left",
        lockPinned: true,
    },
    {
        field: "surname",
        headerName: "Surname",
        flex: 2,
        cellClass: "font-medium tracking-wider w-full text-gray-800",
        filter: true,
    },
    {
        field: "child_name",
        headerName: "Child's Name",
        flex: 2,
        filter: true,
    },
    {
        field: "relation",
        headerName: "Relation",
        flex: 2,
        filter: true,
    },
    {
        field: "date_birth",
        headerName: "Date of Birth",
        flex: 2,
        filter: true,
    },
    {
        field: "sworn_month",
        headerName: "Date Filed",
        flex: 2,
        filter: true,
    },
    {
        field: "created_by_user.username",
        headerName: "Created by",
        flex: 2,
        filter: true,
    },
    {
        headerName: "",
        flex: 1,
        pinned: "right",
        lockPinned: true,
        resizable: false,
        cellRenderer: TableAction,
        cellStyle: { overflow: "visible", border: "none" },
        sortable: false,
    },

]);

const initalForm = {
    created_by: auth.user_id,
    registry_number: `${year} -`,
    date_registration: `${format(date, 'MMMM')}      , ${year}`,
    affiant_name: '',
    citizenship: 'Filipino',
    age: '',
    address: '',
    surname: '',
    in_my_the: 'the',
    child_name: '',
    relation: '',
    date_birth: '',
    at_municipality: 'Bayambang',
    at_province: 'Pangasinan',
    at_country: 'Philippines',
    lcro_at: 'Bayambang, Pangasinan',
    day_signature: `${format(date, 'do')}`,
    month_signature: `${format(date, 'MMMM')} ${year}`,
    sworn_day: `${format(date, 'do')}`,
    sworn_month: `${format(date, 'MMMM')} ${year}`,
    sworn_at: 'Bayambang, Pangasinan',
    exhibiting: 'Community Tax Certificate No.',
    exhibiting_number: '',
    exhibiting_at: 'Bayambang, Pangasinan',
    exhibiting_on: `${format(date, 'MMMM dd, yyyy')}`,
    ap_phi_registry_number: '',
    ap_phi_date_registration: '',
    pfsp_of: ''
}
const formData = reactive({ ...initalForm })


const rules = computed(() => ({
    created_by: { required },
    date_registration: { required },
    affiant_name: { required },
    citizenship: { required },
    age: { required },
    address: { required },
    surname: { required },
    in_my_the: { required },
    child_name: { required },
    relation: { required },
    date_birth: { required },
    at_municipality: { required },
    at_province: { required },
    at_country: { required },
    lcro_at: { required },
    day_signature: { required },
    month_signature: { required },
    sworn_day: { required },
    sworn_month: { required },
    sworn_at: { required },
    day_signature: { required },
    month_signature: { required },
}))

const v$ = useVuelidate(rules, formData);



function change_age_full() {
    formData.age = age.value + ' ' + age_text.value
}
const open_ausf = () => {
    ausf_modal.value = true
}
const close_ausf = () => {
    ausf_modal.value = false
    previewUrl.value = ''
    Object.assign(formData, initalForm);
    age.value = ''
    age_text.value = 'yrs. old'
}

const document_status = ref(false)

const check = async () => {
    const isFormValid = await v$.value.$validate();
    console.log(v$.value)
    if (!isFormValid) {
        return
    }
    const create = await window.AusfApi.createAUSF({ ...formData })
    previewUrl.value = 'data:application/pdf;filename=generated.pdf;base64,' + create.dataurl
}

const submit = async () => {
    const isFormValid = await v$.value.$validate();

    if (isFormValid) {
        const add = aufs_.addAusf({ ...formData })
        if (add) {
            document_status.value = true
        }
    }
}

</script>

<style lang="scss" scoped></style>
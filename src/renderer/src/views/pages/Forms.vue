<template>
    <div class="flex flex-col relative justify-center w-full p-10 ">
        <!-- <Header label="Local Civil Registry Forms">
            <BtnDrop label="Create" :options="options" @open-modal="OpenForms" />
        </Header> -->

        <Header label="LOCAL CIVIL REGISTRY FORMS">
            <div class="w-full gap-2 flex flex-row items-center justify-center">
                <BtnDrop label="Create New" :options="options" @open-modal="OpenForms" />
                <button
                    class="rounded-md border border-gray-300 px-3 py-1 hover:bg-gray-100 transition-all duration-200 text-gray-700 shadow active:scale-95"><font-awesome-icon
                        icon="fa-solid fa-info" /></button>
            </div>
        </Header>


        <div class="h-[calc(100vh-200px)]">
            <div class="flex flex-row items-center justify-center">
                <div class="flex flex-col w-full py-2.5 gap-1 mb-6">
                    <p class="font-medium">Show Table </p>
                    <div class="flex flex-row gap-2 ml-5 items-center ">
                        <p class="text-xs text-neutral-600 font-medium w-32">Available Record</p>
                        <button
                            :class="[selectedForm === available ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700']"
                            class="rounded hover:bg-yellow-300  transition-all duration-300 px-2.5 text-xs font-medium"
                            v-for="available in available_forms" :key="available" @click="fetchFormData(available)">
                            {{ available }}
                        </button>
                    </div>
                    <div class="flex flex-row gap-2 ml-5 items-center ">
                        <p class="text-xs text-neutral-600 font-medium w-32">No Record</p>
                        <button
                            :class="[selectedForm === not_available ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700']"
                            class="rounded hover:bg-yellow-300  transition-all duration-300 px-2.5 text-xs font-medium"
                            v-for="not_available in no_record_forms" :key="not_available"
                            @click="fetchFormData(not_available)">
                            {{ not_available }}
                        </button>
                    </div>
                    <div class="flex flex-row gap-2 ml-5 items-center ">
                        <p class="text-xs text-neutral-600 font-medium w-32">Destroyed Record</p>
                        <button
                            :class="[selectedForm === destroyed ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700']"
                            class="rounded hover:bg-yellow-300  transition-all duration-300 px-2.5 text-xs font-medium"
                            v-for="destroyed in destroyed_forms" :key="destroyed" @click="fetchFormData(destroyed)">
                            {{ destroyed }}
                        </button>
                    </div>
                </div>


            </div>
            <!-- <p class="italic font-thin text-sm  font-mono">Table Here</p> -->

            <!-- <div class="h-full">
                <TableGrid :data="selectedFormData" :dataColumns="colDefs" :suppressRowTransform="true"
                    v-if="selectedForm !== null" />
            </div> -->

        </div>

        <Modal footerBG="bg-white" v-if="isFormOpen" :footer="false">
            <template v-slot:header>
                <div class="flex flex-row w-full">
                    <ControlButton :icon="['fas', 'arrow-left']" button-text="Return" @action="closeModal()" />

                    <div class="flex items-center flex-row gap-2 ml-auto">
                        <p class="text-sm font-medium text-white pr-4">Selected Form: </p>
                        <button @click="toggleForm(`${type}`)" v-for="type in FormTypes" :key="type"
                            :class="[selectedType === type ? 'text-white bg-green-500 ' : '']"
                            class="p-4 h-7 w-fit    hover:bg-green-600 transition-all duration-100 flex items-center text-sm justify-center  text-neutral-200 hover:text-neutral-300  rounded">
                            Form {{ type }}
                        </button>
                    </div>
                </div>
            </template>

            <div class="w-full h-full grid grid-cols-1 lg:grid-cols-[60%_40%]  py-1.5 bg-gray-200 overflow-y-auto">
                <!-- <div class="absolute w-[20rem] right-0">
                    {{ main_form }}
                </div> -->


                <!-- Page 1, Main Page -->
                <div class="flex flex-col gap-1 px-4 py-10">
                    <div class="flex items-center justify-end">
                        <div class="w-[15rem]">
                            <InputforForm middle width="full" bold v-model="transactions.date_filed" />
                        </div>

                    </div>
                    <p class="px-9 italic font-semibold font-serif">TO WHOM IT MAY CONCERN:</p>

                    <div class="flex flex-col gap-2 " v-if="selectedType.includes('A')">

                        <div class="">
                            <p class=" relative text-pretty  tracking-widest indent-8 leading-8 text-gray-900">We
                                certify that among others, the following facts of {{ fact_of }} appear in our Register
                                of {{
                                    register_of }} on page
                                <InputforForm type="number" middle width="6rem" bold v-model="available.page_number" />
                                of book number
                                <InputforForm type="number" middle width="6rem" bold v-model="available.book_number" />
                                .
                            </p>
                        </div>
                        <!-- For Form 3A -->
                        <div v-if="selectedType === '3A'" class="flex flex-col mt-4 gap-2 w-full">
                            <InputLabel label="Name" twoInput>
                                :
                                <InputforForm width="100%" v-model="Form3A.groom_name" />
                                :
                                <InputforForm width="100%" v-model="Form3A.bride_name" />
                            </InputLabel>
                            <InputLabel label="Age" twoInput>
                                :
                                <InputforForm width="100%" v-model="Form3A.groom_age" />
                                :
                                <InputforForm width="100%" v-model="Form3A.bride_age" />
                            </InputLabel>

                            <InputLabel label="Citizenship" twoInput>
                                :
                                <InputforForm width="100%" v-model="Form3A.groom_citizenship" />
                                :
                                <InputforForm width="100%" v-model="Form3A.bride_citizenship" />
                            </InputLabel>

                            <InputLabel label="Civil Status" twoInput>
                                :
                                <InputforForm width="100%" v-model="Form3A.groom_civil_status" />
                                :
                                <InputforForm width="100%" v-model="Form3A.bride_civil_status" />
                            </InputLabel>
                            <InputLabel label="Mother" twoInput>
                                :
                                <InputforForm width="100%" v-model="Form3A.groom_mother" />
                                :
                                <InputforForm width="100%" v-model="Form3A.bride_mother" />
                            </InputLabel>

                            <InputLabel label="Father" twoInput>
                                :
                                <InputforForm width="100%" v-model="Form3A.groom_father" />
                                :
                                <InputforForm width="100%" v-model="Form3A.bride_father" />
                            </InputLabel>
                        </div>

                        <div class="mt-4"></div>
                        <!-- Required for Available Form -->
                        <InputLabel label="Registry Number">
                            :
                            <InputforForm width="100%" v-model="available.registry_number" />
                        </InputLabel>

                        <InputLabel label="Date of Registration">
                            :
                            <InputforForm width="100%" v-model="available.date_registration" />
                        </InputLabel>

                        <div v-if="selectedType === '3A'" class="flex flex-col mt-auto gap-2">
                            <InputLabel label="Date of Marriage">
                                :
                                <InputforForm width="100%" v-model="Form3A.date_marriage" />

                            </InputLabel>
                            <InputLabel label="Place of Marriage">
                                :
                                <InputforForm width="100%" v-model="Form3A.place_marriage" />

                            </InputLabel>

                        </div>

                        <!-- For Form 1A -->
                        <div v-if="selectedType === '1A'" class="flex flex-col  gap-2">
                            <InputLabel label="Name of Child">
                                :
                                <InputforForm width="100%" v-model="Form1A.name_child" />
                            </InputLabel>
                            <InputLabel label="Sex">
                                :
                                <InputforForm width="100%" v-model="Form1A.sex" />
                            </InputLabel>
                            <InputLabel label="Date of birth">
                                :
                                <InputforForm width="100%" v-model="Form1A.date_birth" />
                            </InputLabel>
                            <InputLabel label="Place of birth">
                                :
                                <InputforForm width="100%" v-model="Form1A.place_birth" />
                            </InputLabel>
                            <InputLabel label="Name of Mother">
                                :
                                <InputforForm width="100%" v-model="Form1A.name_mother" />
                            </InputLabel>
                            <InputLabel label="Citizenship of Mother">
                                :
                                <InputforForm width="100%" v-model="Form1A.citizenship_mother" />
                            </InputLabel>
                            <InputLabel label="Name of Father">
                                :
                                <InputforForm width="100%" v-model="Form1A.name_father" />
                            </InputLabel>
                            <InputLabel label="Citizenship of Father">
                                :
                                <InputforForm width="100%" v-model="Form1A.citizenship_father" />
                            </InputLabel>
                            <InputLabel label="Date of Marriage">
                                :
                                <InputforForm width="100%" v-model="Form1A.date_marriage_parents" />
                            </InputLabel>
                            <InputLabel label="Place of Marriage of parents">
                                :
                                <InputforForm width="100%" v-model="Form1A.place_marriage_parents" />
                            </InputLabel>
                        </div>
                        <!-- For Form 2A -->
                        <div v-if="selectedType === '2A'" class="flex flex-col mt-auto gap-2">
                            <InputLabel label="Name of deceased">
                                :
                                <InputforForm width="100%" v-model="Form2A.name_deceased" />
                            </InputLabel>
                            <InputLabel label="Sex">
                                :
                                <InputforForm width="100%" v-model="Form2A.sex" />
                            </InputLabel>
                            <InputLabel label="Age">
                                :
                                <InputforForm width="100%" v-model="Form2A.deceased_age" />
                            </InputLabel>
                            <InputLabel label="Civil Status">
                                :
                                <InputforForm width="100%" v-model="Form2A.deceased_civil_status" />
                            </InputLabel>
                            <InputLabel label="Citizenship">
                                :
                                <InputforForm width="100%" v-model="Form2A.deceased_citizenship" />
                            </InputLabel>
                            <InputLabel label="Date of Death">
                                :
                                <InputforForm width="100%" v-model="Form2A.date_of_death" />
                            </InputLabel>

                            <InputLabel label="Place of Death">
                                :
                                <InputforForm width="100%" v-model="Form2A.place_of_death" />
                            </InputLabel>
                            <InputLabel label="Cause of Death">
                                :
                                <InputforForm width="100%" v-model="Form2A.cause_of_death" />
                            </InputLabel>
                        </div>



                    </div>

                    <!-- Forms with `B` -->
                    <div class="flex flex-col gap-2 mt-auto mb-auto" v-if="selectedType.includes('B')">

                        <div class="mt-10 px-10">
                            <p class="indent-8 text-pretty leading-10 tracking-wider text-justify">We certify that
                                this
                                office
                                has
                                no
                                record of {{ records_of }} of
                                <InputforForm width="15rem" middle v-model="formData.name_of" /> who
                                is
                                alleged
                                to have {{ alleged_to }} on
                                <InputforForm width="10rem" middle v-model="formData.date_of" /> in this
                                municipality, <span v-if="selectedType === '1B'"> of parents
                                    <InputforForm width="15rem" middle v-if="selectedType === '1B'" /> and
                                    <InputforForm width="15rem" v-if="selectedType === '1B'" middle />.
                                </span> Hence, we cannot issue,
                                as
                                requested, a true
                                copy of his/her Certificate of {{ register_of }} or transcription from the Register
                                of
                                {{ transcription_register_of }}.
                            </p>
                        </div>

                        <div class="mt-10 px-10 ">
                            <p class="indent-8 text-pretty tracking-wider text-justify"> We also certify that the
                                records of
                                {{ records_of }} for the year
                                <InputforForm width="6rem" middle v-model="formData.records_of_year" /> are
                                still
                                intact in the
                                archives of
                                this office.
                            </p>
                        </div>

                    </div>

                    <!-- Forms with `C` -->
                    <div class="flex flex-col gap-2 mt-auto mb-auto" v-if="selectedType.includes('C')">

                        <p class="indent-8 text-pretty leading-10 tracking-wider text-justify"> We certify that the
                            records
                            of
                            {{ records_of }}
                            filed in the archives of this office include those, which were registered from
                            <InputforForm width="6rem" middle v-model="formData.registered_from" /> to
                            present.
                            However, the records of {{ records_of }} during period
                            <InputforForm width="6rem" v-model="formData.period_from" />
                            to
                            <InputforForm width="6rem" v-model="formData.period_to" />
                            were totally destroyed by
                            <InputforForm width="20rem" v-model="formData.destroyed_by" />
                            Hence, we cannot issue as requested, a true transcription from the Register of
                            {{ register_of }} or
                            true
                            copy of the Certification of {{ register_of }} of
                            <InputforForm width="15rem" v-model="formData.name_of" /> who
                            is alleged
                            to have {{ alleged_to }} on
                            <InputforForm width="10rem" v-model="formData.date_of" /> in
                            this
                            municipality.
                        </p>

                    </div>
                </div>



                <!-- Page 2,  Other Side -->
                <!-- This is Required for all Forms -->
                <div class="flex flex-col gap-2 px-4 py-10">
                    <div class="flex items-center justify-center relative   text-nowrap">
                        This certification is issued to <div class="px-2">
                            <InputforForm width="15rem" middle bold v-model="transactions.certification_issued_to" />
                        </div> upon his/her request.
                    </div>



                    <div class="flex flex-col gap-2 " v-if="is_with_remarks">
                        <div class="flex flex-row gap-2 items-center">
                            <input type="checkbox" v-model="is_remarks_check" name="" id="remark_btn"
                                class="border rounded-sm border-gray-600">
                            <label for="remark_btn" class="text-md font-medium text-neutral-800">Add Remarks</label>
                        </div>
                        <!-- <p class="font-medium text-xs">Add Remarks</p> -->

                        <div class="flex  flex-col  py-2 w-full gap-2" v-if="is_remarks_check">
                            <p class="font-bold font-serif">REMARKS: </p>

                            <div class="w-full flex flex-col gap-1 bg-white">
                                <QuillEditor theme="snow" :toolbar="['bold', 'italic']"
                                    v-model:content="formData.remarks" />

                            </div>
                        </div>
                    </div>
                    <div class="mt-auto grid grid-cols-2   mb-4">
                        <!-- <div class="absolute -right-[15rem]">
                            <button class="text-xs text-blue-500 border rounded-sm p-2 hover:bg-white">
                                <p>
                                    ADD <span class="italic">"For and in the
                                        absence:"</span>
                                </p>
                            </button>
                        </div> -->
                        <div class="flex flex-col ">
                            <p class="italic mb-10">Verified by:</p>
                            <div class="pl-0 flex flex-col items-center gap-[0.10rem]">
                                <InputforForm skip width="100%" bold middle v-model="transactions.verified_by"
                                    @input="formData.verified_by = $event.target.value.toUpperCase()" />
                                <InputforForm skip width="100%" middle italic unbordered isTransparent
                                    v-model="transactions.verifier_position" />
                            </div>
                        </div>
                        <div class="flex flex-col items-center gap-[0.10rem]">
                            <!-- <p class="italic font-medium text-sm">For and in the absence of:</p> -->
                            <InputforForm skip middle width="100%" bold v-model="transactions.civil_registrar"
                                @input="formData.civil_registrar = $event.target.value.toUpperCase()" />
                            <InputforForm skip width="100%" middle italic unbordered isTransparent
                                v-model="transactions.civil_registrar_position" />
                            <!-- <div class="mt-10 flex flex-col items-center gap-[0.10rem] absolute top-20">
                                <InputforForm skip width="20rem" bold middle v-model="formData.verified_by"
                                    
                                    @input="formData.verified_by = $event.target.value.toUpperCase()" />
                                <InputforForm skip width="20rem" middle italic unbordered isTransparent
                                    v-model="formData.position"  />
                            </div> -->
                        </div>
                    </div>

                    <div class="flex flex-col gap-2  w-[50%]">
                        <InputLabel label="Amount Paid ">
                            <InputforForm width="100%" v-model="transactions.amount_paid" />
                        </InputLabel>

                        <InputLabel label="O.R. Number">
                            <InputforForm width="100%" v-model="transactions.or_number" />
                        </InputLabel>
                        <InputLabel label="Date Paid">
                            <InputforForm width="100%" v-model="transactions.date_paid" />
                        </InputLabel>
                    </div>
                    <div class="flex flex-row gap-2 p-4 border rounded items-center justify-center bg-gray-100 shadow">

                        <div class="flex flex-row gap-2 items-center" v-if="selectedType.includes('A')">
                            <input type="checkbox" v-model="available.is_with_authentication" name=""
                                id="with_authentication" class="border rounded-sm border-gray-600">
                            <label for="with_authentication" class="text-md font-medium text-neutral-800">With
                                Authentication</label>
                        </div>

                        <div class="ml-auto flex items-center justify-center gap-2">
                            <button
                                class="bg-white hover:bg-gray-100 border text-gray-800 px-4 font-medium  py-3.5 rounded-md "
                                @click="previewcontent">Preview</button>
                            <button @click="createForm()"
                                class="bg-blue-500 hover:bg-blue-600 text-white px-4 font-medium  py-3.5 rounded-md ">Create</button>

                        </div>
                    </div>

                </div>
            </div>


        </Modal>

    </div>
</template>

<script setup>
import { computed, defineAsyncComponent, onMounted, reactive, ref, watch } from 'vue'
import BtnDrop from '../../components/essentials/buttons/BtnDrop.vue'
import Header from '../../components/essentials/header.vue'

import InputforForm from '../../components/Form/InputforForm.vue'
import ButtonBorderless from '../../components/Form/ButtonBorderless.vue'
import FormCheckbox from '../../components/Form/FormCheckbox.vue'
import InputLabel from '../../components/Form/InputLabel.vue'

import { useVuelidate } from "@vuelidate/core";
import { required, requiredIf } from "@vuelidate/validators";
import { format } from 'date-fns'

import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { all_address, } from '../../utils/Address/index.js'
import SelectforForm from '../../components/Form/SelectforForm.vue';
import FormAutoComplete from '../../components/Form/FormAutoComplete.vue';
import Try from '../../components/try.vue';
import PDFViewerWorker from '../../components/PDFViewerWorker.vue';
import { useForms } from '../../stores/forms.js'
import TableGrid from '../../components/TableGrid.vue'
import ControlButton from '../../components/ControlButton.vue'
import FormInput from './FormInput.vue'
import { QuillEditor } from '@vueup/vue-quill'
import { useAvailableForm, useForm1A, useForm1B, useForm1C, useForm2A, useForm2B, useForm2C, useForm3A, useForm3B, useForm3C, useRegisteredPeriod, useTransactionDetails } from '../../lib/FormProps.js'


const transactions = reactive(useTransactionDetails)
const available = reactive(useAvailableForm)

// Form A's
const Form1A = reactive(useForm1A)
const Form2A = reactive(useForm2A)
const Form3A = reactive(useForm3A)

// Form B's
const Form1B = reactive(useForm1B)
const Form2B = reactive(useForm2B)
const Form3B = reactive(useForm3B)

// Form C's
const Form1C = reactive(useForm1C)
const Form2C = reactive(useForm2C)
const Form3C = reactive(useForm3C)


const selectedType = ref(null)

const createForm = () => {
    const type = selectedType.value;
    const formAvailableMapping = {
        '1A': Form1A,
        '2A': Form2A,
        '3A': Form3A
    };

    // Check if the type exists in the formMapping
    if (formAvailableMapping[type]) {
        const main_data = reactive({
            ...transactions,
            ...available,
            ...formAvailableMapping[type]
        });
        console.log(main_data);
    } else {
        console.log('Invalid form type selected');
    }
};





















































const all_ = ref(all_address())

const is_with_remarks = computed(() => {
    return formData.form_type.includes('A') ? true : false
})

const is_remarks_check = ref(false)


onMounted(() => {
    calculatePPI();
    fetchFormData('Form 1A')
});


const available_forms = ref(['Form 1A', 'Form 2A', 'Form 3A'])
const no_record_forms = ref(['Form 1B', 'Form 2B', 'Form 3B'])
const destroyed_forms = ref(['Form 1C', 'Form 2C', 'Form 3C'])

const selectedForm = ref(null)
const selectedFormData = ref(null)
const formsStore = useForms()

const fetchFormData = async (formType) => {
    selectedForm.value = formType
    let fetchAction

    switch (formType) {
        case 'Form 1A':
            fetchAction = formsStore.get_all_form1a
            break
        case 'Form 2A':
            fetchAction = formsStore.get_all_form2a
            break
        case 'Form 3A':
            fetchAction = formsStore.get_all_form3a
            break
        case 'Form 1B':
            fetchAction = formsStore.get_all_form1b
            break
        case 'Form 2B':
            fetchAction = formsStore.get_all_form2b
            break
        case 'Form 3B':
            fetchAction = formsStore.get_all_form3b
            break
        case 'Form 1C':
            fetchAction = formsStore.get_all_form1c
            break
        case 'Form 2C':
            fetchAction = formsStore.get_all_form2c
            break
        default:
            console.log('Unknown form type:', formType)
            return
    }

    try {
        await fetchAction()
        selectedFormData.value = formsStore[formType.toLowerCase().replace(' ', '')]
    } catch (error) {
        console.log(' fetching data:', error)
    }
}



const ppi = ref(0);

const calculatePPI = () => {
    const screenWidthPx = window.screen.width;
    const screenHeightPx = window.screen.height;

    const isPortrait = window.matchMedia("(orientation: portrait)").matches;
    const dpi = isPortrait ? 96 : 113;

    const widthInches = screenWidthPx / dpi;
    const heightInches = screenHeightPx / dpi;

    const ppiValue = Math.sqrt((screenWidthPx ** 2) + (screenHeightPx ** 2)) / Math.sqrt((widthInches ** 2) + (heightInches ** 2));
    ppi.value = Math.round(ppiValue);
};

const paper_height = computed(() => {
    return formData.form_type.includes('A') ? 13 : 11
})

const paperDimensions = computed(() => ({
    width: 8.5 * ppi.value,
    height: paper_height * ppi.value,
}));

const paperStyle = computed(() => ({
    height: `${paperDimensions.value.height}px`,
    width: `${paperDimensions.value.width}px`,
}));



const isLoading = ref(false)
const Modal = defineAsyncComponent(() =>
    import("../../components/client/modal/Modal.vue")
)
const options = ref(
    [
        'Form 1 (Birth)',
        'Form 2 (Death)',
        'Form 3 (Marriage)'
    ]
)

const date_marriage_parents_options = [
    'Not Married',
    'Not Applicable',
    'Forgotten',
    'No Column',
    'No Entry',
]


const FormTypes = ref([])
const isFormOpen = ref(false)
const print = ref()
const date_marriage_option = ref(false)


const name_of = computed(() => {
    return selectedType.value === "1A" ? 'Name of Child' : selectedType.value === "2A" ? 'Name of Deceased' : selectedType.value === "3A" ? 'Name' : ''
})
const fact_of = computed(() => {
    const selected = selectedType.value
    return selected === "1A" || selected === "1B" || selected === "1C" ? 'birth' :
        selected === "2A" || selected === "2B" || selected === "2C" ? 'death' :
            selected === "3A" || selected === "3B" || selected === "3C" ? 'marriage' : ''
})
const transcription_register_of = computed(() => {
    const selected = selectedType.value
    return selected === "1A" || selected === "1B" || selected === "1C" ? 'Births' :
        selected === "2A" || selected === "2B" || selected === "2C" ? 'Deaths' :
            selected === "3A" || selected === "3B" || selected === "3C" ? 'Marriages' : ''
})
const records_of = computed(() => {
    const selected = selectedType.value
    return selected === "1A" || selected === "1B" || selected === "1C" ? 'births' :
        selected === "2A" || selected === "2B" || selected === "2C" ? 'deaths' :
            selected === "3A" || selected === "3B" || selected === "3C" ? 'marriages' : ''
})
const register_of = computed(() => {
    const selected = selectedType.value
    return selected === "1A" || selected === "1B" || selected === "1C" ? 'Live Birth' :
        selected === "2A" || selected === "2B" || selected === "2C" ? 'Death' : selected === "3A" || selected === "3B" || selected === "3C" ? 'Marriage' : ''
})
const alleged_to = computed(() => {
    const selected = selectedType.value
    return selected === "1A" || selected === "1B" || selected === "1C" ? 'born' :
        selected === "2A" || selected === "2B" || selected === "2C" ? 'died' : selected === "3A" || selected === "3B" || selected === "3C" ? 'married' : ''
})


const date_filed = ref(new Date())
const date_registration = ref()
const date_of = ref()
const date_marriage = ref()
const date_paid = ref(new Date())



const preferences = reactive({
    civil_x: '0.3',
    civil_y: '0.3',
    info_x: '1.3',
    info_y: '3.7',
    certificate_x: '2.3',
    certificate_y: '8.8',
    authenticate_position_y: '3.5'
})

const initialFormData = {

    is_with_authentication: '', // Is Abroad??

    date_filed: format(new Date(), "MMMM dd, yyyy"),
    page_number: '',
    book_number: '',


    registry_number: '',
    date_registration: '',

    name_child: '',
    sex: '',
    date_birth: '',
    place_birth: '',
    name_mother: '',
    citizenship_mother: '',
    name_father: '',
    citizenship_father: '',
    date_marriage_parents: '',
    place_marriage_parents: '',

    certification_issued_to: '',
    remarks: '',
    verified_by: 'ERIKA JOYCE B. PARAGAS',
    verifier_position: 'Registration Officer I',
    civil_registrar: 'ISMAEL D. MALICDEM, JR.',
    civil_registrar_position: 'Municipal Civil Registrar',
    created_by: 1,

    amount_paid: 'Php 130.00',
    or_number: '',
    date_paid: format(new Date(), "MMMM dd, yyyy"),

    // isWithAuthenticatedForm: false,
    // isWithRemarks: false,
    // form_type: '',
    // date_filed: format(new Date(), "MMMM dd, yyyy"),

    // // ALL FORM  WITHIN "A" HAVE THIS
    // page_number: '',
    // book_number: '',


    // registry_number: '',
    // date_registration: '',
    // name_of: '',
    // sex: '',
    // date_of: '',
    // place_of: '',
    // name_of_mother: '',
    // citizenship_mother: 'Filipino',
    // name_of_father: '',
    // citizenship_father: 'Filipino',
    // date_marriage: '',
    // place_of_marriage_parents: '',


    // age: '',
    // civil_status: '',
    // citizenship: '',
    // cause_of_death: '',

    // records_of_year: '',

    // registered_from: '',
    // period_from: '',
    // period_to: '',
    // destroyed_by: '',


    // remarks: '',

    // issued_to: '',
    // verified_by: 'ERIKA JOYCE B. PARAGAS',
    // position: 'Registration Officer I',

    // mcr: 'ISMAEL D. MALICDEM, JR.',

    // amount_paid: 'Php 130.00',
    // or_number: '',
    // date_paid: format(new Date(), "MMMM dd, yyyy"),
}

const formData = reactive({ ...initialFormData })

function resetFormData() {
    Object.assign(formData, initialFormData);
}

const submit = async () => {

    const add = await formsStore.add_form1a(formData)
    // const isFormValid = await v$.value.$validate();

    // if (isFormValid) {
    //     try {

    //         const dataToSubmit = {
    //             ...formData,
    //             ...preferences,
    //             purpose: 'edit'
    //         };

    //         const open = await window.FormApi.createPdfForm(dataToSubmit)
    //         console.log(open)

    //         if (open.status) {
    //             const openFolder = await window.FormApi.openPdfForm(open.filepath)
    //         }
    //     } catch () {
    //         console.(' submitting form:', );
    //     }
    // } else {
    //     console.log('Form has validation s:', v$.value.$s);
    // }
}

const OpenForms = (e) => {
    e === 'Form 1 (Birth)' ? [FormTypes.value = ['1A', '1B', '1C'], selectedType.value = "1A", formData.form_type = "1A"] : e === 'Form 2 (Death)' ? [FormTypes.value = ['2A', '2B', '2C'], selectedType.value = "2A", formData.form_type = "2A"] : e === 'Form 3 (Marriage)' ? [FormTypes.value = ['3A', '3B', '3C'], selectedType.value = "3A", formData.form_type = "3A"] : null
    isFormOpen.value = true
    selectedForm.value = e

}
const closeModal = () => {
    isFormOpen.value = false

    resetFormData()
    isPreview.value = false

}
const toggleForm = (val) => {
    resetFormData()
    selectedType.value = val
    formData.form_type = val
    nodateforparentsmarriage.value = false

}




const isPreview = ref(false)
const previewUrl = ref('')

const previewcontent = async () => {
    isPreview.value = !isPreview.value
    if (isPreview) {
        const dataToSubmit = {
            ...formData,
            ...preferences,
            purpose: 'edit'
        };

        const open = await window.FormApi.createPdfForm(dataToSubmit)
        console.log(open)
        previewUrl.value = open.dataurl

    }
    else {
        previewUrl.value = null
    }
}

const change_preferences = async () => {
    if (isPreview) {
        const dataToSubmit = {
            ...formData,
            ...preferences,
            purpose: 'edit'
        };

        const open = await window.FormApi.createPdfForm(dataToSubmit)
        previewUrl.value = open.dataurl
    }
}


const nodateforparentsmarriage = ref(false)
const parentsdatemarriage_opt = (val) => {
    nodateforparentsmarriage.value = true
    formData.date_marriage = val
    formData.place_of_marriage_parents = 'Not Applicable'

    date_marriage_option.value = false
}


const remarks = ref()
const addremarksvalue = () => {
    remarks.value.focus()
}


const colDefs = ref([
    {
        field: "name_child",
        headerName: "Document Owner",
        flex: 2,
        filter: true,
        cellStyle: { border: "none" },
        pinned: "left",
        width: 200,
        lockPinned: true,
        resizable: true,
        sortable: false,
    },
    {
        field: "date_filed",
        headerName: "Date Filed",
        filter: true,
    },
    {
        field: "registry_number",
        headerName: "Registry Number",
        filter: true,
    },
    {
        field: "date_registration",
        headerName: "Date Registration",
        filter: true,
    },

    {
        field: "date_birth",
        headerName: "Date of Birth",
        filter: true,
    },
    {
        field: "place_birth",
        headerName: "Place of Birth",
        filter: true,
    },
    {
        field: "created_by",
        headerName: "Created By",
        filter: true,
    },
    {
        field: "",
        headerName: "Action",
        filter: false,
        cellStyle: { border: "none" },
        pinned: "right",
        width: 200,
        flex: 2,
        lockPinned: true,
        resizable: true,
        sortable: false,
    },



]);

</script>
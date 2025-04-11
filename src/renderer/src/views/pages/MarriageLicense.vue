<template>
    <div class="flex flex-col relative justify-center w-full p-10">
        <Header label="APPLICATION FOR MARRIAGE LICENSE">
            <div class="w-full gap-2 flex flex-row items-center justify-center">
                <Button label="Create New Application" isActive :class="`rounded`" @click="open_model" />
                <button
                    class="rounded-md border border-gray-300 px-3 py-1 hover:bg-gray-100 transition-all duration-200 text-gray-700 shadow active:scale-95"><font-awesome-icon
                        icon="fa-solid fa-info" /></button>
            </div>
        </Header>

        <div class="h-[calc(100vh-200px)]">
            <TableGrid :data="apl.application_marriage_license" :dataColumns="colDefs" :suppressRowTransform="true" />
        </div>

        <div v-if="modal"
            class="fixed top-0 bottom-0 left-0 p-4  right-0 w-full h-full flex items-center justify-center z-50 backdrop-blur-sm backdrop-brightness-50"
            tabindex="-1" role="dialog">
            <div class="w-full max-w-screen-lg h-[42rem] flex flex-col bg-white rounded-lg p-2 relative">
                <button @click="close_modal"
                    class="absolute right-0 top-0 rounded-bl-full w-10 h-10  bg-red-400 hover:bg-red-500 flex items-center justify-end px-2 text-white"><font-awesome-icon
                        icon="fa-solid fa-xmark" />
                </button>
                <div class="flex items-center justify-center mb-5">
                    <h2 class="font-medium text-lg uppercase text-gray-800">Application for Marriage License</h2>
                </div>


                <div class="flex flex-row gap-0 mb-4 px-2">
                    <div class="flex flex-col gap-0">
                        <p class="font-bold text-lg uppercase  text-blue-500 leading-3">{{ steps[currentStep] }}</p>
                        <p class=" text-xs text-gray-400 text-semibold uppercase">Please provide {{ steps[currentStep]
                        }}
                        </p>
                    </div>
                    <div class="flex flex-row gap-1 ml-auto">
                        <button class="bg-green-300 text-xs w-8 h-8 px-2 font-medium  rounded-full text-white   py-1.5"
                            v-for="(step, index) in steps" :key="index" @click="currentStep = index"
                            :class="[currentStep >= index ? 'bg-green-500' : '']">
                            {{ index + 1 }}
                        </button>
                    </div>
                </div>

                <div class="flex-1 overflow-y-auto py-2 ">
                    <div v-if="currentStep === 0" class="flex flex-col px-10 mt-auto justify-center">

                        <div class="grid grid-cols-1 gap-2 ">

                            <div class="grid grid-cols-3 gap-2">
                                <InputMarriage type="date" label="Date of Application"
                                    v-model="formData.date_of_application" />
                                <InputMarriage type="date" label="Date of Marriage"
                                    v-model="formData.date_of_receipt" />
                                <InputMarriage type="date" label="Date of Issuance of Marriage License"
                                    v-model="formData.date_issuance_marriage_license" />
                            </div>
                            <div class="grid grid-cols-2 gap-2">
                                <InputMarriage label="Marriage License No" v-model="formData.marriage_license_number" />
                                <InputMarriage label="Place of Marriage" v-model="formData.place_of_marriage" />
                            </div>
                        </div>




                    </div>

                    <div v-if="currentStep === 1" class="flex flex-col px-10 justify-center  ">
                        <div class="grid grid-cols-1 gap-2">

                            <div class="grid grid-cols-3 gap-1 items-end">
                                <InputMarriage cap label="Full Name" holder="First Name"
                                    v-model="formData.groom_first_name" />
                                <InputMarriage cap holder="Middle Name" v-model="formData.groom_middle_name" />
                                <InputMarriage cap holder="Last Name" v-model="formData.groom_last_name" />
                            </div>

                            <div class="flex flex-row items-center gap-2">

                                <div class="w-full">
                                    <InputMarriage type="date" label="Date of Birth" holder="MMMM/DD/YYYY"
                                        v-model="formData.groom_date_birth" @change="calculateAge('groom')" />


                                </div>
                                <div class="w-[70%]">
                                    <InputMarriage label="Age" skip type="number" v-model="formData.groom_age" />
                                </div>
                            </div>

                            <div class="grid grid-cols-3 gap-1 items-end">
                                <InputMarriage cap label="Place of Birth" holder="City/Municipality"
                                    v-model="formData.groom_municipality" />
                                <InputMarriageSuggestion cap holder="Province" v-model="formData.groom_province"
                                    :suggestion_data="province" />
                                <InputMarriage cap holder="Country" skip v-model="formData.groom_country" />
                            </div>
                            <div class="flex flex-row gap-1 items-end">
                                <InputMarriage cap label="Residence"
                                    holder="(House No., St., Barangay, City/Municipality, Province)"
                                    v-model="formData.groom_residence" />
                                <div class="w-[50%]">
                                    <InputMarriage cap holder="Country" skip
                                        v-model="formData.groom_residence_country" />
                                </div>
                            </div>
                            <div class="flex flex-row items-center gap-2">

                                <div class="w-full">
                                    <InputMarriage cap label="Sex" v-model="formData.groom_sex" />

                                </div>
                                <div class="w-full">
                                    <InputMarriage cap label="Citizenship" v-model="formData.groom_citizenship" />

                                </div>
                                <div class="w-[70%]">
                                    <InputMarriage cap label="Civil Status" v-model="formData.groom_civil_status" />
                                </div>
                            </div>
                            <div class="flex flex-row items-center gap-2"
                                v-if="formData.groom_civil_status !== 'SINGLE' && formData.groom_civil_status !== ''">
                                <InputMarriage cap label="IF PREVIOUSLY MARRIED: How was it dissolved?" />
                                <div class="w-[70%]">
                                    <InputMarriage cap type="date" label="Date when dissolved" />
                                </div>
                            </div>

                            <div class="grid grid-cols-3 gap-2 items-end"
                                v-if="formData.groom_civil_status !== 'SINGLE' && formData.groom_civil_status !== ''">
                                <InputMarriage cap label="Place where dissolved" holder="City/Municipality"
                                    v-model="formData.groom_first_name" />
                                <InputMarriage cap holder="Province" />
                                <InputMarriage cap holder="Country" />

                            </div>



                            <div class="grid grid-cols-2 gap-2">
                                <InputMarriage cap label="Religion" v-model="formData.groom_religion" />
                                <InputMarriage cap label="Degree of relationship of contradicting parties"
                                    v-model="formData.groom_degree_relation" />


                            </div>

                        </div>
                    </div>

                    <div v-if="currentStep === 2" class="flex flex-col gap-2 px-10 justify-center">
                        <div class="grid grid-cols-3 gap-1 items-end">
                            <InputMarriage cap label="Name of Father" holder="First Name"
                                v-model="formData.groom_father_first_name" />
                            <InputMarriage cap holder="Middle Name" v-model="formData.groom_father_middle_name" />
                            <InputMarriage cap holder="Last Name" v-model="formData.groom_father_last_name" />
                        </div>
                        <div class="flex flex-row gap-1 items-end">
                            <div class="w-[50%]">
                                <InputMarriage cap label="Citizenship" v-model="formData.groom_father_citizenship" />
                            </div>
                            <InputMarriage cap label="Residence"
                                holder="(House No., St., Barangay, City/Municipality, Province)"
                                v-model="formData.groom_father_residence" />
                            <div class="w-[50%]">
                                <InputMarriage cap holder="Country" v-model="formData.groom_father_residence_country" />
                            </div>
                        </div>
                        <div class="grid grid-cols-3 gap-1 items-end">
                            <InputMarriage cap label="Maiden Name of Mother" holder="First Name"
                                v-model="formData.groom_mother_first_name" />
                            <InputMarriage cap holder="Middle Name" v-model="formData.groom_mother_middle_name" />
                            <InputMarriage cap holder="Last Name" v-model="formData.groom_mother_last_name" />
                        </div>
                        <div class="flex flex-row gap-1 items-end">
                            <div class="w-[50%]">
                                <InputMarriage cap label="Citizenship" v-model="formData.groom_mother_citizenship" />
                            </div>
                            <InputMarriage cap label="Residence"
                                holder="(House No., St., Barangay, City/Municipality, Province)"
                                v-model="formData.groom_mother_residence" />
                            <div class="w-[50%]">
                                <InputMarriage cap holder="Country" v-model="formData.groom_mother_residence_country" />
                            </div>
                        </div>

                        <div class="flex flex-row gap-1">
                            <InputMarriage cap label="Person who gave consent"
                                v-model="formData.groom_person_who_gave_consent" />
                            <div class="w-[50%]">
                                <InputMarriage cap label="Relationship"
                                    v-model="formData.groom_person_who_gave_consent_relation" />
                            </div>
                        </div>
                        <div class="flex flex-row gap-1 items-end">
                            <div class="w-[50%]">
                                <InputMarriage cap label="Citizenship"
                                    v-model="formData.groom_person_who_gave_consent_citizenship" />
                            </div>
                            <InputMarriage cap label="Residence"
                                holder="(House No., St., Barangay, City/Municipality, Province, Country)"
                                v-model="formData.groom_person_who_gave_consent_residence" />

                        </div>

                    </div>

                    <div v-if="currentStep === 3" class="flex flex-col px-10 justify-center">
                        <div class="grid grid-cols-1 gap-2">

                            <div class="grid grid-cols-3 gap-1 items-end">
                                <InputMarriage cap label="Full Name" holder="First Name" />
                                <InputMarriage cap holder="Middle Name" />
                                <InputMarriage cap holder="Last Name" />
                            </div>

                            <div class="flex flex-row items-center gap-2">

                                <div class="w-full">
                                    <InputMarriage cap type="date" label="Date of Birth" holder="MMMM/DD/YYYY"
                                        v-model="formData.bride_date_birth" @change="calculateAge('bride')" />

                                </div>
                                <div class="w-[70%]">
                                    <InputMarriage cap label="Age" skip type="number" v-model="formData.bride_age" />
                                </div>
                            </div>

                            <div class="grid grid-cols-3 gap-1 items-end">
                                <InputMarriage cap label="Place of Birth" holder="City/Municipality" />
                                <InputMarriage cap holder="Province" />
                                <InputMarriage cap holder="Country" />
                            </div>
                            <div class="flex flex-row items-center gap-2">

                                <div class="w-full">
                                    <InputMarriage cap label="Citizenship" />

                                </div>
                                <div class="w-[70%]">
                                    <InputMarriage cap label="Civil Status" />
                                </div>
                            </div>
                            <div class="flex flex-row gap-1 items-end">
                                <InputMarriage cap label="Residence"
                                    holder="(House No., St., Barangay, City/Municipality, Province)" />
                                <div class="w-[50%]">
                                    <InputMarriage cap holder="Country" />
                                </div>
                            </div>
                            <InputMarriage cap label="Religion" />


                        </div>
                    </div>

                    <div v-if="currentStep === 4" class="flex flex-col gap-2 px-10 justify-center">
                        <div class="grid grid-cols-3 gap-1 items-end">
                            <InputMarriage cap label="Name of Father" holder="First Name" />
                            <InputMarriage cap holder="Middle Name" />
                            <InputMarriage cap holder="Last Name" />
                        </div>
                        <div class="flex flex-row gap-1 items-end">
                            <InputMarriage cap label="Residence"
                                holder="(House No., St., Barangay, City/Municipality, Province)" />
                            <div class="w-[50%]">
                                <InputMarriage cap holder="Country" />
                            </div>
                        </div>
                        <div class="grid grid-cols-3 gap-1 items-end">
                            <InputMarriage cap label="Maiden Name of Mother" holder="First Name" />
                            <InputMarriage cap holder="Middle Name" />
                            <InputMarriage cap holder="Last Name" />
                        </div>
                        <div class="flex flex-row gap-1 items-end">
                            <InputMarriage cap label="Residence"
                                holder="(House No., St., Barangay, City/Municipality, Province)" />
                            <div class="w-[50%]">
                                <InputMarriage cap holder="Country" />
                            </div>
                        </div>

                        <div class="flex flex-row gap-1">
                            <InputMarriage cap label="Person who gave consent" />
                            <div class="w-[50%]">
                                <InputMarriage cap label="Relationship" />
                            </div>
                        </div>
                        <div class="flex flex-row gap-1 items-end">
                            <InputMarriage cap label="Residence"
                                holder="(House No., St., Barangay, City/Municipality, Province)" />
                            <div class="w-[50%]">
                                <InputMarriage cap holder="Country" />
                            </div>
                        </div>

                    </div>

                    <div v-if="currentStep === 5" class="px-10">
                        <h3>Review & Submit</h3>
                        <p>Applicant: </p>
                        <p>Spouse: </p>
                        <p>Consent Giver: </p>
                    </div>

                </div>
                <div class="mt-auto flex flex-row gap-2 items-end justify-end">
                    <button @click="currentStep--" v-if="currentStep !== 0"
                        class="bg-blue-400 hover:bg-blue-500 text-white py-1.5 w-24  rounded">Back</button>
                    <button @click="currentStep++" v-if="currentStep + 1 < steps.length"
                        class="bg-blue-400 hover:bg-blue-500 text-white py-1.5 w-24  rounded">Next</button>
                    <button @click="currentStep++" v-if="currentStep + 1 === steps.length"
                        class="bg-blue-400 text-white py-1.5 w-24  rounded">Save</button>
                </div>

            </div>
        </div>



    </div>
</template>

<script setup>

import { computed, onMounted, reactive, ref, nextTick, watch } from 'vue';
import Button from '../../components/essentials/buttons/Button.vue';
import Modal from '../../components/client/modal/Modal.vue';
import Header from '../../components/essentials/header.vue';
import InputBottomBorderMarriage from '../../components/Marriage/InputBottomBorderMarriage.vue';
import Camera from '../../components/Camera.vue';
import { onClickOutside } from '@vueuse/core'
import PDFViewerWorker from '../../components/PDFViewerWorker.vue';
import TableGrid from '../../components/TableGrid.vue';
import { useApplicationMarriageLicense } from '../../stores/APL';
import FocusableButton from '../../components/Marriage/FocusableButton.vue';
import ActionBtn from '../../components/Marriage/ActionBtn.vue';
import { AuthStore } from "../../stores/Authentication.js";
import Input from "../../components/essentials/inputs/Input.vue";
import { differenceInYears, isValid, parseISO } from 'date-fns';
import InputAutoComplete from '../../components/InputAutoComplete.vue';
import { complete_province } from '../../utils/Address/index.js';
import InputMarriage from '../../components/Marriage/InputMarriage.vue';
import InputMarriageSuggestion from '../../components/Marriage/InputMarriageSuggestion.vue';


const province = ref(complete_province())
/**
 * Authentication
 * @IMPORTANT
 */

const currentStep = ref(0)

const steps = ['Marriage Details', 'Groom Info', 'Groom Parents', 'Bride Info', 'Bride Parents', 'Preview & Save']

const auth = AuthStore()

const temporary_form = reactive({
    groom_date_birth: '',
    bride_date_birth: '',
})


/**
 * Print Options
 */

const printDialogBox = ref(false)
const openPrint = () => {
    printDialogBox.value = !printDialogBox.value
}

const is_form_input_active = ref(false)
const input_form_value = ref()
const active_document_form = ref()
const active_input_field = ref()
const input_form_field = ref(null)
const current_tab = ref()


const open_form_input = (name, field, tabIndex, isDate, is_address) => {
    is_form_input_active.value = true;
    active_document_form.value = name;
    active_input_field.value = field;
    input_form_field.value.focus()
    current_tab.value = tabIndex

    input_form_value.value = (field !== active_input_field.value || formData[field]) ? formData[field] : '';

    setTimeout(() => {
        input_form_field.value.focus();


        if (input_form_value.value?.length) {
            input_form_field.value.select();
        }
    }, 50);
};


const submit_input_data = (event, field) => {
    const data = input_form_value.value;
    formData[field] = data ? data.toUpperCase() : data;

    focusNextInput(event);

};

const focusNextInput = (event) => {
    event.preventDefault();

    current_tab.value += 1;

    const nextButton = Array.from(document.querySelectorAll('input, button[tabindex]:not([tabindex="-1"])'))
        .find(button => button.tabIndex === current_tab.value);

    if (nextButton) {
        nextButton.focus();
    }
};



const add_age = (birth_date, field) => {

};

const date_birth_spreader = (date, field) => {

}

const add_details_to_notice = (field) => {

};

const page = ref(1)
const paper_size = computed(() => {
    return page.value === 1 ? 13 : 8
})
const change_page = (value) => {
    if (page.value === value) { return }
    page.value = value

    if (preview.value) {
        preview_document()
    }
}


const adjustment_div = ref(null)
onClickOutside(adjustment_div, event => adjustment_setting.value = false)


const preview = ref(false)
const pdf_content = ref()
const notice_pdf_content = ref()

const change_mode = () => {
    preview.value = !preview.value

    if (preview.value) {
        preview_document()
    }
}

const pdf_settings = reactive({
    x: 0,
    y: 0,
})



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


const paperDimensions = computed(() => ({
    width: 8.5 * ppi.value, // 8.5 inches in pixels
    height: paper_size.value * ppi.value, // 14 inches in pixels
}));

const paperStyle = computed(() => ({
    height: `${paperDimensions.value.height}px`,
    width: `${paperDimensions.value.width}px`,
}));

const apl = useApplicationMarriageLicense()

onMounted(() => {
    calculatePPI();
    auth.isAuthenticated()
    apl.getApplicationMarriageLicense()
});

const modal = ref(false);

const open_model = () => {
    modal.value = true;

    // const date = new Date()

    // formData.groom_civil_status = 'SINGLE'
    // formData.bride_civil_status = 'SINGLE'

    // formData.civil_registrar = 'ISMAEL D. MALICDEM, JR.'
    // formData.received_by = 'ISMAEL D. MALICDEM, JR.'
    // formData.groom_sex = "MALE"
    // formData.bride_sex = "FEMALE"
    // formData.header_province = "PANGASINAN"
    // formData.header_municipality = "BAYAMBANG"

    // formData.date_of_receipt = format(date, 'MMMM dd, yyyy').toUpperCase()
    // formData.registry_number = format(date, 'yyyy') + '-'

};

function calculateAge(data) {
    const date = data === 'groom' ? formData.groom_date_birth : data === 'bride' ? formData.bride_date_birth : null

    const parsedDate = parseISO(date)
    if (isValid(parsedDate)) {
        if (data === 'groom') {
            formData.groom_age = differenceInYears(new Date(), parsedDate)
        }
        else if (data === 'bride') {
            formData.bride_age = differenceInYears(new Date(), parsedDate)
        }
        else return

    } else {
        return
    }
}




const initialForm = {
    header_province: '',
    header_municipality: '',
    registry_number: '',
    received_by: '',
    date_of_receipt: '',
    marriage_license_number: '',
    date_issuance_marriage_license: '',
    groom_contract_marriage_with: '',
    bride_contract_marriage_with: '',

    place_of_marriage: '', // ADD
    date_of_application: '', // ADD

    civil_registrar: '',

    groom_first_name: '',
    groom_middle_name: '',
    groom_last_name: '',

    groom_date_birth: '', // ADD

    groom_day: '',
    groom_month: '',
    groom_year: '',

    groom_age: '',

    groom_municipality: '',
    groom_province: '',
    groom_country: 'PHILIPPINES',

    groom_sex: 'MALE',
    groom_citizenship: '',
    groom_residence: '',
    groom_residence_country: 'PHILIPPINES', // 
    groom_religion: '',
    groom_civil_status: 'SINGLE',

    groom_degree_relation: 'NOT RELATED',

    groom_father_first_name: '',
    groom_father_middle_name: '',
    groom_father_last_name: '',
    groom_father_citizenship: '',
    groom_father_residence: '',
    groom_father_residence_country: '',

    groom_mother_first_name: '',
    groom_mother_middle_name: '',
    groom_mother_last_name: '',
    groom_mother_citizenship: '',
    groom_mother_residence: '',
    groom_mother_residence_country: '',
    groom_person_who_gave_consent: '',
    groom_person_who_gave_consent_relation: '',
    groom_person_who_gave_consent_citizenship: '',
    groom_person_who_gave_consent_residence: '',


    groom_ss_day: '',
    groom_ss_month: '',
    groom_ss_year: '',
    groom_ss_at: '',
    groom_ctc_number: '',
    groom_ctc_on: '',
    groom_ctc_at: '',


    bride_first_name: '',
    bride_middle_name: '',
    bride_last_name: '',

    bride_day: '',
    bride_month: '',
    bride_year: '',

    bride_date_birth: '', // ADD

    bride_age: '',
    bride_municipality: '',
    bride_province: '',
    bride_country: '',
    bride_sex: '',
    bride_citizenship: '',
    bride_residence: '',
    bride_residence_country: '', //
    bride_religion: '',
    bride_civil_status: '',



    bride_degree_relation: '',
    bride_father_first_name: '',
    bride_father_middle_name: '',
    bride_father_last_name: '',
    bride_father_citizenship: '',
    bride_father_residence: '', //
    bride_father_residence_country: '',//
    bride_mother_first_name: '',
    bride_mother_middle_name: '',
    bride_mother_last_name: '',
    bride_mother_citizenship: '',
    bride_mother_residence: '', //
    bride_mother_residence_country: '',//
    bride_person_who_gave_consent: '',
    bride_person_who_gave_consent_relation: '',
    bride_person_who_gave_consent_citizenship: '',
    bride_person_who_gave_consent_residence: '', //


    bride_ss_day: '',
    bride_ss_month: '',
    bride_ss_year: '',
    bride_ss_at: '',
    bride_ctc_number: '',
    bride_ctc_on: '',
    bride_ctc_at: '',



    /**
     *  Notice Input Fields
     */


    notice_province: '',
    notice_municipality: '',
    notice_office: '',

    notice_groom_name: '',
    notice_bride_name: '',

    notice_groom_age: '',
    notice_groom_birthplace: '',
    notice_groom_residence: '',
    notice_groom_father: '',
    notice_groom_mother: '',

    notice_bride_age: '',
    notice_bride_birthplace: '',
    notice_bride_residence: '',
    notice_bride_father: '',
    notice_bride_mother: '',

    notice_date_posting: '',
    notice_position: '',
    notice_copy_furnished1: '',
    notice_copy_furnished2: '',
    notice_copy_furnished3: '',
    notice_copy_furnished4: '',


    //  FOR DISSOLVED N/A

    groom_place_dissolved: '',
    groom_date_dissolved: '',

    bride_place_dissolved: '',
    bride_date_dissolved: '',

    //  FOR DISSOLVED WITH VALUE

    groom_previously_married_dissolved: '',
    bride_previously_married_dissolved: '',

    groom_place_dissolved_municipality: '',
    groom_place_dissolved_province: '',
    groom_place_dissolved_country: '',

    groom_date_dissolved_day: '',
    groom_date_dissolved_month: '',
    groom_date_dissolved_year: '',

    bride_place_dissolved_municipality: '',
    bride_place_dissolved_province: '',
    bride_place_dissolved_country: '',

    bride_date_dissolved_day: '',
    bride_date_dissolved_month: '',
    bride_date_dissolved_year: '',

}

const formData = reactive({ ...initialForm })

watch(formData, (newValue, oldValue) => {

    const groomFullName = formData.groom_first_name || formData.groom_middle_name && formData.groom_last_name
        ? `${formData.groom_first_name} ${formData.groom_middle_name} ${formData.groom_last_name}`
        : '';

    const brideFullName = formData.bride_first_name || formData.bride_middle_name && formData.bride_last_name
        ? `${formData.bride_first_name} ${formData.bride_middle_name} ${formData.bride_last_name}`
        : '';

    if (groomFullName) {
        formData.bride_contract_marriage_with = groomFullName;
    }

    if (brideFullName) {
        formData.groom_contract_marriage_with = brideFullName;
    }


    if (formData.groom_civil_status === 'SINGLE') {
        formData.groom_place_dissolved = 'N/A'
        formData.groom_date_dissolved = 'N/A'
        formData.groom_previously_married_dissolved = 'N/A'

    } else {
        formData.groom_place_dissolved = ''
        formData.groom_date_dissolved = ''
        formData.groom_previously_married_dissolved = ''
    }
    if (formData.bride_civil_status === 'SINGLE') {
        formData.bride_place_dissolved = 'N/A'
        formData.bride_date_dissolved = 'N/A'
        formData.bride_previously_married_dissolved = 'N/A'
    } else {
        formData.bride_place_dissolved = ''
        formData.bride_date_dissolved = ''
        formData.bride_previously_married_dissolved = ''
    }
});


// Pictures
const groom_picture = ref(null)
const handle_groom_image = (capturedImage) => {
    groom_picture.value = capturedImage
}
const bride_picture = ref(null)
const handle_bride_image = (capturedImage) => {
    bride_picture.value = capturedImage
}

// Make form blank
const blank = () => {
    Object.assign(formData, { ...initialForm });
}
// Close Form Editor
const close_modal = () => {
    // Object.assign(formData, { ...initialForm });
    // groom_picture.value = null;
    // bride_picture.value = null;
    modal.value = false;
    // page.value = 1
    // preview.value = false
};


const preview_document = async () => {
    if (preview.value) {
        const data = JSON.stringify({ ...formData })

        if (page.value === 1) {
            const previewData = await window.MarriageApi.previewMarriage(data);
            pdf_content.value = previewData.pdfbase64;
        }
        else if (page.value === 2) {

            const bride = bride_picture.value
            const groom = groom_picture.value

            const images = [
                bride, groom
            ]

            const image_data = JSON.stringify(images)
            const previewData = await window.MarriageApi.previewNotice(data, image_data);
            notice_pdf_content.value = previewData.pdfbase64;
        }
    }
}

function removeBase64Prefix(base64String) {
    return base64String.replace(/^data:application\/pdf;base64,/, '');
}

const print = async () => {
    const data = JSON.stringify({ ...formData })
    if (page.value === 1) {
        const settings = JSON.stringify({ ...pdf_settings })
        const previewData = await window.MarriageApi.printMarriage(data, settings);
        console.log(previewData)
    }
    if (page.value === 2) {

        const bride = bride_picture.value
        const groom = groom_picture.value

        const images = [
            bride, groom
        ]

        const image_data = JSON.stringify(images)

        const previewData = await window.MarriageApi.previewNotice(data, image_data);

        const dataUri = removeBase64Prefix(previewData.pdfbase64)


        if (previewData) {
            const print_after_preview_without_gui = await window.MarriageApi.printNotice(dataUri);
        }
    }
}
const submit = async () => {
    const bride = bride_picture.value
    const groom = groom_picture.value

    const images = [
        bride, groom
    ]

    const image_data = JSON.stringify(images)
    const main_data = JSON.stringify({ ...formData })

    const save_local = await window.MarriageApi.saveMarriageApplicationEntry(main_data, image_data)

    if (save_local.status === true) {
        const data = {
            header_province: formData.header_province,
            header_municipality: formData.header_municipality,
            registry_number: formData.registry_number,
            received_by: formData.received_by,
            date_of_receipt: formData.date_of_receipt,
            marriage_license_number: formData.marriage_license_number,
            date_issuance_marriage_license: formData.date_issuance_marriage_license,
            groom_contract_marriage_with: formData.groom_contract_marriage_with,
            bride_contract_marriage_with: formData.bride_contract_marriage_with,

            civil_registrar: formData.civil_registrar,

            groom_first_name: formData.groom_first_name,
            groom_middle_name: formData.groom_middle_name,
            groom_last_name: formData.groom_last_name,

            groom_day: formData.groom_day,
            groom_month: formData.groom_month,
            groom_year: formData.groom_year,

            groom_age: formData.groom_age,

            groom_municipality: formData.groom_municipality,
            groom_province: formData.groom_province,
            groom_country: formData.groom_country,

            groom_sex: formData.groom_sex,
            groom_citizenship: formData.groom_citizenship,
            groom_residence: formData.groom_residence,
            groom_residence_country: formData.groom_residence_country,
            groom_religion: formData.groom_religion,
            groom_civil_status: formData.groom_civil_status,
            groom_previously_married_dissolved: formData.groom_previously_married_dissolved,
            groom_place_dissolved: formData.groom_place_dissolved,
            groom_date_dissolved: formData.groom_date_dissolved,
            groom_degree_relation: formData.groom_degree_relation,
            groom_father_first_name: formData.groom_father_first_name,
            groom_father_middle_name: formData.groom_father_middle_name,
            groom_father_last_name: formData.groom_father_last_name,
            groom_father_citizenship: formData.groom_father_citizenship,
            groom_father_residence: formData.groom_father_residence,
            groom_father_residence_country: formData.groom_father_residence_country,
            groom_mother_first_name: formData.groom_mother_first_name,
            groom_mother_middle_name: formData.groom_mother_middle_name,
            groom_mother_last_name: formData.groom_mother_last_name,
            groom_mother_citizenship: formData.groom_mother_citizenship,
            groom_mother_residence: formData.groom_mother_residence,
            groom_mother_residence_country: formData.groom_mother_residence_country,
            groom_person_who_gave_consent: formData.groom_person_who_gave_consent,
            groom_person_who_gave_consent_relation: formData.groom_person_who_gave_consent_relation,
            groom_person_who_gave_consent_citizenship: formData.groom_person_who_gave_consent_citizenship,
            groom_person_who_gave_consent_residence: formData.groom_person_who_gave_consent_residence,


            groom_ss_day: formData.groom_ss_day,
            groom_ss_month: formData.groom_ss_month,
            groom_ss_year: formData.groom_ss_year,
            groom_ss_at: formData.groom_ss_at,
            groom_ctc_number: formData.groom_ctc_number,
            groom_ctc_on: formData.groom_ctc_on,
            groom_ctc_at: formData.groom_ctc_at,


            bride_first_name: formData.bride_first_name,
            bride_middle_name: formData.bride_middle_name,
            bride_last_name: formData.bride_last_name,

            bride_day: formData.bride_day,
            bride_month: formData.bride_month,
            bride_year: formData.bride_year,

            bride_age: formData.bride_age,
            bride_municipality: formData.bride_municipality,
            bride_province: formData.bride_province,
            bride_country: formData.bride_country,
            bride_sex: formData.bride_sex,
            bride_citizenship: formData.bride_citizenship,
            bride_residence: formData.bride_residence,
            bride_residence_country: formData.bride_residence_country,
            bride_religion: formData.bride_religion,
            bride_civil_status: formData.bride_civil_status,
            bride_previously_married_dissolved: formData.bride_previously_married_dissolved,
            bride_place_dissolved: formData.bride_place_dissolved,
            bride_date_dissolved: formData.bride_date_dissolved,
            bride_degree_relation: formData.bride_degree_relation,
            bride_father_first_name: formData.bride_father_first_name,
            bride_father_middle_name: formData.bride_father_middle_name,
            bride_father_last_name: formData.bride_father_last_name,
            bride_father_citizenship: formData.bride_father_citizenship,
            bride_father_residence: formData.bride_father_residence,
            bride_father_residence_country: formData.bride_father_residence_country,
            bride_mother_first_name: formData.bride_mother_first_name,
            bride_mother_middle_name: formData.bride_mother_middle_name,
            bride_mother_last_name: formData.bride_mother_last_name,
            bride_mother_citizenship: formData.bride_mother_citizenship,
            bride_mother_residence: formData.bride_mother_residence,
            bride_mother_residence_country: formData.bride_mother_residence_country,
            bride_person_who_gave_consent: formData.bride_person_who_gave_consent,
            bride_person_who_gave_consent_relation: formData.bride_person_who_gave_consent_relation,
            bride_person_who_gave_consent_citizenship: formData.bride_person_who_gave_consent_citizenship,
            bride_person_who_gave_consent_residence: formData.bride_person_who_gave_consent_residence,


            bride_ss_day: formData.bride_ss_day,
            bride_ss_month: formData.bride_ss_month,
            bride_ss_year: formData.bride_ss_year,
            bride_ss_at: formData.bride_ss_at,
            bride_ctc_number: formData.bride_ctc_number,
            bride_ctc_on: formData.bride_ctc_on,
            bride_ctc_at: formData.bride_ctc_at,

            notice_province: formData.notice_province,
            notice_municipality: formData.notice_municipality,
            notice_office: formData.notice_office,

            notice_groom_name: formData.notice_groom_name,
            notice_bride_name: formData.notice_bride_name,

            notice_groom_age: formData.notice_groom_age,
            notice_groom_birthplace: formData.notice_groom_birthplace,
            notice_groom_residence: formData.notice_groom_residence,
            notice_groom_father: formData.notice_groom_father,
            notice_groom_mother: formData.notice_groom_mother,

            notice_bride_age: formData.notice_bride_age,
            notice_bride_birthplace: formData.notice_bride_birthplace,
            notice_bride_residence: formData.notice_bride_residence,
            notice_bride_father: formData.notice_bride_father,
            notice_bride_mother: formData.notice_bride_mother,

            notice_date_posting: formData.notice_date_posting,
            notice_position: formData.notice_position,
            notice_copy_furnished1: formData.notice_copy_furnished1,
            notice_copy_furnished2: formData.notice_copy_furnished2,
            notice_copy_furnished3: formData.notice_copy_furnished3,
            notice_copy_furnished4: formData.notice_copy_furnished4,

            file_path: save_local.filepath,
            created_by: auth.user_id

            // FOR DISSOLVED
        }


        const save_to_database = await apl.addApplicationMarriageLicense(data)

        close_modal()
    }

}
const colDefs = ref([
    {

        headerName: "Groom Name",
        cellClass: 'font-medium',
        flex: 2,
        filter: true,

        valueGetter: (params) => {
            // Combine first, middle, and last names
            const firstName = params.data.groom_first_name || '';
            const middleName = params.data.groom_middle_name || '';
            const lastName = params.data.groom_last_name || '';

            // You can adjust the formatting here (e.g., adding a space between names)
            return `${firstName} ${middleName} ${lastName}`.trim();
        }
    },
    {

        headerName: "Bride Name",
        cellClass: 'font-medium',
        flex: 2,
        valueGetter: (params) => {
            // Combine first, middle, and last names
            const firstName = params.data.bride_first_name || '';
            const middleName = params.data.bride_middle_name || '';
            const lastName = params.data.bride_last_name || '';

            // You can adjust the formatting here (e.g., adding a space between names)
            return `${firstName} ${middleName} ${lastName}`.trim();
        }

    },

    {
        field: "date_of_receipt",
        headerName: "Date Receipt",

        flex: 2,
        filter: true,

    },
    {
        field: "notice_date_posting",
        headerName: "Date Posting",
        flex: 2,
        filter: true,

    },
    {

        cellStyle: { border: "none" },
        pinned: "right",
        width: 100,
        lockPinned: true,
        resizable: true,
        sortable: false,
        cellStyle: { overflow: "visible", border: "none" },
        cellRenderer: ActionBtn,
    },

]);
</script>
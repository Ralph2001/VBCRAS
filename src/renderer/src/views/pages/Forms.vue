<template>
    <div class="flex flex-col relative justify-center w-full p-10 overflow-y-scroll">
        <Header label="Local Civil Registry Forms">

        </Header>


        <div class="h-[calc(100vh-200px)]">
            <div class="flex flex-row items-center justify-center">
                <div class="flex flex-col w-full py-2.5 gap-1 mb-6">
                    <p class="font-medium">Show Table </p>
                    <div class="flex flex-row gap-2 ml-5 items-center ">
                        <p class="text-xs text-neutral-600 font-medium w-32">Available Record</p>
                        <button
                            :class="[selectedForm === available ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700']"
                            class="rounded  transition-all duration-300 px-2.5 text-xs font-medium"
                            v-for="available in available_forms" :key="available" @click="fetchFormData(available)">
                            {{ available }}
                        </button>
                    </div>
                    <div class="flex flex-row gap-2 ml-5 items-center ">
                        <p class="text-xs text-neutral-600 font-medium w-32">No Record</p>
                        <button
                            :class="[selectedForm === not_available ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700']"
                            class="rounded  transition-all duration-300 px-2.5 text-xs font-medium"
                            v-for="not_available in no_record_forms" :key="not_available"
                            @click="fetchFormData(not_available)">
                            {{ not_available }}
                        </button>
                    </div>
                    <div class="flex flex-row gap-2 ml-5 items-center ">
                        <p class="text-xs text-neutral-600 font-medium w-32">Destroyed Record</p>
                        <button
                            :class="[selectedForm === destroyed ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700']"
                            class="rounded  transition-all duration-300 px-2.5 text-xs font-medium"
                            v-for="destroyed in destroyed_forms" :key="destroyed" @click="fetchFormData(destroyed)">
                            {{ destroyed }}
                        </button>
                    </div>
                </div>

                <BtnDrop label="Create" :options="options" @open-modal="OpenForms" />
            </div>
            <!-- <p class="italic font-thin text-sm  font-mono">Table Here</p> -->

            <div class="h-full">
                <TableGrid :data="selectedFormData" :dataColumns="colDefs" :suppressRowTransform="true"
                    v-if="selectedForm !== null" />
            </div>

        </div>

        <Modal footerBG="bg-white" v-if="isFormOpen" :footer="false">
            <template v-slot:header>
                <ControlButton :icon="['fas', 'arrow-left']" button-text="Return" @action="closeModal()" />
            </template>

            <div class="w-full h-full grid grid-cols-2 p-4 bg-white">
                <div class="flex flex-col gap-2 px-4 py-10">
                    <div class="grid grid-cols-2 gap-4 mb-10">
                        <InputLabel label="Page">
                            :
                            <InputforForm />
                        </InputLabel>
                        <InputLabel label="Book">
                            :
                            <InputforForm />
                        </InputLabel>
                    </div>
                    <InputLabel label="Registry Number">
                        :
                        <InputforForm width="100%" />
                    </InputLabel>
                    <InputLabel label="Date of Registration">
                        :
                        <InputforForm width="100%" />
                    </InputLabel>
                    <InputLabel label="Name of Child">
                        :
                        <InputforForm width="100%" />
                    </InputLabel>
                    <InputLabel label="Date of Birth">
                        :
                        <InputforForm width="100%" />
                    </InputLabel>
                    <InputLabel label="Place of Birth">
                        :
                        <InputforForm width="100%" />
                    </InputLabel>
                    <InputLabel label="Name of Mother">
                        :
                        <InputforForm width="100%" />
                    </InputLabel>
                    <InputLabel label="Citizenship of Mother">
                        :
                        <InputforForm width="100%" />
                    </InputLabel>
                    <InputLabel label="Name of Father">
                        :
                        <InputforForm width="100%" />
                    </InputLabel>
                    <InputLabel label="Citizenship of Father">
                        :
                        <InputforForm width="100%" />
                    </InputLabel>
                    <InputLabel label="Date of Marriage of parents">
                        :
                        <InputforForm width="100%" />
                    </InputLabel>
                    <InputLabel label="Place of Marriage of parents">
                        :
                        <InputforForm width="100%" />
                    </InputLabel>

                </div>
                <div class="flex flex-col gap-2 px-4 py-10">
                    <InputLabel label="Issued to">
                        :
                        <InputforForm width="100%" />
                    </InputLabel>
                    <InputLabel label="Verified by">
                        :
                        <InputforForm width="100%" />
                    </InputLabel>
                    <InputLabel label="Verifier Position">
                        :
                        <InputforForm width="100%" />
                    </InputLabel>
                    <InputLabel label="Civil Registrar ">
                        :
                        <InputforForm width="100%" />
                    </InputLabel>

                    <div class="flex flex-col gap-2 mt-auto
                   ">
                        <InputLabel label="O.R. Number ">
                            :
                            <InputforForm width="100%" />
                        </InputLabel>

                        <InputLabel label="Amount Paid">
                            :
                            <InputforForm width="100%" />
                        </InputLabel>
                        <InputLabel label="Date Paid">
                            :
                            <InputforForm width="100%" />
                        </InputLabel>
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

const all_ = ref(all_address())

const is_with_remarks = computed(() => {
    return formData.form_type.includes('A') ? true : false
})


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
const selectedType = ref(null)
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



function handleDateFiled(modelData) {
    if (!modelData) { return }

    const date = new Date(modelData);
    const formatted = format(date, "MMMM dd, yyyy");
    date_filed.value = formatted
    formData.date_filed = formatted;
}
function handleDateRegistration(modelData) {
    if (!modelData) { return }

    const date = new Date(modelData);
    const formatted = format(date, "MMMM dd, yyyy");
    date_registration.value = formatted
    formData.date_registration = formatted;
}
function handleDateOf(modelData) {
    if (!modelData) { return }

    const date = new Date(modelData);
    const formatted = format(date, "MMMM dd, yyyy");
    date_of.value = formatted
    formData.date_of = formatted;
}
function handleDateMarriage(modelData) {
    if (!modelData) { return }

    const date = new Date(modelData);
    const formatted = format(date, "MMMM dd, yyyy");
    date_marriage.value = formatted
    formData.date_marriage = formatted;
}

function handleDatePaid(modelData) {
    if (!modelData) { return }

    const date = new Date(modelData);
    const formatted = format(date, "MMMM dd, yyyy");
    date_paid.value = formatted
    formData.date_paid = formatted;
}



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

    date_filed: '',
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

const rules = computed(() => ({

    date_filed: { required }, //form 1,2,3

    page_number: {
        requiredIf: requiredIf(() => ['1A', '2A', '3A'].includes(selectedType.value))
    },

    book_number: {
        requiredIf: requiredIf(() => ['1A', '2A', '3A'].includes(selectedType.value))
    },

    registry_number: { requiredIf: requiredIf(() => ['1A', , '2A'].includes(selectedType.value)) },
    date_registration: { requiredIf: requiredIf(() => ['1A', '2A'].includes(selectedType.value)) },
    name_of: { requiredIf: requiredIf(() => ['1A', '2A', '1B', '2B', '1C', '2C'].includes(selectedType.value)) },
    sex: { requiredIf: requiredIf(() => ['1A', '2A'].includes(selectedType.value)) },
    date_of: { requiredIf: requiredIf(() => ['1A', '2A', '1B', '2B', '1C', '2C'].includes(selectedType.value)) },
    place_of: { requiredIf: requiredIf(() => ['1A', '2A'].includes(selectedType.value)) },
    name_of_mother: { requiredIf: requiredIf(() => ['1A'].includes(selectedType.value)) },
    citizenship_mother: { requiredIf: requiredIf(() => ['1A'].includes(selectedType.value)) },
    name_of_father: { requiredIf: requiredIf(() => ['1A'].includes(selectedType.value)) },
    citizenship_father: { requiredIf: requiredIf(() => ['1A'].includes(selectedType.value)) },
    date_marriage: { requiredIf: requiredIf(() => ['1A'].includes(selectedType.value)) },
    place_of_marriage_parents: { requiredIf: requiredIf(() => ['1A'].includes(selectedType.value)) },

    records_of_year: { requiredIf: requiredIf(() => ['1B', '2B'].includes(selectedType.value)) },

    registered_from: { requiredIf: requiredIf(() => ['1C', '2C'].includes(selectedType.value)) },

    period_from: { requiredIf: requiredIf(() => ['1C', '2C'].includes(selectedType.value)) },
    period_to: { requiredIf: requiredIf(() => ['1C', '2C'].includes(selectedType.value)) },
    destroyed_by: { requiredIf: requiredIf(() => ['1C', '2C'].includes(selectedType.value)) },


    age: { requiredIf: requiredIf(() => ['2A'].includes(selectedType.value)) },
    civil_status: { requiredIf: requiredIf(() => ['2A'].includes(selectedType.value)) },
    citizenship: { requiredIf: requiredIf(() => ['2A'].includes(selectedType.value)) },
    cause_of_death: { requiredIf: requiredIf(() => ['2A'].includes(selectedType.value)) },

    issued_to: { required },
    verified_by: { required },
    position: { required },

    mcr: { required },
}))


const PdfViewerRef = ref()
watch(() => PdfViewerRef.value, () => {
    PdfViewerRef.value.zoom = 150;
    console.log(PdfViewerRef.value)


}, { deep: true });


// const v$ = useVuelidate(rules, formData);
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
    // v$.value.$reset()

}
const closeModal = () => {
    isFormOpen.value = false
    // v$.value.$reset()
    resetFormData()
    isPreview.value = false

}
const toggleForm = (val) => {
    resetFormData()
    selectedType.value = val
    formData.form_type = val
    nodateforparentsmarriage.value = false
    // v$.value.$reset()
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
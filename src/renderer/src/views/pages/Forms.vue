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

                <button
                    class="rounded px-2.5 bg-gray-200 py-1 text-sm hover:bg-red-400 outline-none hover:text-white font-medium text-gray-700"
                    @click="closeModal()"> <font-awesome-icon icon="fa-solid fa-arrow-left" /> Return</button>

                <div class="flex ml-auto items-center flex-row gap-4 justify-center">
                    <button
                        class="rounded px-2.5 ml-auto bg-gray-200 py-1 text-sm hover:bg-red-400 outline-none hover:text-white font-medium text-gray-700"
                        @click="previewcontent">
                        {{ isPreview ? 'Edit' : 'Preview' }}
                    </button>
                    <button
                        class="rounded px-2.5 ml-auto bg-gray-200 py-1 text-sm hover:bg-red-400 outline-none hover:text-white font-medium text-gray-700"
                        @click="submit">
                        Save
                    </button>
                </div>


            </template>

            <div class="flex flex-row py-20 w-full items-center shadow-page  justify-center  h-max bg-gray-600   gap-4 relative font-medium"
                v-if="!isPreview">

                <div ref="scalableDiv" :style="[paperStyle]"
                    class="flex flex-col px-10 py-20  ease-in-out transition-transform duration-200 bg-white  shadow  ">

                    <div
                        class="w-full grid grid-cols-3 mb-6  rounded items-center justify-evenly border shadow-sm font-medium">
                        <ButtonBorderless v-for="type in FormTypes" :key="type" :label="`Form ${type}`"
                            @click="toggleForm(`${type}`)" :isActive="selectedType === type" />
                    </div>
                    <div class="flex items-center pl-10"
                        v-if="selectedType === '1A' || selectedType === '2A' || selectedType === '3A'">
                        <FormCheckbox label="With Authentication (Abroad)" v-model="formData.is_with_authentication" />
                    </div>
                    <div class="flex items-center justify-end">
                        <div class="w-[15rem]">
                            <InputforForm middle width="full" bold v-model="formData.date_filed" />
                        </div>

                    </div>

                    <p class="px-9 italic font-semibold font-serif">TO WHOM IT MAY CONCERN:</p>

                    <div v-if="selectedType === '1A' || selectedType === '2A' || selectedType === '3A'">
                        <div class="px-10 mt-5">
                            <p class=" relative text-pretty  tracking-widest indent-8 leading-8 text-gray-900">We
                                certify that among others, the following facts of {{ fact_of }} appear in our Register
                                of {{
                                    register_of }} on page
                                <InputforForm type="number" middle width="6rem" bold v-model="formData.page_number" />
                                of book number
                                <InputforForm type="number" middle width="6rem" bold v-model="formData.book_number" /> .
                            </p>
                        </div>

                        <div :class="{ ' sm:px-[1rem] md:lg:px-[2.5rem]': selectedType === '3A', 'sm:px-[2rem] md:lg:px-[5rem]': selectedType !== '3A' }"
                            class="h-full flex flex-col  mt-6 gap-2 ">
                            <InputLabel v-if="selectedType === '1A' || selectedType === '2A'" label="Registry Number">
                                :
                                <InputforForm width="100%" v-model="formData.registry_number" />
                            </InputLabel>

                            <InputLabel v-if="selectedType === '1A' || selectedType === '2A'"
                                label="Date of Registration">
                                :

                                <InputforForm width="100%" bold v-model="formData.date_registration" />
                            </InputLabel>

                            <InputLabel v-if="selectedType === '1A' || selectedType === '2A'" label="Name of Child">
                                :
                                <InputforForm bold @input="formData.name_child = $event.target.value.toUpperCase()"
                                    width="100%" v-model="formData.name_child" />
                            </InputLabel>

                            <InputLabel v-if="selectedType === '1A' || selectedType === '2A'" label="Sex">
                                :
                                <!-- <InputforForm width="100%" v-model="formData.sex"  /> -->

                                <SelectforForm width="100%" v-model="formData.sex" />
                            </InputLabel>

                            <InputLabel v-if="selectedType === '1A'" label="Date of Birth">
                                :

                                <InputforForm width="100%" bold v-model="formData.date_birth" />
                            </InputLabel>

                            <InputLabel v-if="selectedType === '1A'" label="Place of Birth">
                                :

                                <FormAutoComplete width="100%" v-model="formData.place_birth" :suggestion_data="all_"
                                    :wait="true" />


                            </InputLabel>

                            <InputLabel v-if="selectedType === '1A'" label="Name of Mother">
                                :
                                <InputforForm width="100%" v-model="formData.name_mother" />
                            </InputLabel>

                            <InputLabel v-if="selectedType === '1A'" label="Citizenship of Mother">
                                :
                                <InputforForm width="100%" v-model="formData.citizenship_mother" />
                            </InputLabel>

                            <InputLabel v-if="selectedType === '1A'" label="Name of Father">
                                :
                                <InputforForm width="100%" v-model="formData.name_father" />
                            </InputLabel>

                            <InputLabel v-if="selectedType === '1A'" label="Citizenship of Father">
                                :
                                <InputforForm width="100%" v-model="formData.citizenship_father" />
                            </InputLabel>

                            <InputLabel v-if="selectedType === '1A'" label="Date of Marriage">
                                :

                                <InputforForm width="100%" v-model="formData.date_marriage_parents" />

                            </InputLabel>

                            <InputLabel v-if="selectedType === '1A'" label="Place of Marriage of Parents">
                                :


                                <FormAutoComplete width="100%" v-model="formData.place_marriage_parents"
                                    :suggestion_data="all_" :wait="true" />


                            </InputLabel>

                            <!-- Form 2 -->

                            <InputLabel v-if="selectedType === '2A'" label="Age">
                                :
                                <InputforForm width="100%" v-model="formData.age" />
                            </InputLabel>

                            <InputLabel v-if="selectedType === '2A'" label="Civil Status">
                                :
                                <InputforForm width="100%" v-model="formData.civil_status" />
                            </InputLabel>

                            <InputLabel v-if="selectedType === '2A'" label="Citizenship">
                                :
                                <InputforForm width="100%" v-model="formData.citizenship" />
                            </InputLabel>

                            <InputLabel v-if="selectedType === '2A'" label="Date of Death">
                                :
                                <InputforForm width="100%" v-model="formData.date_of" />
                            </InputLabel>

                            <InputLabel v-if="selectedType === '2A'" label="Place of Death">
                                :
                                <InputforForm width="100%" v-model="formData.place_of" />
                            </InputLabel>

                            <InputLabel v-if="selectedType === '2A'" label="Cause of Death">
                                :
                                <InputforForm width="100%" v-model="formData.cause_of_death" />
                            </InputLabel>


                            <!-- Form 3 -->

                            <InputLabel twoInput v-if="selectedType === '3A'" label="Name">
                                :
                                <InputforForm width="100%" />
                                :
                                <InputforForm width="100%" she />
                            </InputLabel>

                            <InputLabel twoInput v-if="selectedType === '3A'" label="Date of Birth">
                                :
                                <InputforForm width="100%" />
                                :
                                <InputforForm width="100%" she />
                            </InputLabel>
                            <InputLabel twoInput v-if="selectedType === '3A'" label="Age">
                                :
                                <InputforForm width="100%" />
                                :
                                <InputforForm width="100%" she />
                            </InputLabel>
                            <InputLabel twoInput v-if="selectedType === '3A'" label="Citizenship">
                                :
                                <InputforForm width="100%" />
                                :
                                <InputforForm width="100%" she />
                            </InputLabel>
                            <InputLabel twoInput v-if="selectedType === '3A'" label="Civil Status">
                                :
                                <InputforForm width="100%" />
                                :
                                <InputforForm width="100%" she />
                            </InputLabel>
                            <InputLabel twoInput v-if="selectedType === '3A'" label="Mother">
                                :
                                <InputforForm width="100%" />
                                :
                                <InputforForm width="100%" she />
                            </InputLabel>
                            <InputLabel twoInput v-if="selectedType === '3A'" label="Father">
                                :
                                <InputforForm width="100%" />
                                :
                                <InputforForm width="100%" she />
                            </InputLabel>
                            <InputLabel v-if="selectedType === '3A'" label="Registry Number">
                                :
                                <InputforForm width="50%" />

                            </InputLabel>
                            <InputLabel v-if="selectedType === '3A'" label="Date of Registration">
                                :
                                <InputforForm width="50%" />

                            </InputLabel>
                            <InputLabel v-if="selectedType === '3A'" label="Date of Marriage">
                                :
                                <InputforForm width="50%" />

                            </InputLabel>
                            <InputLabel v-if="selectedType === '3A'" label="Place of Marriage">
                                :
                                <InputforForm width="50%" />

                            </InputLabel>

                        </div>
                    </div>

                    <div v-if="selectedType === '1B' || selectedType === '2B' || selectedType === '3B'">
                        <div class="mt-10 px-10">
                            <p class="indent-8 text-pretty leading-10 tracking-wider text-justify">We certify that this
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
                                copy of his/her Certificate of {{ register_of }} or transcription from the Register of
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

                    <div v-if="selectedType === '1C' || selectedType === '2C' || selectedType === '3C'">
                        <div class="mt-10 px-10">
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

                        <div class="mt-10 px-10 flex flex-col gap-2 w-full opacity-50 ">
                            <div class="w-[calc(100%-50px)]  ml-auto h-[1rem] bg-gray-200 rounded-lg "></div>
                            <div class="w-full h-[1rem] bg-gray-200 rounded-lg "></div>
                            <div class="w-full h-[1rem] bg-gray-200 rounded-lg "></div>
                            <div class="w-[calc(100%-400px)]  h-[1rem] bg-gray-200 rounded-lg "></div>
                        </div>
                    </div>

                    <div class="flex items-center justify-center mt-10 relative text-nowrap">
                        This certification is issued to <div class="px-2">
                            <InputforForm width="15rem" middle v-model="formData.certification_issued_to" bold />
                        </div> upon his/her request.
                    </div>

                    <div class="flex  flex-col  px-14 py-2 w-full gap-2" v-if="is_with_remarks">

                        <div class="h-24 block"></div>
                        <!-- <p class="font-bold font-serif">REMARKS: <span
                                class="text-xs font-sans italic font-normal text-gray-600">(Leave it blank if no
                                remarks)</span></p> -->
                        <!-- As Remarks  v-if="formData.form_type.includes('A')"-->
                        <div class="w-full flex flex-col gap-1">
                            <!-- <QuillEditor theme="snow" :toolbar="['bold', 'italic']" v-model:content="formData.remarks" /> -->
                            <Try />
                        </div>
                    </div>

                    <div
                        class="flex sm:flex-col md:lg:flex-row justify-between items-start w-full  mt-10     relative text-nowrap gap-2  px-2   ">
                        <!-- <div class="absolute -right-[15rem]">
                            <button class="text-xs text-blue-500 border rounded-sm p-2 hover:bg-white">
                                <p>
                                    ADD <span class="italic">"For and in the
                                        absence:"</span>
                                </p>
                            </button>
                        </div> -->
                        <div class="flex flex-col items-start sm:gap-2 mb-4 md:lg:gap-10">
                            <p class="italic">Verified by:</p>
                            <div class="sm:pl-0 md:lg:pl-20 flex flex-col items-center gap-[0.10rem]">
                                <InputforForm skip width="20rem" bold middle v-model="formData.verified_by"
                                    @input="formData.verified_by = $event.target.value.toUpperCase()" />
                                <InputforForm skip width="20rem" middle italic unbordered isTransparent
                                    v-model="formData.verifier_position" />
                            </div>
                        </div>
                        <div class="flex flex-col items-center">
                            <!-- <p class="italic font-medium text-sm">For and in the absence of:</p> -->
                            <InputforForm skip middle width="20rem" bold v-model="formData.civil_registrar"
                                @input="formData.civil_registrar = $event.target.value.toUpperCase()" />
                            <p class="italic font-medium text-sm">Municipal Civil Registrar</p>
                            <!-- <div class="mt-10 flex flex-col items-center gap-[0.10rem] absolute top-20">
                                <InputforForm skip width="20rem" bold middle v-model="formData.verified_by"
                                    
                                    @input="formData.verified_by = $event.target.value.toUpperCase()" />
                                <InputforForm skip width="20rem" middle italic unbordered isTransparent
                                    v-model="formData.position"  />
                            </div> -->
                        </div>
                    </div>
                    <!--     Required for all forms      -->
                    <div class="flex  flex-col px-2 gap-2 w-[25rem] mt-auto">
                        <InputLabel label="Amount Paid">
                            <InputforForm width="100%" v-model="formData.amount_paid" />
                        </InputLabel>
                        <InputLabel label="O.R. Number">
                            <InputforForm width="100%" v-model="formData.or_number" />
                        </InputLabel>
                        <InputLabel label="Date Paid">
                            <InputforForm width="100%" bold v-model="formData.date_paid" />
                        </InputLabel>
                    </div>

                </div>


            </div>

            <div class=" bg-gray-100 w-full " v-if="isPreview">
                <PDFViewerWorker :pdfBytes64="previewUrl" v-if="isPreview" />
            </div>

            <!-- <template v-slot:footer>
                <div class="h-full flex items-center justify-center w-full px-2">
                    <div class="flex flex-row gap-2 ml-auto">
                        <button type="button"
                            class="bg-white  px-2.5 py-1 gap-2 flex outline-none hover:bg-blue-600  items-center font-medium  text-sm rounded transition-all focus:bg-blue-500 focus:text-white border-gray-300  hover:text-white"
                            @click="submit()">Submit</button>
                        <button type="button"
                            class="bg-white  px-2.5 py-1 gap-2 flex outline-none hover:bg-blue-600  items-center font-medium  text-sm rounded transition-all focus:bg-blue-500 focus:text-white border-gray-300  hover:text-white"
                            @click="submit()">Submit &
                            Print</button>
                        <button type="button"
                            class="bg-white  px-2.5 py-1 gap-2 flex outline-none hover:bg-blue-600  items-center font-medium  text-sm rounded transition-all focus:bg-blue-500 focus:text-white border-gray-300  hover:text-white"
                            @click="submit()"> Print</button>
                    </div>
                </div>
            </template> -->
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
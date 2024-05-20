<template>
    <div class="flex flex-col relative justify-center w-full p-10">
        <Header label="Local Civil Registry Forms">
            <BtnDrop label="Create" :options="options" @open-modal="OpenForms" />
            <ButtonIcon @click="generate()">
                Generate
            </ButtonIcon>
        </Header>
        <div class="h-[calc(100vh-250px)] relative flex flex-col items-center justify-center border rounded-sm ">
            <p class="italic font-thin  font-mono">Table Here</p>
            <!-- <TableGrid :data="data" :dataColumns="colDefs" /> -->
        </div>

        <Modal medium label="Create a new Document" v-if="isFormOpen">
            <template v-slot:header>
                <ModalCloseButton @click="closeModal" />
            </template>
            <div class="flex flex-col  sm:px-6 md:px-4 h-max  w-full gap-4 relative  font-medium">
                <div class="h-full flex flex-col px-10 py-4">
                    <div
                        class="w-full grid grid-cols-3 mb-6  rounded items-center justify-evenly border shadow-sm font-medium">
                        <ButtonBorderless v-for="type in FormTypes" :key="type" :label="`Form ${type}`"
                            @click="toggleForm(`${type}`)" :isActive="selectedType === type" />
                    </div>
                    <div class="flex items-center pl-10"
                        v-if="selectedType === '1A' || selectedType === '2A' || selectedType === '3A'">
                        <FormCheckbox label="With Authentication (Abroad)" />
                    </div>
                    <div class="flex items-center justify-end">
                        <InputforForm middle v-model="formData.date_filed" :error="v$.date_filed.$error" />
                    </div>

                    <p class="px-9 italic font-semibold font-serif">TO WHOM IT MAY CONCERN:</p>

                    <div v-if="selectedType === '1A' || selectedType === '2A' || selectedType === '3A'">
                        <div class="px-10 mt-5">
                            <p class=" relative text-pretty  tracking-widest indent-8 leading-8 text-gray-900">We
                                certify that among others, the following facts of {{ fact_of }} appear in our Register
                                of {{
                                    register_of }} on page
                                <InputforForm middle width="6rem" bold v-model="formData.page_number"
                                    :error="v$.page_number.$error" />
                                of book number
                                <InputforForm middle width="6rem" bold v-model="formData.book_number"
                                    :error="v$.book_number.$error" /> .
                            </p>
                        </div>

                        <div :class="{ ' sm:px-[1rem] md:lg:px-[2.5rem]': selectedType === '3A', 'sm:px-[2rem] md:lg:px-[5rem]': selectedType !== '3A' }"
                            class="h-full flex flex-col  mt-6 gap-2 ">
                            <InputLabel v-if="selectedType === '1A' || selectedType === '2A'" label="Registry Number">
                                :
                                <InputforForm width="100%" v-model="formData.registry_number"
                                    :error="v$.registry_number.$error" />
                            </InputLabel>

                            <InputLabel v-if="selectedType === '1A' || selectedType === '2A'"
                                label="Date of Registration">
                                :
                                <InputforForm width="100%" v-model="formData.date_registration"
                                    :error="v$.date_registration.$error" />
                            </InputLabel>

                            <InputLabel v-if="selectedType === '1A' || selectedType === '2A'" :label="name_of">
                                :
                                <InputforForm bold @input="formData.name_of = $event.target.value.toUpperCase()"
                                    width="100%" v-model="formData.name_of" :error="v$.name_of.$error" />
                            </InputLabel>

                            <InputLabel v-if="selectedType === '1A' || selectedType === '2A'" label="Sex">
                                :
                                <InputforForm width="100%" v-model="formData.sex" :error="v$.sex.$error" />
                            </InputLabel>

                            <InputLabel v-if="selectedType === '1A'" label="Date of Birth">
                                :
                                <InputforForm width="100%" v-model="formData.date_of" :error="v$.date_of.$error" />
                            </InputLabel>

                            <InputLabel v-if="selectedType === '1A'" label="Place of Birth">
                                :
                                <InputforForm width="100%" v-model="formData.place_of" :error="v$.place_of.$error" />
                            </InputLabel>

                            <InputLabel v-if="selectedType === '1A'" label="Name of Mother">
                                :
                                <InputforForm width="100%" v-model="formData.name_of_mother"
                                    :error="v$.name_of_mother.$error" />
                            </InputLabel>

                            <InputLabel v-if="selectedType === '1A'" label="Citizenship of Mother">
                                :
                                <InputforForm width="100%" v-model="formData.citizenship_mother"
                                    :error="v$.citizenship_mother.$error" />
                            </InputLabel>

                            <InputLabel v-if="selectedType === '1A'" label="Name of Father">
                                :
                                <InputforForm width="100%" v-model="formData.name_of_father"
                                    :error="v$.name_of_father.$error" />
                            </InputLabel>

                            <InputLabel v-if="selectedType === '1A'" label="Citizenship of Father">
                                :
                                <InputforForm width="100%" v-model="formData.citizenship_father"
                                    :error="v$.citizenship_father.$error" />
                            </InputLabel>

                            <InputLabel v-if="selectedType === '1A'" label="Date of Marriage">
                                :
                                <InputforForm width="100%" v-model="formData.date_marriage"
                                    :error="v$.date_marriage.$error" />
                            </InputLabel>

                            <InputLabel v-if="selectedType === '1A'" label="Place of Marriage of Parents">
                                :
                                <InputforForm width="100%" v-model="formData.place_of_marriage_parents"
                                    :error="v$.place_of_marriage_parents.$error" />
                            </InputLabel>

                            <!-- Form 2 -->

                            <InputLabel v-if="selectedType === '2A'" label="Age">
                                :
                                <InputforForm width="100%" v-model="formData.age" :error="v$.age.$error" />
                            </InputLabel>

                            <InputLabel v-if="selectedType === '2A'" label="Civil Status">
                                :
                                <InputforForm width="100%" v-model="formData.civil_status"
                                    :error="v$.civil_status.$error" />
                            </InputLabel>

                            <InputLabel v-if="selectedType === '2A'" label="Citizenship">
                                :
                                <InputforForm width="100%" v-model="formData.citizenship"
                                    :error="v$.citizenship.$error" />
                            </InputLabel>

                            <InputLabel v-if="selectedType === '2A'" label="Date of Death">
                                :
                                <InputforForm width="100%" v-model="formData.date_of" :error="v$.date_of.$error" />
                            </InputLabel>

                            <InputLabel v-if="selectedType === '2A'" label="Place of Death">
                                :
                                <InputforForm width="100%" v-model="formData.place_of" :error="v$.place_of.$error" />
                            </InputLabel>

                            <InputLabel v-if="selectedType === '2A'" label="Cause of Death">
                                :
                                <InputforForm width="100%" v-model="formData.cause_of_death"
                                    :error="v$.cause_of_death.$error" />
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
                            <p class="indent-8 text-pretty leading-8 tracking-wider text-justify">We certify that this
                                office
                                has
                                no
                                record of {{ records_of }} of
                                <InputforForm width="15rem" middle v-model="formData.name_of"
                                    :error="v$.name_of.$error" /> who
                                is
                                alleged
                                to have {{ alleged_to }} on
                                <InputforForm width="10rem" middle v-model="formData.date_of"
                                    :error="v$.date_of.$error" />. in this
                                municipality. Hence, we cannot issue,
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
                                <InputforForm width="6rem" middle v-model="formData.records_of_year"
                                    :error="v$.records_of_year.$error" /> are
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
                                <InputforForm width="6rem" middle v-model="formData.registered_from"
                                    :error="v$.registered_from.$error" /> to
                                present.
                                However, the records of {{ records_of }} during period
                                <InputforForm width="6rem" v-model="formData.period_from"
                                    :error="v$.period_from.$error" />
                                to
                                <InputforForm width="6rem" v-model="formData.period_to" :error="v$.period_to.$error" />
                                were totally destroyed by
                                <InputforForm width="20rem" v-model="formData.destroyed_by"
                                    :error="v$.destroyed_by.$error" />
                                Hence, we cannot issue as requested, a true transcription from the Register of
                                {{ register_of }} or
                                true
                                copy of the Certification of {{ register_of }} of
                                <InputforForm width="15rem" v-model="formData.name_of" :error="v$.name_of.$error" /> who
                                is alleged
                                to have {{ alleged_to }} on
                                <InputforForm width="10rem" v-model="formData.date_of" :error="v$.date_of.$error" /> in
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
                            <InputforForm width="15rem" middle v-model="formData.issued_to" :error="v$.issued_to.$error"
                                bold />
                        </div> upon his/her request.
                    </div>

                    <div
                        class="flex sm:flex-col md:lg:flex-row justify-between items-start w-full  mt-20 relative text-nowrap gap-2  px-2">
                        <div class="flex flex-col items-start sm:gap-2 md:lg:gap-10">
                            <p class="italic">Verified by:</p>
                            <div class="sm:pl-0 md:lg:pl-20 flex flex-col items-center gap-[0.10rem]">
                                <InputforForm width="20rem" bold middle v-model="formData.verified_by"
                                    :error="v$.verified_by.$error"
                                    @input="formData.verified_by = $event.target.value.toUpperCase()" />
                                <InputforForm width="20rem" middle italic unbordered isTransparent
                                    v-model="formData.position" :error="v$.position.$error" />
                            </div>
                        </div>
                        <div class="flex flex-col items-center">
                            <InputforForm middle width="20rem" bold v-model="formData.mcr"
                                @input="formData.mcr = $event.target.value.toUpperCase()" :error="v$.mcr.$error" />
                            <p class="italic font-medium text-sm">Municipal Civil Registrar</p>
                        </div>
                    </div>

                    <div class="flex  flex-col px-2 gap-2 w-[20rem] mt-5">
                        <InputLabel label="Amount Paid">
                            <InputforForm width="100%" />
                        </InputLabel>
                        <InputLabel label="O.R. Number">
                            <InputforForm width="100%" />
                        </InputLabel>
                        <InputLabel label="Date Paid">
                            <InputforForm width="100%" />
                        </InputLabel>
                    </div>

                </div>

            </div>
            <template v-slot:footer>
                <div class="h-full flex items-center justify-center w-full">
                    <button type="button" @click="submit"
                        :class="{ 'pointer-events-none bg-blue-500 ': isLoading, 'bg-blue-600': !isLoading }"
                        class="py-2 px-4 tracking-wide ml-auto   flex items-center text-sm font-medium text-white   rounded  active:scale-95 transition-all  shadow-sm hover:text-white focus:z-10 ">
                        <Loading v-if="isLoading" />
                        Submit
                    </button>
                </div>
            </template>
        </Modal>

    </div>
</template>

<script setup>
import { computed, defineAsyncComponent, reactive, ref } from 'vue'
import TableGrid from '../../components/TableGrid.vue'
import BtnDrop from '../../components/essentials/buttons/BtnDrop.vue'
import Header from '../../components/essentials/header.vue'
import ButtonIcon from '../../components/essentials/buttons/ButtonIcon.vue'
import ModalCloseButton from "../../components/client/modal/ModalCloseButton.vue";
import Box from '../../components/essentials/Box.vue'
import Select from '../../components/essentials/inputs/Select.vue'
import Input from '../../components/essentials/inputs/Input.vue'
import { useElementVisibility } from '@vueuse/core'
import Loading from '../../components/essentials/others/Loading.vue'
import InputforForm from '../../component/FormPageComponents/InputforForm.vue'
import ButtonBorderless from '../../component/FormPageComponents/ButtonBorderless.vue'
import FormCheckbox from '../../component/FormPageComponents/FormCheckbox.vue'
import InputLabel from '../../component/FormPageComponents/InputLabel.vue'

import { useVuelidate } from "@vuelidate/core";
import { required, requiredIf, numeric } from "@vuelidate/validators";

const generate = async() => {
    const filelocation = 'Hi'
    const open = await window.FormApi.createPdfForm(filelocation)
}

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

const FormTypes = ref([])
const isFormOpen = ref(false)
const selectedForm = ref(null)
const selectedType = ref(null)



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

const formData = reactive({
    date_filed: '',
    page_number: '',
    book_number: '',
    registry_number: '',
    date_registration: '',
    name_of: '',
    sex: '',
    date_of: '',
    place_of: '',
    name_of_mother: '',
    citizenship_mother: '',
    name_of_father: '',
    citizenship_father: '',
    date_marriage: '',
    place_of_marriage_parents: '',


    age: '',
    civil_status: '',
    citizenship: '',
    cause_of_death: '',

    records_of_year: '',

    registered_from: '',
    period_from: '',
    period_to: '',
    destroyed_by: '',



    issued_to: '',
    verified_by: '',
    position: '',

    mcr: '',

    amount_paid: '',
    or_number: '',
    date_paid: '',

})

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


const v$ = useVuelidate(rules, formData);
const submit = async () => {
    const isFormValid = await v$.value.$validate();
    if (isFormValid) {
        try {
            const dataToSubmit = {
                ...formData,
            };

            console.log(dataToSubmit)
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    } else {
        console.log('Form has validation errors:', v$.value.$errors);
    }
}

const OpenForms = (e) => {
    e === 'Form 1 (Birth)' ? [FormTypes.value = ['1A', '1B', '1C'], selectedType.value = "1A"] : e === 'Form 2 (Death)' ? [FormTypes.value = ['2A', '2B', '2C'], selectedType.value = "2A"] : e === 'Form 3 (Marriage)' ? [FormTypes.value = ['3A', '3B', '3C'], selectedType.value = "3A"] : null
    isFormOpen.value = true
    selectedForm.value = e
    v$.value.$reset()

}
const closeModal = () => {
    isFormOpen.value = false
    v$.value.$reset()

}
const toggleForm = (val) => {
    selectedType.value = val
    v$.value.$reset()
}


</script>
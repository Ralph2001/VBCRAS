<template>
    <div class="flex flex-col relative justify-center w-full">
        <Header label="Local Civil Registry Forms ">
            <BtnDrop label="Create" :options="options" @open-modal="modalOpener" />
            <ButtonIcon>
                <font-awesome-icon icon="fa-solid fa-gear" />
            </ButtonIcon>
        </Header>
        <div class="h-[calc(100vh-170px)] px-5 relative">
            <TableGrid :data="data" :dataColumns="colDefs" />
        </div>


        <Modal medium label="Create a new Document" v-if="formOne">
            <template v-slot:header>
                <ModalCloseButton @click="closeModal" />
            </template>
            <div class="flex flex-col items-center sm:px-6 md:px-4 h-max  w-full gap-4 relative ">
                <div class="flex flex-row w-full justify-center " ref="isDocumentChangerVisible">
                    <Box title="Document" width="w-max">
                        <div class="grid grid-cols-2 px-2 gap-2" ref="documentChanger" tabindex="-1">
                            <Select skip label="Type" :options="type" v-model="formData.type" :readonly="isSubmitted"
                                :error="v$.type.$error" />
                            <Select skip label="Document Type" :options="document" v-model="formData.document"
                                :readonly="isSubmitted" :error="v$.document.$error" />
                        </div>
                    </Box>


                </div>

                <Transition enter-active-class="animate__animated animate__zoomIn"
                    leave-active-class="animate__animated animate__zoomOut">
                    <button type="button" @click="focusDocumentChanger()" v-if="!targetIsVisible"
                        class="fixed shadow-sm w-auto p-2 h-auto z-10 bg-blue-400 rounded-md top-[5.9rem] border font-medium text-white flex flex-row items-center text-xs tracking-wide">

                        <font-awesome-icon icon="fa-solid fa-list-check " class="me-2 text-white" />
                        {{ formData.type }}
                        {{ formData.document }}
                    </button>
                </Transition>

                <div class="flex flex-col p-2 w-full mt-2 gap-3" v-if="formData.type === 'Form 1A'">
                    <div class="grid grid-cols-2 gap-2 w-full">
                        <Input label="Book Number" v-model="formData.book_number" :readonly="isSubmitted"
                            :error="v$.book_number.$error" />
                        <Input label="Page Number" v-model="formData.page_number" :readonly="isSubmitted"
                            :error="v$.page_number.$error" />
                    </div>
                    <Input label="Registry Number" v-model="formData.registry_number" :readonly="isSubmitted"
                        :error="v$.registry_number.$error" />
                    <Input label="Date of Registration" v-model="formData.date_registration" :readonly="isSubmitted"
                        :error="v$.date_registration.$error" />
                    <Input label="Name of Child" v-model="formData.name_child"
                        @input="formData.name_child = $event.target.value.toUpperCase()" :readonly="isSubmitted"
                        :error="v$.name_child.$error" />
                    <Input label="Sex" v-model="formData.sex" :readonly="isSubmitted" :error="v$.sex.$error" />
                    <Input label="Date of Birth" v-model="formData.date_of_birth" :readonly="isSubmitted"
                        :error="v$.date_of_birth.$error" />
                    <Input label="Place of Birth" v-model="formData.place_of_birth" :readonly="isSubmitted"
                        :error="v$.place_of_birth.$error" />
                    <Input label="Name of Mother" v-model="formData.name_mother" :readonly="isSubmitted"
                        :error="v$.name_mother.$error" />
                    <Input label="Citizenship of Mother" v-model="formData.citizenship_mother" :readonly="isSubmitted"
                        :error="v$.citizenship_mother.$error" />
                    <Input label="Name of Father" v-model="formData.name_father" :readonly="isSubmitted"
                        :error="v$.name_father.$error" />
                    <Input label="Citizenship of Father" v-model="formData.citizenship_father" :readonly="isSubmitted"
                        :error="v$.citizenship_father.$error" />
                    <Input label="Date of Marriage" v-model="formData.date_marriage" :readonly="isSubmitted"
                        :error="v$.date_marriage.$error" />
                    <Input label="Place of Marriage of Parents" v-model="formData.place_marriage"
                        :readonly="isSubmitted" :error="v$.place_marriage.$error" />

                </div>


                <div class="flex flex-col p-2 w-full  gap-3" v-if="formData.type === 'Form 1C'">
                    <Input label="Year" v-model="formData.year" :readonly="isSubmitted" />
                    <Input label="However, the records of births during the period" v-model="formData.period"
                        :readonly="isSubmitted" />
                    <Input label="were totally destroyed by" v-model="formData.destroyed_by" :readonly="isSubmitted" />
                </div>

                <div class="flex flex-col p-2 w-full mt-2 gap-3"
                    v-if="formData.type === 'Form 1B' || formData.type === 'Form 1C'">
                    <Input label="Document Owner" v-model="formData.document_owner"
                        @input="formData.document_owner = $event.target.value.toUpperCase()" :readonly="isSubmitted" />
                    <Input label="Date of Birth" v-model="formData.date_of_birth" :readonly="isSubmitted" />
                    <Input label="Name of Father" v-model="formData.name_father" :readonly="isSubmitted" />
                    <Input label="Name of Mother" v-model="formData.name_mother" :readonly="isSubmitted" />
                    <Input label="Year Record" v-model="formData.year_recorded" :readonly="isSubmitted" />
                </div>
                <div class="flex flex-col px-2 w-full ">
                    <Input label="Issued to" v-model="formData.issued_to" :readonly="isSubmitted"
                        :error="v$.issued_to.$error" />
                </div>
                <div class="grid grid-cols-3 gap-2 items-center py-3 px-2">

                    <Input label="Amount Paid" v-model="formData.amount" :readonly="isSubmitted" />
                    <Input label="O.R. Number" v-model="formData.or_number" :readonly="isSubmitted" />
                    <Input label="Date Paid" v-model="formData.date_paid" :readonly="isSubmitted" />

                </div>
                <div class="flex flex-col px-2 w-full gap-3">
                    <Input label="Date Filed" v-model="formData.date_filed" :readonly="isSubmitted"
                        :error="v$.date_filed.$error" />
                    <Input label="Verified By" v-model="formData.verified_by"
                        @input="formData.verified_by = $event.target.value.toUpperCase()" :readonly="isSubmitted"
                        :error="v$.verified_by.$error" />
                    <Input label="Position" v-model="formData.position" :readonly="isSubmitted"
                        :error="v$.position.$error" />
                    <Input label="Municipal Civil Registrar" v-model="formData.mcr"
                        @input="formData.mcr = $event.target.value.toUpperCase()" :readonly="isSubmitted"
                        :error="v$.mcr.$error" />
                </div>

            </div>
            <template v-slot:footer>
                <div class="h-full flex items-center justify-center w-full">
                    <button type="button" @click="!isSubmitted ? submitForm() : openFile(filepath)"
                        :class="!isSubmitted ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-500 hover:bg-green-600'"
                        class="py-2 px-4 tracking-wide ml-auto flex items-center text-sm font-medium text-white   rounded  active:scale-95 transition-all  shadow-sm hover:text-white focus:z-10 ">
                        <Loading v-if="isLoading" />

                        {{ !isSubmitted ? 'Submit' : 'Open File' }}
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
import { useVuelidate } from "@vuelidate/core";
import { required, requiredIf } from "@vuelidate/validators";


const Modal = defineAsyncComponent(() =>
    import("../../components/client/modal/Modal.vue")
)
const formOne = ref(false)
const formTwo = ref(false)
const formThree = ref(false)
const isLoading = ref(false)
const isSubmitted = ref(false)
const filepath = ref('')

const documentChanger = ref()
const isDocumentChangerVisible = ref(null)
const targetIsVisible = useElementVisibility(isDocumentChangerVisible)


const type = computed(() => {
    if (formOne.value) {
        return ['Form 1A', 'Form 1B', 'Form 1C']
    } else if (formTwo.value) {
        return ['Form 2A', 'Form 2B', 'Form 2C']
    }
    else if (formThree.value) {
        return ['Form 3A', 'Form 3B', 'Form 3C']
    }
})

const document = [
    'Local',
    'Abroad'
]

const formData = reactive({
    type: 'Form 1A',
    document: 'Local',

    book_number: '',
    page_number: '',
    registry_number: '',
    date_registration: '',
    name_child: '',
    sex: '',
    date_of_birth: '',
    place_of_birth: '',
    name_mother: '',
    citizenship_mother: '',
    name_father: '',
    citizenship_father: '',
    date_marriage: '',
    place_marriage: '',
    issued_to: '',
    amount: '',
    or_number: '',
    date_paid: '',

    // Form 1B
    document_owner: '',
    year_recorded: '',

    // Form 1C
    year: '',
    period: '',
    destroyed_by: '',

    // Bottom
    date_filed: '',
    verified_by: '',
    position: '',
    mcr: 'ISMAEL D. MALICDEM, JR.',
})


const validate = computed(() => {
    return {
        type: { required },
        document: { required },
        book_number: { required },
        page_number: { required },
        registry_number: { required },
        date_registration: { required },
        name_child: { required },
        sex: { required },
        date_of_birth: { required },
        place_of_birth: { required },
        name_mother: { required },
        citizenship_mother: { required },
        name_father: { required },
        citizenship_father: { required },
        date_marriage: { required },
        place_marriage: { required },
        issued_to: { required },
        amount: { required },
        or_number: { required },
        date_paid: { required },
        date_filed: { required },
        verified_by: { required },
        position: { required },
        mcr: { required },
    };
});


const v$ = useVuelidate(validate, formData);

const submitForm = async () => {

    v$.value.$touch();

    if (v$.value.$error) {
        console.log(v$.value);
        return;
    }



    isLoading.value = true

    const data = {
        type: formData.type,
        document: formData.document,
        book_number: formData.book_number,
        page_number: formData.page_number,
        registry_number: formData.registry_number,
        date_registration: formData.date_registration,
        name_child: formData.name_child,
        sex: formData.sex,
        date_of_birth: formData.date_of_birth,
        place_of_birth: formData.place_of_birth,
        name_mother: formData.name_mother,
        citizenship_mother: formData.citizenship_mother,
        name_father: formData.name_father,
        citizenship_father: formData.citizenship_father,
        date_marriage: formData.date_marriage,
        place_marriage: formData.place_marriage,
        issued_to: formData.issued_to,
        amount: formData.amount,
        or_number: formData.or_number,
        date_paid: formData.date_paid,

        document_owner: formData.document_owner,
        year_recorded: formData.year_recorded,

        year: formData.year,
        period: formData.period,
        destroyed_by: formData.destroyed_by,

        date_filed: formData.date_filed,
        verified_by: formData.verified_by,
        position: formData.position,
        mcr: formData.mcr,
    }

    const create_form = await window.FormApi.CreateForm(data);
    if (create_form) {
        isLoading.value = false
        isSubmitted.value = true
        filepath.value = create_form.filepath
    }

}

const openFile = async (pattth) => {
    let name_of_owner = formData.name_child ? formData.name_child : formData.document_owner
    const path = pattth + name_of_owner + '.docx'
    console.log(path)
    isLoading.value = true
    const open = await window.ClericalApi.OpenClerical(path)
    if (open) {
        isLoading.value = false
    }
}

const colDefs = ref([
    {
        field: 'name',
        headerName: 'Name',
        flex: 2,
        filter: true,
        pinned: 'left',
        lockPinned: true,
    },
    { field: 'name', headerName: 'Registry Number', flex: 1, filter: true },
    {
        field: 'name',
        headerName: 'Date of Registration',
        flex: 1,
        filter: true,
    },
    { field: 'name', headerName: 'Type of Form', flex: 1, filter: true },
    { field: 'name', headerName: 'Book Details', flex: 1, filter: true },
    {
        headerName: 'Action',
        flex: 1,
        pinned: 'right',
        lockPinned: true,
        resizable: false,
        sortable: false,
    },
])

const options = ref([
    'Form 1 (Birth)',
    'Form 2 (Death)',
    'Form 3 (Marriage)',
])

function modalOpener(e) {
    if (e === 'Form 1 (Birth)') {
        formOne.value = true
    }
    else if (e === 'Form 2 (Death)') {
        formTwo.value = true
    }
    else if (e === 'Form 3 (Marriage)') {
        formThree.value = true
    }
}

function closeModal() {
    formOne.value = false
    formTwo.value = false
    formThree.value = false
    isSubmitted.value = false
}
function focusDocumentChanger() {
    documentChanger.value.focus()
}

</script>

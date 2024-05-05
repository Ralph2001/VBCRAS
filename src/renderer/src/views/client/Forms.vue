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
            <div class="flex flex-col items-center sm:px-6 md:px-4 h-full  w-full gap-4    ">
                <div class="flex flex-row w-full justify-center relative" ref="isDocumentChangerVisible">
                    <Box title="Document" width="w-max">
                        <div class="grid grid-cols-2 px-2 gap-2" ref="documentChanger" tabindex="-1">
                            <Select skip label="Type" :options="type" v-model="formData.type" />
                            <Select skip label="Document Type" :options="document" v-model="formData.document" />
                        </div>
                    </Box>

                    <Transition enter-active-class="animate__animated animate__zoomIn"
                        leave-active-class="animate__animated animate__zoomOut">
                        <button type="button" @click="focusDocumentChanger()" v-if="!targetIsVisible"
                            class="fixed shadow-sm w-auto p-2 h-auto z-10 bg-white rounded-md top-[6.3rem] sm:right-10 md:lg:right-[23.5rem] border font-medium text-gray-800 flex flex-row items-center text-xs tracking-wide">
                            <font-awesome-icon icon="fa-solid fa-list-check " class="me-2 text-gray-800" />
                            {{ formData.type }}
                            {{ formData.document }}
                        </button>
                    </Transition>
                </div>

                <div class="flex flex-col p-2 w-full mt-2 gap-3" v-if="formData.type === 'Form 1A'">
                    <div class="grid grid-cols-2 gap-2 w-full">
                        <Input label="Book Number" v-model="formData.book_number" />
                        <Input label="Page Number" v-model="formData.page_number" />
                    </div>
                    <Input label="Registry Number" v-model="formData.registry_number" />
                    <Input label="Date of Registration" v-model="formData.date_registration" />
                    <Input label="Name of Child" v-model="formData.name_child" />
                    <Input label="Sex" v-model="formData.sex" />
                    <Input label="Date of Birth" v-model="formData.date_of_birth" />
                    <Input label="Place of Birth" v-model="formData.place_of_birth" />
                    <Input label="Name of Mother" v-model="formData.name_mother" />
                    <Input label="Citizenship of Mother" v-model="formData.citizenship_mother" />
                    <Input label="Name of Father" v-model="formData.name_father" />
                    <Input label="Citizenship of Father" v-model="formData.citizenship_father" />
                    <Input label="Date of Marriage" v-model="formData.date_marriage" />
                    <Input label="Place of Marriage of Parents" v-model="formData.place_marriage" />

                </div>


                <div class="flex flex-col p-2 w-full mt-2 gap-3" v-if="formData.type === 'Form 1B'">

                    <Input label="Document Owner" />
                    <Input label="Date of Birth" />
                    <Input label="Name of Father" />
                    <Input label="Name of Mother" />
                    <Input label="Year Record" />

                </div>
                <div class="flex flex-col p-2 w-full mt-2 gap-3" v-if="formData.type === 'Form 1C'">

                    <Input label="Year" />
                    <Input label="However, the records of births during the period" />
                    <Input label="were totally destroyed by" />
                    <Input label="Document Owner" />
                    <Input label="Date of Birth" />
                    <Input label="Name of Father" />
                    <Input label="Name of Mother" />

                </div>

                <div class="flex flex-col px-2 w-full ">
                    <Input label="Issued to" v-model="formData.issued_to" />
                </div>
                <div class="grid grid-cols-3 gap-2 items-center py-3">

                    <Input label="Amount Paid" v-model="formData.amount" />
                    <Input label="O.R. Number" v-model="formData.or_number" />
                    <Input label="Date Paid" v-model="formData.date_paid" />

                </div>

            </div>
            <template v-slot:footer>
                <div class="h-full flex items-center justify-center w-full">
                    <button type="button" @click="submitForm()"
                        class="py-2 px-8 tracking-widest ml-auto text-sm font-medium text-white bg-blue-600 rounded active:scale-95 transition-all hover:bg-blue-700 shadow-sm hover:text-white focus:z-10 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
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
const Modal = defineAsyncComponent(() =>
    import("../../components/client/modal/Modal.vue")
)
const formOne = ref(false)
const formTwo = ref(false)
const formThree = ref(false)


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
})

const submitForm = async () => {
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
    }
    const create_form = await window.FormApi.CreateForm(data);
    console.log(create_form)
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

}
function focusDocumentChanger() {
    documentChanger.value.focus()
}

</script>

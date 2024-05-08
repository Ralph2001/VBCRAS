<template>
    <div class="flex flex-col relative justify-center w-full">
        <Header label="Data Records">
            <BtnDrop label="Create" @click="modalOpen" />
            <ButtonIcon>
                <font-awesome-icon icon="fa-solid fa-gear" />
            </ButtonIcon>
        </Header>

        <div class="h-[calc(100vh-190px)] ">
            <TableGrid :data="records.records" :dataColumns="colDefs" :suppressRowTransform="true" />
        </div>

        <div tabindex="-1" v-if="isModalOpen"
            class="overflow-x-hidden h-[calc(100vh)] overflow-y-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 flex backdrop-blur-sm backdrop-brightness-[0.5]"
            aria-modal="true" role="dialog">
            <div class="relative p-4 w-full max-w-lg max-h-auto">
                <div class="relative bg-white h-full overflow-y-auto rounded-lg shadow dark:bg-gray-700">
                    <div
                        class="flex items-center top-0 border-b border-gray-200 shadow-sm right-0 left-0 p-3 bg-[#FFFFFF]">
                        <div class="flex flex-row justify-between items-center w-full">
                            <h3 class="text-lg tracking-wide font-semibold text-gray-800 dark:text-white">
                                Create Record
                            </h3>
                            <ModalCloseButton @click="isModalOpen = false" />
                        </div>
                    </div>

                    <!-- Main Body -->
                    <div class="p-3 md:p-8 lg:p-5 overflow-y-scroll relative flex flex-col gap-4">
                        <div class="flex w-full">
                            <Select :options="items" label="Type" v-model="formData.type" />
                        </div>
                        <div class="flex flex-col gap-3">
                            <Input label="Registry Number" v-model="formData.registry_number"
                                :error="v$.registry_number.$error" />
                            <Input :error="v$.document_owner.$error" :label="formData.type === 'Birth' ? 'Name of Child' :
                                formData.type === 'Death' ? 'Name of Deceased' :
                                    formData.type === 'Marriage' ? 'Name of Husband' : ''"
                                v-model="formData.document_owner"
                                @input="formData.document_owner = $event.target.value.toUpperCase()" />

                            <Input label="Name of Wife" v-model.trim="formData.document_spouse"
                                :error="v$.document_spouse.$params.prop"
                                @input="formData.document_spouse = $event.target.value.toUpperCase()"
                                v-if="formData.type === 'Marriage'" />

                            <Input :error="v$.date_of.$error" :label="formData.type === 'Birth' ? 'Date of Birth' :
                                formData.type === 'Death' ? 'Date of Death' :
                                    formData.type === 'Marriage' ? 'Date of Marriage' : ''"
                                v-model="formData.date_of" />
                            <Input :error="v$.date_of_registration.$error" label="Date of Registration"
                                v-model="formData.date_of_registration" />
                        </div>

                    </div>

                    <!-- Footer -->
                    <div
                        class="flex items-center border-t justify-end p-2 md:p-3 rounded-b dark:border-gray-600 tracking-wider">
                        <button type="button" @click="submitForm()"
                            class="focus:ring-4 focus:outline-none focus:ring-blue-300  font-semibold text-sm px-4 py-2 tracking-wide border rounded text-white  bg-blue-500 hover:bg-blue-600 active:scale-95">
                            <svg v-if="loader" aria-hidden="true" role="status"
                                class="inline w-4 h-4 me-1 text-white animate-spin" viewBox="0 0 100 101" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                    fill="#E5E7EB" />
                                <path
                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                    fill="currentColor" />
                            </svg>
                            Create
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import BtnDrop from '../../components/essentials/buttons/BtnDrop.vue';
import Button from '../../components/essentials/buttons/Button.vue';
import ButtonIcon from '../../components/essentials/buttons/ButtonIcon.vue';
import Header from '../../components/essentials/header.vue';
import Input from '../../components/essentials/inputs/Input.vue';
import Select from '../../components/essentials/inputs/Select.vue';
import ModalCloseButton from '../../components/client/modal/ModalCloseButton.vue';
import { useVuelidate } from "@vuelidate/core";
import { required, requiredIf } from "@vuelidate/validators";
import { useRecords } from '../../stores/Records/main';
import TableGrid from '../../components/TableGrid.vue';
import RecordCell from '../../components/essentials/block/RecordCell.vue';

const records = useRecords()
const loader = ref(false)

onMounted(() => {
    records.getRecords()
})

const isModalOpen = ref(false)

const modalOpen = () => {
    isModalOpen.value = true
}

const items = ref([
    'Birth',
    'Death',
    'Marriage'
])

const formData = reactive({
    type: 'Birth',
    registry_number: '',
    document_owner: '',
    document_spouse: '',
    date_of: '',
    date_of_registration: ''
})

const validate_spouse = computed(() => {
    if (formData.type === 'Marriage' && formData.document_spouse === '' || formData.document_spouse === '' || formData.document_spouse == null) {
        return true
    }
    return false
});


const validate = computed(() => {
    return {
        type: { required },
        registry_number: { required },
        document_owner: { required },
        document_spouse: requiredIf(validate_spouse),
        date_of: { required },
        date_of_registration: { required },
    };
});


const v$ = useVuelidate(validate, formData);

const submitForm = async () => {
    v$.value.$touch();
    if (v$.value.$error) {
        console.log(v$.value);
        return;
    }
    loader.value = true
    const data = {
        type: formData.type,
        registry_number: formData.registry_number,
        document_owner: formData.document_owner,
        document_spouse: formData.document_spouse,
        date_of: formData.date_of,
        date_of_registration: formData.date_of_registration,
    }


    const submit_data = await records.addRecord(data)
    if (submit_data.status) {
        isModalOpen.value = false
        v$.value.$reset
        loader.value = false
    }
}

const cellClassRules = {
    // "bg-green-200 border-0": params => params.data.type === "Birth",
    // "bg-blue-200 border-0": params => params.data.type === "Death",
    // "bg-red-200 border-0": params => params.data.type === "Marriage",
}
const colDefs = ref([
    {
        field: "registry_number",
        headerName: "Registry Number",
        flex: 2,
        filter: true,
        pinned: "left",
        cellClassRules: cellClassRules,
        cellClass: "font-semibold tracking-wider w-full h-full  text-start ",
        lockPinned: true,

    },
    {
        field: "document_owner",
        headerName: "Document Owner",
        flex: 1,
        cellClass: "font-medium tracking-wider w-full text-gray-700",
        filter: true,
    },

    {
        field: "date_of",
        cellClass: "font-medium tracking-wider w-full text-gray-600 ",
        headerName: "Date of Birth/Death/Marriage",
        flex: 1,
        filter: true,
    },
    {
        field: "date_of_registration",
        cellClass: "font-medium tracking-wider w-full text-gray-600",

        headerName: "Date of Registration",
        flex: 1,
        filter: true,
    },


]);

</script>

<style lang="scss" scoped></style>
<template>
    <div class="flex flex-col relative justify-center w-full p-10 ">

        <Header label="LEGITIMATION">
            <div class="w-full gap-2 flex flex-row items-center justify-center">
                <Button label="Create New" isActive :class="`rounded`" @click="open_modal()" />
                <button
                    class="rounded-md border border-gray-300 px-3 py-1 hover:bg-gray-100 transition-all duration-200 text-gray-700 shadow active:scale-95"><font-awesome-icon
                        icon="fa-solid fa-info" /></button>
            </div>
        </Header>

        <div class="h-[calc(100vh-200px)] rounded border border-gray-300">


        </div>
        <Modal v-if="isModalOpen" :footer="false">
            <template v-slot:header>
                <button
                    class="rounded px-4 py-2 bg-gray-200 text-sm hover:bg-red-400 outline-none hover:text-white font-medium text-gray-700"
                    @click="close_modal"> <font-awesome-icon icon="fa-solid fa-arrow-left" /> Return</button>
            </template>
            <div class="grid grid-cols-1 lg:grid-cols-2 w-full h-full  b">
                <div class="flex flex-col  p-6 ">
                    <div class="flex flex-col gap-1 w-52 justify-center">
                        <label for="" class=" font-medium items-center">Parent Type:</label>
                        <select v-model="formData.parent_type" name="" id=""
                            class="border border-gray-400 py-1.5 outline-none ring-0 rounded">
                            <option value="" selected disabled></option>
                            <option value="Adult" class="font-medium">Adult</option>
                            <option value="Minor" class="font-medium">Minor</option>
                            <option value="Single" class="font-medium">Single</option>
                        </select>
                    </div>
                    <div class="flex flex-col gap-2 mt-4">
                        <InputLabel label="Registry Number">
                            :
                            <InputforForm width="100%" />

                        </InputLabel>
                        <InputLabel label="Date of Registration">
                            :
                            <InputforForm width="100%" />

                        </InputLabel>
                    </div>
                    <div class="p-2" v-if="formData.parent_type !== ''">
                        <p class="text-center font-bold text-gray-600 font-serif">AFFIDAVIT FOR LEGITIMATION BY
                            SUBSEQUENT MARRIAGE
                        </p>
                    </div>
                    <div class="flex flex-col gap-2" v-if="formData.parent_type === 'Adult'">

                        <InputLabel label="Name of Father">
                            :
                            <InputforForm width="100%" />

                        </InputLabel>
                        <InputLabel label="Name of Mother">
                            :
                            <InputforForm width="100%" />

                        </InputLabel>
                        <InputLabel label="Citizen">
                            :
                            <InputforForm width="100%" />

                        </InputLabel>
                        <InputLabel label="Address">
                            :
                            <InputforForm width="100%" />

                        </InputLabel>
                        <InputLabel label="Child Date of Birth">
                            :
                            <InputforForm width="100%" />

                        </InputLabel>
                        <InputLabel label="Child Place of Birth">
                            :
                            <InputforForm width="100%" />

                        </InputLabel>
                        <InputLabel label="Date of Marriage">
                            :
                            <InputforForm width="100%" />

                        </InputLabel>
                        <InputLabel label="Place of Marriage">
                            :
                            <InputforForm width="100%" />

                        </InputLabel>
                        <InputLabel label="Marriage Before">
                            :
                            <InputforForm width="100%" />

                        </InputLabel>
                        <InputLabel label="Marriage Registered at">
                            :
                            <InputforForm width="100%" />

                        </InputLabel>
                        <InputLabel label="Subsribe and Sworn Date">
                            :
                            <InputforForm width="100%" />

                        </InputLabel>
                        <InputLabel label="Subsribe and Sworn at">
                            :
                            <InputforForm width="100%" />

                        </InputLabel>

                    </div>


                </div>
                <div class="flex flex-col p-6">

                    <div class="ml-auto mt-auto flex items-center justify-center gap-2">
                        <button
                            class="bg-blue-600 hover:bg-blue-700 text-white border px-10 font-medium  py-2.5 rounded-md "
                            @click="previewForm">Next</button>


                    </div>
                </div>
            </div>
        </Modal>


    </div>
</template>
<script setup>
import { reactive, ref } from 'vue';
import Modal from '../../components/client/modal/Modal.vue';
import Button from '../../components/essentials/buttons/Button.vue';
import Header from '../../components/essentials/header.vue';
import InputforForm from '../../components/Form/InputforForm.vue';
import Input from '../../components/essentials/inputs/Input.vue';
import InputLabel from '../../components/Form/InputLabel.vue'

const isModalOpen = ref(false)

const open_modal = () => {
    isModalOpen.value = true
}
const close_modal = () => {
    isModalOpen.value = false
}


const initialForm = {
    document_type: '',
    parent_type: '',
    registry_number: '',
    date_of_registration: '',
    name_groom: '',
    name_bride: '',
    citizenship: '',
    postal_address: '',
    child_born_on: '',
    child_born_in: '',
    legally_married_on: '',
    legally_married_at: '',
    legally_marriage_before: '',
    marriage_registered_at: '',
    date_filed: '',
    subscribe_sworn_date: '',
    subscribe_sworn_at: '',
}

const formData = reactive({ ...initialForm })

</script>
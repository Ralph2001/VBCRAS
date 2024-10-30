<template>
    <div class="flex flex-col relative justify-center w-full p-10">
        <Header label="APPLICATION FOR MARRIAGE LICENSE">
            <Button label="Create" isActive :class="`rounded`" @click="open_modal" />
        </Header>

        <div class="h-[calc(100vh-250px)] relative flex items-center justify-center">
            <p class="italic"> Soon :)</p>
        </div>

        <Modal medium :footer="false" v-if="application_marriage_license_form">
            <template v-slot:header>
                <button
                    class="rounded px-2.5 bg-gray-200 py-1 text-sm hover:bg-red-400 outline-none hover:text-white font-medium text-gray-700"
                    @click="close_modal">
                    <font-awesome-icon icon="fa-solid fa-arrow-left" /> Return
                </button>
            </template>
            <div class="h-full flex flex-col p-2 w-full items-center justify-center ">
                <p class="font-medium mx-auto">APPLICATION FOR MARRIAGE LICENSE</p>



                <div class="grid grid-cols-2 gap-2 w-full px-10 mt-10">
                    <div class="flex flex-col gap-1">
                        <InputMarriage label="DATE OF APPLICATION" v-model="formData.date_application" />
                        <InputMarriage label="DATE OF MARRIAGE" v-model="formData.date_marriage" />
                    </div>
                    <div class="flex flex-col gap-1">
                        <InputMarriage label="DATE OF ISSUANCE OF MARRIAGE LICENSE:"
                            v-model="formData.date_issuance_marriage_license" />
                        <InputMarriage label="PLACE OF MARRIAGE" v-model="formData.place_marriage" />
                    </div>
                    <div class="flex justify-center">
                        <p class="font-bold text-gray-800">GROOM</p>
                    </div>
                    <div class="flex justify-center">
                        <p class="font-bold text-gray-800">BRIDE</p>
                    </div>


                    <div class="flex flex-row w-full items-center">
                        <label for="" class="text-nowrap font-medium text-sm mr-2">Name:</label>
                        <InputMarriage label="First Name" labelPosition="below" v-model="formData.groom_first_name" />
                        <InputMarriage label="Middle Name" labelPosition="below" v-model="formData.groom_middle_name" />
                        <InputMarriage label="Last Name" labelPosition="below" v-model="formData.groom_last_name" />
                    </div>
                    <div class="flex flex-row w-full items-center">
                        <label for="" class="text-nowrap font-medium text-sm mr-2">Name:</label>
                        <InputMarriage label="First Name" labelPosition="below" v-model="formData.bride_first_name" />
                        <InputMarriage label="Middle Name" labelPosition="below" v-model="formData.bride_middle_name" />
                        <InputMarriage label="Last Name" labelPosition="below" v-model="formData.bride_last_name" />
                    </div>

                    <div class="flex flex-row w-full">
                        <InputMarriage label="Date of Birth" v-model="formData.groom_date_of_birth" />
                        <div class="basis-[40%]">
                            <InputMarriage label="Age" v-model="formData.groom_age" />
                        </div>
                    </div>
                    <div class="flex flex-row w-full">
                        <InputMarriage label="Date of Birth" v-model="formData.bride_date_of_birth" />
                        <div class="basis-[40%]">
                            <InputMarriage label="Age" v-model="formData.bride_age" />
                        </div>
                    </div>

                    <div class="flex flex-row w-full items-center">
                        <label for="" class="text-nowrap font-medium text-sm mr-2">Place of Birth:</label>
                        <InputMarriage label="City/Municipality" labelPosition="below"
                            v-model="formData.groom_municipality" />
                        <InputMarriage label="Province" labelPosition="below" v-model="formData.groom_province" />
                        <InputMarriage label="Country" labelPosition="below" v-model="formData.groom_country" />
                    </div>
                    <div class="flex flex-row w-full items-center">
                        <label for="" class="text-nowrap font-medium text-sm mr-2">Place of Birth:</label>
                        <InputMarriage label="City/Municipality" labelPosition="below"
                            v-model="formData.bride_municipality" />
                        <InputMarriage label="Province" labelPosition="below" v-model="formData.bride_municipality" />
                        <InputMarriage label="Country" labelPosition="below" v-model="formData.bride_municipality" />
                    </div>


                    <div class="flex flex-row w-full">
                        <InputMarriage label="Citizenship" v-model="formData.groom_citizenship" />
                        <InputMarriage label="Civil Status" v-model="formData.groom_civil_status" />
                    </div>
                    <div class="flex flex-row w-full">
                        <InputMarriage label="Citizenship" v-model="formData.bride_citizenship" />
                        <InputMarriage label="Civil Status" v-model="formData.bride_civil_status" />
                    </div>


                    <div class="flex flex-row w-full items-center">
                        <label for="" class="text-nowrap font-medium text-sm mr-2">Residence:</label>
                        <InputMarriage label="Housen No., St., Barangay, City/Municipality, Province"
                            v-model="formData.groom_residence" labelPosition="below" />

                        <InputMarriage label="Country" labelPosition="below"
                            v-model="formData.groom_residence_country" />
                    </div>
                    <div class="flex flex-row w-full items-center">
                        <label for="" class="text-nowrap font-medium text-sm mr-2">Residence:</label>
                        <InputMarriage label="Housen No., St., Barangay, City/Municipality,Province"
                            labelPosition="below" v-model="formData.bride_residence" />

                        <InputMarriage label="Country" labelPosition="below"
                            v-model="formData.bride_residence_country" />
                    </div>

                    <InputMarriage label="Religion" v-model="formData.groom_religion" />
                    <InputMarriage label="Religion" v-model="formData.bride_religion" />

                    <div class="flex flex-row w-full items-center">
                        <label for="" class="text-nowrap font-medium text-sm mr-2">Name of Father:</label>
                        <InputMarriage label="First Name" labelPosition="below"
                            v-model="formData.groom_father_first_name" />
                        <InputMarriage label="Middle Name" labelPosition="below"
                            v-model="formData.groom_father_middle_name" />
                        <InputMarriage label="Last Name" labelPosition="below"
                            v-model="formData.groom_father_last_name" />
                    </div>
                    <div class="flex flex-row w-full items-center">
                        <label for="" class="text-nowrap font-medium text-sm mr-2">Name of Father:</label>
                        <InputMarriage label="First Name" labelPosition="below"
                            v-model="formData.bride_father_first_name" />
                        <InputMarriage label="Middle Name" labelPosition="below"
                            v-model="formData.bride_father_middle_name" />
                        <InputMarriage label="Last Name" labelPosition="below"
                            v-model="formData.bride_father_last_name" />
                    </div>

                    <div class="flex flex-row w-full items-center">
                        <label for="" class="text-nowrap font-medium text-xs mr-2">Maiden Name of Mother</label>
                        <InputMarriage label="First Name" labelPosition="below"
                            v-model="formData.groom_mother_first_name" />
                        <InputMarriage label="Middle Name" labelPosition="below"
                            v-model="formData.groom_mother_middle_name" />
                        <InputMarriage label="Last Name" labelPosition="below"
                            v-model="formData.groom_mother_last_name" />
                    </div>
                    <div class="flex flex-row w-full items-center">
                        <label for="" class="text-nowrap font-medium text-xs mr-2">Maiden Name of Mother</label>
                        <InputMarriage label="First Name" labelPosition="below"
                            v-model="formData.bride_mother_first_name" />
                        <InputMarriage label="Middle Name" labelPosition="below"
                            v-model="formData.bride_mother_middle_name" />
                        <InputMarriage label="Last Name" labelPosition="below"
                            v-model="formData.bride_mother_last_name" />
                    </div>

                    <div class="flex flex-row w-full items-center">
                        <label for="" class="text-nowrap font-medium text-sm mr-2">Residence:</label>
                        <InputMarriage label="Housen No., St., Barangay, City/Municipality,Province"
                            labelPosition="below" v-model="formData.groom__residence" />

                        <InputMarriage label="Country" labelPosition="below"
                            v-model="formData.groom__residence_country" />
                    </div>
                    <div class="flex flex-row w-full items-center">
                        <label for="" class="text-nowrap font-medium text-sm mr-2">Residence:</label>
                        <InputMarriage label="City/Municipality" labelPosition="below" />
                        <InputMarriage label="Province" labelPosition="below" />
                        <InputMarriage label="Country" labelPosition="below" />
                    </div>

                    <InputMarriage label="Person who gave consent" />
                    <InputMarriage label="Person who gave consent" />

                    <InputMarriage label="Relationship" />
                    <InputMarriage label="Relationship" />





                </div>
                <div class="w-full p-2 px-20">
                    <InputMarriage label="Remarks" />
                </div>
                <div class="w-full flex mt-auto">
                    <button
                        class="ml-auto border rounded border-gray-400 hover:bg-black hover:text-gray-50 transition-all font-medium p-2">Submit</button>
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
import InputBottomBorderMarriage from '../../components/Marriage/InputBottomBorderMarriage.vue';
import InputMarriage from '../../components/InputMarriage.vue';

const application_marriage_license_form = ref(false)

const open_modal = () => {
    application_marriage_license_form.value = true
}
const close_modal = () => {
    application_marriage_license_form.value = false
}

const initialForm = {
    date_application: '',
    date_marriage: '',
    date_issuance_marriage_license: '',
    place_marriage: ''
}

const formData = reactive({ ...initialForm })
</script>
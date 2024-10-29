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
                        <InputMarriage label="DATE OF APPLICATION" />
                        <InputMarriage label="DATE OF MARRIAGE" />
                    </div>
                    <div class="flex flex-col gap-1">
                        <InputMarriage label="DATE OF ISSUANCE OF MARRIAGE LICENSE:" />
                        <InputMarriage label="PLACE OF MARRIAGE" />
                    </div>
                    <div class="flex justify-center">
                        <p class="font-bold text-gray-800">GROOM</p>
                    </div>
                    <div class="flex justify-center">
                        <p class="font-bold text-gray-800">BRIDE</p>
                    </div>


                    <div class="flex flex-row w-full items-center">
                        <label for="" class="text-nowrap font-medium text-sm mr-2">Name:</label>
                        <InputMarriage label="First Name" labelPosition="below" />
                        <InputMarriage label="Middle Name" labelPosition="below" />
                        <InputMarriage label="Last Name" labelPosition="below" />
                    </div>
                    <div class="flex flex-row w-full items-center">
                        <label for="" class="text-nowrap font-medium text-sm mr-2">Name:</label>
                        <InputMarriage label="First Name" labelPosition="below" />
                        <InputMarriage label="Middle Name" labelPosition="below" />
                        <InputMarriage label="Last Name" labelPosition="below" />
                    </div>

                    <div class="flex flex-row w-full">
                        <InputMarriage label="Date of Birth" />
                        <div class="basis-[40%]">
                            <InputMarriage label="Age" />
                        </div>
                    </div>
                    <div class="flex flex-row w-full">
                        <InputMarriage label="Date of Birth" />
                        <div class="basis-[40%]">
                            <InputMarriage label="Age" />
                        </div>
                    </div>

                    <div class="flex flex-row w-full items-center">
                        <label for="" class="text-nowrap font-medium text-sm mr-2">Place of Birth:</label>
                        <InputMarriage label="City/Municipality" labelPosition="below" />
                        <InputMarriage label="Province" labelPosition="below" />
                        <InputMarriage label="Country" labelPosition="below" />
                    </div>
                    <div class="flex flex-row w-full items-center">
                        <label for="" class="text-nowrap font-medium text-sm mr-2">Place of Birth:</label>
                        <InputMarriage label="City/Municipality" labelPosition="below" />
                        <InputMarriage label="Province" labelPosition="below" />
                        <InputMarriage label="Country" labelPosition="below" />
                    </div>


                    <div class="flex flex-row w-full">
                        <InputMarriage label="Citizenship" />
                        <InputMarriage label="Civil Status" />
                    </div>
                    <div class="flex flex-row w-full">
                        <InputMarriage label="Citizenship" />
                        <InputMarriage label="Civil Status" />
                    </div>


                    <div class="flex flex-row w-full items-center">
                        <label for="" class="text-nowrap font-medium text-sm mr-2">Residence:</label>
                        <InputMarriage label="City/Municipality" labelPosition="below" />
                        <InputMarriage label="Province" labelPosition="below" />
                        <InputMarriage label="Country" labelPosition="below" />
                    </div>
                    <div class="flex flex-row w-full items-center">
                        <label for="" class="text-nowrap font-medium text-sm mr-2">Residence:</label>
                        <InputMarriage label="City/Municipality" labelPosition="below" />
                        <InputMarriage label="Province" labelPosition="below" />
                        <InputMarriage label="Country" labelPosition="below" />
                    </div>

                    <InputMarriage label="Religion" />
                    <InputMarriage label="Religion" />

                    <div class="flex flex-row w-full items-center">
                        <label for="" class="text-nowrap font-medium text-sm mr-2">Name of Father:</label>
                        <InputMarriage label="First Name" labelPosition="below" />
                        <InputMarriage label="Middle Name" labelPosition="below" />
                        <InputMarriage label="Last Name" labelPosition="below" />
                    </div>
                    <div class="flex flex-row w-full items-center">
                        <label for="" class="text-nowrap font-medium text-sm mr-2">Name of Father:</label>
                        <InputMarriage label="First Name" labelPosition="below" />
                        <InputMarriage label="Middle Name" labelPosition="below" />
                        <InputMarriage label="Last Name" labelPosition="below" />
                    </div>

                    <div class="flex flex-row w-full items-center">
                        <label for="" class="text-nowrap font-medium text-xs mr-2">Maiden Name of Mother</label>
                        <InputMarriage label="First Name" labelPosition="below" />
                        <InputMarriage label="Middle Name" labelPosition="below" />
                        <InputMarriage label="Last Name" labelPosition="below" />
                    </div>
                    <div class="flex flex-row w-full items-center">
                        <label for="" class="text-nowrap font-medium text-xs mr-2">Maiden Name of Mother</label>
                        <InputMarriage label="First Name" labelPosition="below" />
                        <InputMarriage label="Middle Name" labelPosition="below" />
                        <InputMarriage label="Last Name" labelPosition="below" />
                    </div>

                    <div class="flex flex-row w-full items-center">
                        <label for="" class="text-nowrap font-medium text-sm mr-2">Residence:</label>
                        <InputMarriage label="City/Municipality" labelPosition="below" />
                        <InputMarriage label="Province" labelPosition="below" />
                        <InputMarriage label="Country" labelPosition="below" />
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
                    <button class="ml-auto border rounded border-gray-400 hover:bg-black hover:text-gray-50 transition-all font-medium p-2">Submit</button>
                </div>
            </div>



        </Modal>


    </div>
</template>

<script setup>
import { ref } from 'vue';
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

</script>
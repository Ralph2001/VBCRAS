<template>
    <div class="flex flex-col relative justify-center w-full p-10">
        <Header label="Affidavit to use the Surname of the Father">
            <Button label="Create" isActive :class="`rounded`" @click="open_ausf" />
        </Header>

        <Modal v-if="ausf_modal" medium label="Create a new Affidavit to use the Surname of the Father"
            footerBG="bg-slate-300">
            <template v-slot:header>
                <ModalCloseButton @click="close_ausf" />
            </template>
            <div class="flex flex-col h-full w-full ">
                <div class="grid grid-cols-2 w-full mt-2">
                    <div></div>
                    <div class="flex flex-col gap-1">
                        <p class="underline text-sm font-neutral font-serif">LEGAL INSTRUMENT</p>
                        <div class="flex flex-row gap-2">
                            <label for="">Registry Number: </label>
                            <InputButtomBorder v-model="formData.registry_number" :width="`10rem`" />
                        </div>
                        <div class="flex flex-row gap-2">
                            <label for="">Date of Registration:</label>
                            <InputButtomBorder v-model="formData.date_registration" :width="`10rem`" />
                        </div>

                    </div>
                </div>
                <div class="w-full flex mt-3 justify-center">
                    <p class="text-center border-b-2 border-gray-400 border-dashed h-fit  font-medium w-fit">AFFIDAVIT
                        TO USE THE
                        SURNAME OF THE FATHER</p>
                </div>

                <div class="flex flex-col w-full  h-full py-10 px-5 ">
                    <div>
                        <div class="flex flex-row">
                            <p class=" indent-8">I,</p>
                            <InputButtomBorder v-model="formData.affiant_name" label="Affiant's name" />,
                            <InputButtomBorder v-model="formData.citizenship" label="Citizenship" :width="`5%`" />,
                            <InputButtomBorder v-model="formData.age" label="Age" :width="`5%`" />
                        </div>
                        <div class="flex flex-row w-full">
                            <p class="text-nowrap">and a resident of </p>
                            <InputButtomBorder v-model="formData.address" label="Complete Address" />
                            <p class="text-nowrap">after having been duly</p>
                        </div>
                        <p>sworn in accordance with law, do hereby declare that:</p>
                    </div>
                    <div class="flex flex-col gap-2 tracking-wide text-gray-800 mt-4">
                        <div class="flex flex-col">
                            <div class="flex flex-row"> 1. I am seeking the use of the surname
                                <InputButtomBorder v-model="formData.surname" :width="'20rem'" /> in:
                            </div>
                        </div>
                        <div class="flex flex-col w-full">
                            <div class="flex flex-row text-nowrap"> 2. I/He/She was born on
                                <InputButtomBorder v-model="formData.date_birth" :width="'13rem'" /> at
                                <InputButtomBorder v-model="formData.at_municipalty" :width="'6.2rem'" />,
                                <InputButtomBorder v-model="formData.at_province" :width="'6.1rem'" />,
                                <InputButtomBorder v-model="formData.at_country" :width="'6.2rem'" />.
                            </div>
                        </div>
                        <div class="flex flex-col">
                            <div class="flex flex-row text-nowrap"> 3. The birth was recorded under Registry No.
                                <InputButtomBorder :width="'6.2rem'" v-model="formData.registry_number" /> on
                                <InputButtomBorder :width="'6.2rem'" v-model="formData.date_registration" />.
                            </div>
                        </div>
                        <div class="flex flex-col w-full">
                            <p>4. The Affidavit of Admission of Paternity or the
                                Private
                                Handwritten Instrument was
                                recorded under</p>
                            <div class="flex flex-row">
                                Registry No.
                                <InputButtomBorder v-model="formData.registry_number" :width="'6.2rem'" /> on
                                <InputButtomBorder v-model="formData.registry_number" :width="'6.2rem'" />at the
                                <p class="underline">Local Civil Registry Office</p>
                            </div>
                            <div class="flex flex-row">
                                <span class="underline">(LCRO)</span>/Philippine Foreign Service Post (PFSP) of
                                <InputButtomBorder :width="'6.2rem'" /> (if
                                applicable).
                            </div>

                        </div>
                        <div class="flex flex-col">
                            <div class="flex flex-row"> 5. I am filing this AUSF at the Local Civil Registrar’s Office
                                of
                                <InputButtomBorder :width="'6.2rem'" /> in
                                accordance with R.A. No. 9255 and its Revised Implementing Rules and Regulations.
                            </div>
                        </div>
                        <div class="flex flex-col">
                            <div class="flex flex-row"> 6. I hereby certify that the statements made herein are true and
                                correct to
                                the
                                best of my
                                knowledge and belief.
                            </div>
                        </div>
                        <div class="flex flex-col">
                            <div class="flex flex-row"> 7. In witness whereof, I have hereby affix my signature on this
                                <InputButtomBorder :width="'6.2rem'" /> day of
                                <InputButtomBorder :width="'6.2rem'" />.
                            </div>
                        </div>
                    </div>

                    <div class="mt-10 flex flex-col w-[50%] self-end items-center ">
                        <InputButtomBorder />
                        <p>Signature over printed name of Affiant</p>
                    </div>

                    <div class="mt-10">
                        <p class=" indent-12"> SUBSCRIBED AND SWORN to before me this _____ day of _________________ in
                            the
                            city/municipality of
                            _______________________________, affiant exhibiting his/her
                            _________________________________________
                            issued at __________________________ on __________________. I certify that I personally
                            examined the
                            affiant and that he voluntarily executed the foregoing affidavit and understood the contents
                            thereof.
                        </p>
                    </div>

                </div>
            </div>
            <template v-slot:footer>
                <div class="h-full flex items-center justify-end gap-2 w-full">
                    <Button label="Submit" />
                </div>
            </template>
        </Modal>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import Modal from '../../components/client/modal/Modal.vue';
import Header from '../../components/essentials/header.vue';
import Button from '../../components/essentials/buttons/Button.vue';
import ModalCloseButton from '../../components/client/modal/ModalCloseButton.vue';
import InputforForm from '../../component/FormPageComponents/InputforForm.vue';
import InputButtomBorder from '../../components/essentials/inputs/InputButtomBorder.vue';

const ausf_modal = ref(false)

const open_ausf = () => {
    ausf_modal.value = true
}
const close_ausf = () => {
    ausf_modal.value = false
}


const initalForm = {
    registry_number: '',
    date_registration: '',
    affiant_name: '',
    citizenship: '',
    age: '',
    address: '',
    surname: '',
    date_birth: '',
    at_municipalty: '',
    at_province: '',
    at_country: '',
}
const formData = reactive({ ...initalForm })

</script>

<style lang="scss" scoped></style>
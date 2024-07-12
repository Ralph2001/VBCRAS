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
                        <InputButtomBorder label="Registry Number:" />
                        <InputButtomBorder label="Date of Registration:" />
                    </div>
                </div>
                <div class="w-full flex mt-3 justify-center">
                    <p class="text-center border-b-2 border-gray-400 border-dashed h-fit  font-medium w-fit">AFFIDAVIT
                        TO USE THE
                        SURNAME OF THE FATHER</p>
                </div>

                <div class="flex flex-col w-full border h-full p-10">
                    <div class="flex flex-row">I,
                        <InputButtomBorder />,
                        <InputButtomBorder />,
                        <InputButtomBorder />
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
import { ref } from 'vue';
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
</script>

<style lang="scss" scoped></style>
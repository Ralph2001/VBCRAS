<template>
    <Teleport to="body" v-if="preview">

        <Modal large footerBG="bg-white border-t border-gray-300" :footer="false">
            <template v-slot:header>
                <button
                    class="rounded px-2.5 bg-gray-200 py-1 text-sm hover:bg-red-400 outline-none hover:text-white font-medium text-gray-700"
                    @click="close_modal">
                    <font-awesome-icon icon="fa-solid fa-arrow-left" /> Return
                </button>
            </template>
            <div class="flex h-full  borer-red-700 justify-center items-center w-full pt-8">
                <div class="fixed flex flex-row right-0 left-0 bg-gray-700 top-9 px-4 z-50">
                    <div class="flex flex-row gap-3 ml-auto">
                        <button class=" font-medium text-sm p-2 text-gray-50 hover:bg-gray-600  flex items-center gap-1"
                            @click="print(props.params.data.id)">
                            <font-awesome-icon icon="fa-solid fa-print" />Print</button>

                    </div>
                </div>
                <div class="h-full  w-full flex   justify-center relative ">
                    <div class="h-full w-full flex items-center justify-center  relative ">
                        <PDFViewerWorker :pdfBytes64="pdf_content" v-if="isDocReady" />
                    </div>
                </div>
            </div>

        </Modal>

    </Teleport />


    <div class="w-full flex flex-col items-center justify-center h-full relative ">

        <button type="button" ref="mainBtn" @click="dropdown = !dropdown"
            :class="{ 'bg-gray-600 text-white hover:bg-gray-700': dropdown, 'text-gray-900 bg-white hover:bg-gray-100': !dropdown }"
            class="px-3 py-1 text-sm tracking-wide hover:border-gray-400 active:scale-95  font-medium text-center  rounded-sm  border transition-all focus:outline-none">
            Manage
        </button>


        <div class="h-auto flex flex-col items-start justify-center bg-white z-50  absolute top-[95%] right-0 border shadow-md w-52 "
            v-if="dropdown">


            <button type="button" @click="openPreview(props.params.data.id)"
                class="disabled:bg-gray-100 disabled:hover:cursor-not-allowed flex items-start text-md font-medium hover:bg-gray-100 w-full">
                <div class="w-10 ">
                    <font-awesome-icon icon="fa-solid fa-expand" />
                </div>
                <div class="flex-1  flex text-start px-1">
                    <p>View Document</p>
                </div>
            </button>

            <button type="button" @click="props.params.onEdit(props.params.data)"
                class="disabled:bg-gray-100 disabled:hover:cursor-not-allowed flex items-start text-md font-medium hover:bg-gray-100 w-full">
                <div class="w-10 ">
                    <font-awesome-icon icon="fa-solid fa-pen-to-square" />
                </div>
                <div class="flex-1  flex text-start px-1">
                    <p>Edit Document</p>
                </div>
            </button>
            <button type="button" @click="openFolder(props.params.data.file_path)"
                class="disabled:bg-gray-100 disabled:hover:cursor-not-allowed flex items-start text-md font-medium hover:bg-gray-100 w-full">
                <div class="w-10 ">
                    <font-awesome-icon icon="fa-solid fa-folder" />
                </div>
                <div class="flex-1  flex text-start px-1">
                    <p>Open Folder</p>
                </div>
            </button>

            <button type="button" @click="props.params.onRemove(props.params.data)"
                class="disabled:bg-gray-100 disabled:hover:cursor-not-allowed flex items-start text-md font-medium hover:bg-red-500  hover:text-white w-full">
                <div class="w-10 ">
                    <font-awesome-icon icon="fa-solid fa-trash" />
                </div>
                <div class="flex-1  flex text-start px-1">
                    <p>Delete Record</p>
                </div>
            </button>



        </div>
    </div>
</template>
<script setup>
import { onClickOutside } from '@vueuse/core';
import { ref } from 'vue';
import { useApplicationMarriageLicense } from '../../stores/APL';
import PDFViewerWorker from '../PDFViewerWorker.vue';
import Modal from '../client/modal/Modal.vue';

const preview = ref(false)
const isDocReady = ref(false)
const pdf_content = ref()
const mainBtn = ref(null)
onClickOutside(mainBtn, (event) => (dropdown.value = false));
const dropdown = ref(false)

const marriage = useApplicationMarriageLicense()
const props = defineProps({
    params: {
        type: Object,
        required: true
    }
})

const close_modal = () => {
    preview.value = false
}

const openPreview = async (id) => {
    try {
        preview.value = true
        const getDetails = await marriage.getApplicationMarriageLicenseById(id)
        if (getDetails.status === 200) {
            const data = getDetails.data
            const main_data = JSON.stringify({ ...data })
            const previewData = await window.MarriageApi.previewMarriage(main_data);
            if (previewData.status) {
                console.log(previewData)
                isDocReady.value = true
                pdf_content.value = previewData.pdfbase64;
            }
        }

    } catch (error) {
        console.log(error)
    }
}

const openFolder = async (path) => {
    try {
        const open = await window.LocalCivilApi.openSpecifiedFolder(path)
    } catch (error) {
        console.log(error)
    }
}

const print = async (id) => {
    const getDetails = await marriage.getApplicationMarriageLicenseById(id)
    if (getDetails.status === 200) {
        const data = getDetails.data
        const main_data = JSON.stringify({ ...data })
        const settings = JSON.stringify('')
        const previewData = await window.MarriageApi.printMarriage(main_data, settings);
    }

}

</script>
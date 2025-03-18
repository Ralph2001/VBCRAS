<template>
    <div class="h-full w-full fixed top-0 bottom-0 right-0 left-0 bg-white items-center flex justify-center z-[99999]">
        <div class="w-full bg-[#0D1B2A] flex  absolute  px-4 py-2 top-0 z-[99999]">
            <div class="flex flex-row gap-2 items-center">
                <p class="text-md  text-gray-100 font-medium  italic">
                    <!-- Correction of Clerical Error - Ralph Advincula Villanueva -->
                    Document Viewer
                </p>
            </div>
            <div class="flex flex-row gap-3 ml-auto">
                <button
                    class="text-white hover:text-white hover:bg-green-600 gap-3  text-sm bg-green-500  shadow-sm rounded-sm  outline-none font-medium px-4  py-1.5 tracking-wide flex flex-row  items-center"
                    v-if="active_pdf_link" @click="printPDF">
                    <font-awesome-icon icon="fa-solid fa-print" class="text-lg" />
                    <div class="flex flex-col  items-start ">
                        <p class="text-xs">Print Active
                            Document</p>
                        <p class="text-xs text-gray-50 font-thin">{{ active_pdf }}</p>
                    </div>

                </button>
                <button @click="exit_btn"
                    class="border  text-sm bg-white shadow-sm rounded-sm hover:bg-gray-300 outline-none font-medium px-2 w-20 py-1 tracking-wide">Exit</button>
            </div>
        </div>

        <button @click="sidebar = true"
            class="absolute left-0 top-0 bottom-0 pt-20 w-fit p-1 z-40 bg-gray-700 hover:bg-gray-800  transition-all outline-none flex items-center justify-center  ">
            <font-awesome-icon icon="fa-solid fa-angles-right" class=" text-lg  text-white" />
        </button>


        <div v-if="sidebar"
            class="absolute top-0 bottom-0 left-0 w-[20rem] z-40 pt-18 items-center gap-2 bg-[#0D1B2A]  flex flex-col transition-all">
            <div class="flex flex-row w-full h-full gap-1 bg-[#0D1B2A]">
                <div class=" w-full flex flex-col gap-2 items-center h-full pt-20 px-2">
                    <div class="w-full grid   shadow">
                        <button @click="changeMenu('Files')"
                            :class="[menu === 'Files' ? 'bg-gray-800' : 'hover:bg-gray-800']"
                            class="font-medium w-full transition-all text-gray-50 ">Documents</button>
                    </div>
                    <div class="flex flex-col gap-2 items-center justify-center w-full p-3 h-full   "
                        v-if="menu === 'Files'">
                        <button @click="change_active_pdf(item.name, item.link)" v-for="item in pdfs" :key="item"
                            :class="[active_pdf === item.name ? 'bg-blue-500 text-white ' : 'bg-white']"
                            class="p-2 shadow-inner outline-none ring-0 w-full hover:bg-blue-400 font-medium text-sm rounded-sm flex items-start">
                            {{ item.name }}
                        </button>
                        <div class="mt-10 flex flex-col gap-2 w-full">
                            <button v-if="props.details" @click="openfolder(props.details)"
                                class="bg-green-500 text-white hover:bg-green-600 flex justify-center items-center p-2 shadow-inner outline-none ring-0 w-full  font-medium text-xs rounded-sm ">
                                Open Folder
                            </button>
                            <button v-if="props.details" @click="create_certificate_filing(props.details)"
                                class="bg-yellow-300 hover:bg-yellow-400 flex justify-center items-center p-2 shadow-inner outline-none ring-0 w-full  font-medium text-xs rounded-sm ">
                                Create Certificate of Filing (.docx)
                            </button>
                            <div v-if="props.details" class="w-full">
                                <button
                                    v-if="props.details.petition_type === 'CFN' || props.details.republic_act_number === '10172'"
                                    @click="create_publication_letter(props.details)"
                                    class="bg-yellow-300 hover:bg-yellow-400 flex justify-center items-center p-2 shadow-inner outline-none ring-0 w-full  font-medium text-xs rounded-sm ">
                                    Publication Letter (.docx)
                                </button>
                            </div>
                        </div>

                    </div>
                    <div class="flex flex-col gap-2 items-center justify-center w-full h-full p-3">
                        <p class="italic text-[#0D1B2A]">Created by Ralph :)</p>

                    </div>

                </div>

                <button @click="sidebar = false"
                    class="h-full bg-[#0D1B2A] hover:bg-gray-800 z-[99999999999999999999] shadow-md px-2  transition-all outline-none flex items-center  justify-center  ">
                    <font-awesome-icon icon="fa-solid fa-angles-right " class=" text-lg  text-white rotate-180" />
                </button>

            </div>
        </div>

        <div class="absolute right-0 w-[2rem] h-full block bg-[#0D1B2A] ">

        </div>
        <div class="h-full w-full bg-[#0D1B2A] items-center flex justify-center">
            <div class=" z-[9999999]" v-if="!active_pdf_link">
                <p class="text-white italic">Select Option Above</p>
            </div>
            <PDFViewerWorker :scale="1" v-if="active_pdf_link" :pdfBytes64="active_pdf_link" />
        </div>
    </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import PDFViewerWorker from './PDFViewerWorker.vue';

const emit = defineEmits(['cancel-btn', 'save-print', 'exit-btn']);
const props = defineProps({
    pdf: {
        type: [String, Object, Array],
        default: null
    },
    status: {
        type: Boolean,
        default: false
    },
    pdf_data: {
        type: [Array, Object, String],

    },
    details: {
        type: [String, Object, Array],
    }
})


const pdfs = ref(props.pdf_data)
const active_pdf = ref(null)
const active_pdf_link = ref(null)
const sidebar = ref(false)
const menu = ref('Files')

function changeMenu(data) {
    menu.value = data
}

onMounted(() => {
    change_active_pdf(pdfs.value[0].name, pdfs.value[0].link)

})


const change_active_pdf = (name, link) => {
    active_pdf.value = name
    active_pdf_link.value = link
}



const exit_btn = () => {
    emit('exit-btn')
}
const handleKeydown = (event) => {
    // Check if Ctrl + P is pressed
    if (event.ctrlKey && event.key === 'p') {
        event.preventDefault() // Prevent the default action (such as opening print dialog)
        console.log('Ctrl + P was pressed')
        // Call your function here
        printPDF()
    }
}

const printPDF = async () => {
    const base64Data = active_pdf_link.value
    const open = await window.LocalCivilApi.printPDFBase64(base64Data)
}

const openfolder = async (param) => {
    try {
        const open = await window.ClericalApi.OpenClerical(param.file_path)
    } catch (error) {
        console.log(error)
        path_missing.value = true
        missing_path.value = param.file_path
    }
}

const create_certificate_filing = async (data) => {
    const create = await window.ClericalApi.CreateCertificateFiling(data)
}

const create_publication_letter = async (data) => {
    console.log(data)
    // const create = await window.ClericalApi.CreatePublicationLetter(data)
}


onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeydown)
})
</script>

<style lang="scss" scoped></style>
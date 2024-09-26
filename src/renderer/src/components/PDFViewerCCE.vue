<template>
    <div class="h-full w-full fixed top-0 bottom-0 right-0 left-0 bg-white items-center flex justify-center z-[99999]">
        <div class="w-full bg-[#525659] flex  absolute  p-4 top-0 z-[99999]">
            <div class="flex flex-row gap-2 items-center">
                <p class="text-md  text-gray-100 font-medium  italic">
                    <!-- Correction of Clerical Error - Ralph Advincula Villanueva -->
                    Document Viewer
                </p>
            </div>
            <div class="flex flex-row gap-3 ml-auto">
                <!-- <button class="border  text-sm bg-white shadow-sm rounded-sm px-3 py-1 tracking-wide">Print All</button> -->
                <!-- <button
                    class="border  text-sm bg-white shadow-sm rounded-sm hover:bg-gray-300 outline-none font-medium px-2 py-1 tracking-wide"
                    v-if="active_pdf_link" @click="printAllPDF">Print All</button> -->
                <button
                    class="border  text-sm bg-white shadow-sm rounded-sm hover:bg-gray-300 outline-none font-medium px-2 py-1 tracking-wide"
                    v-if="active_pdf_link" @click="printPDF">Print Active Document</button>
                <button @click="exit_btn"
                    class="border  text-sm bg-white shadow-sm rounded-sm hover:bg-gray-300 outline-none font-medium px-2 w-20 py-1 tracking-wide">Exit</button>
            </div>
        </div>

        <button @click="sidebar = true"
            class="absolute left-0 top-0 bottom-0 pt-20 w-fit p-1 bg-gray-700 hover:bg-gray-800  transition-all outline-none flex items-center justify-center  ">
            <font-awesome-icon icon="fa-solid fa-angles-right" class=" text-lg  text-white" />
        </button>


        <div v-if="sidebar"
            class="absolute top-0 bottom-0 left-0 w-[20rem]  pt-18 items-center gap-2 bg-[#525659] z-40 flex flex-col transition-all">
            <div class="flex flex-row w-full h-full gap-1 bg-gray-700">
                <div class=" w-full flex flex-col gap-2 items-center h-full pt-20 px-2">
                    <div class="w-full grid grid-cols-2 items-center justify-center  shadow">
                        <button @click="changeMenu('Files')"
                            :class="[menu === 'Files' ? 'bg-gray-800' : 'hover:bg-gray-800']"
                            class="font-medium transition-all text-gray-50 ">Files</button>
                        <button @click="changeMenu('Info')"
                            :class="[menu === 'Info' ? 'bg-gray-800' : 'hover:bg-gray-800']"
                            class="font-medium transition-all text-gray-50 hover:bg-gray-800">Info</button>
                    </div>
                    <div class="flex flex-col gap-2 items-center justify-center w-full p-3 h-full   "
                        v-if="menu === 'Files'">
                        <button @click="change_active_pdf(item.name, item.link)" v-for="item in pdfs" :key="item"
                            :class="[active_pdf === item.name ? 'bg-blue-500 text-white ' : 'bg-white']"
                            class="p-2 shadow-inner outline-none ring-0 w-full hover:bg-blue-400 font-medium text-sm rounded-sm flex items-start">
                            {{ item.name }}
                        </button>
                        <div class="mt-auto flex flex-col gap-2 w-full">
                            <button v-if="props.details" @click="openfolder(props.details)"
                                class="bg-blue-200 hover:bg-blue-300 flex justify-center items-center p-2 shadow-inner outline-none ring-0 w-full  font-medium text-sm rounded-sm ">
                                Open Folder
                            </button>
                            <button v-if="props.details" @click="create_certificate_filing(props.details)"
                                class="bg-yellow-200 hover:bg-yellow-300 flex justify-center items-center p-2 shadow-inner outline-none ring-0 w-full  font-medium text-sm rounded-sm ">
                                Create Certificate of Filing (.docx)
                            </button>
                        </div>

                    </div>
                    <div class="flex flex-col gap-2 items-center justify-center w-full h-full p-3"
                        v-if="menu === 'Info'">
                        <p class="italic text-white">Soon :)</p>

                        <!-- <div v-if="props.details" class="flex flex-col h-full overflow-y-scroll">
                            <div v-for="(key, value) in details">{{ key }}</div>
                        </div> -->
                    </div>

                </div>

                <button @click="sidebar = false"
                    class="h-full bg-gray-700 hover:bg-gray-800 shadow-md px-2  transition-all outline-none flex items-center  justify-center  ">
                    <font-awesome-icon icon="fa-solid fa-angles-right " class=" text-lg  text-white rotate-180" />
                </button>

            </div>
        </div>

        <div class="absolute right-0 w-[2rem] h-full block bg-[#525659] ">

        </div>
        <div class="h-full w-full bg-[#525659] items-center flex justify-center">
            <div class=" z-[9999999]" v-if="!active_pdf_link">
                <p class="text-white italic">Select Option Above</p>
            </div>

            <iframe ref="iframeRef" class="h-full w-full" v-if="active_pdf_link" :src="base64(active_pdf_link)"
                frameborder="1" allowfullscreen=""></iframe>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

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

function base64(data) {
    return 'data:application/pdf;filename=generated.pdf;base64,' + data
}
const pdfs = ref(props.pdf_data)
const active_pdf = ref(null)
const active_pdf_link = ref(null)
const sidebar = ref(true)
const menu = ref('Files')

function changeMenu(data) {
    menu.value = data
}

onMounted(() => {
    // console.log(pdfs.value[0].name)
    change_active_pdf(pdfs.value[0].name, pdfs.value[0].link)
    console.log(pdfs.value)
})


const change_active_pdf = (name, link) => {
    active_pdf.value = name
    active_pdf_link.value = link
}

const cancel = () => {
    emit('cancel-btn')
}

const save_print = () => {
    emit('save-print')
}

const exit_btn = () => {
    emit('exit-btn')
}

const printPDF = async () => {
    const base64Data = active_pdf_link.value
    const open = await window.LocalCivilApi.printPDFBase64(base64Data)
}

const printAllPDF = () => {
    // alert('Not Available yet')
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

</script>

<style lang="scss" scoped></style>
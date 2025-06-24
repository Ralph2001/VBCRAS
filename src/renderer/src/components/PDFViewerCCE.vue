<template>
    <div class="h-full w-full fixed top-0 bottom-0 right-0 left-0 bg-white items-center flex justify-center z-[99999]">

        <div class="w-full bg-[#0D1B2A] flex absolute px-4 py-2 top-0 z-[99999]">
            <div class="flex flex-row gap-2 items-center">
                <p class="text-md text-gray-100 font-medium italic">
                    Document Viewer
                </p>
            </div>
            <div class="flex flex-row gap-3 ml-auto items-center">

                <PrintManager :active_pdf_link="active_pdf_link" :active_pdf="active_pdf"
                    :count="document_file_count" />

                <button @click="show_timeline = !show_timeline"
                    class="border h-7 text-sm bg-white shadow-sm rounded-sm hover:bg-gray-300 outline-none font-medium px-2 w-fit tracking-wide"><font-awesome-icon
                        icon="fa-solid fa-timeline" /></button>
                <button @click="exit_btn"
                    class="border h-7 text-sm bg-white shadow-sm rounded-sm hover:bg-gray-300 outline-none font-medium px-2 w-20 tracking-wide">Exit</button>


            </div>
        </div>

        <button @click="sidebar = true"
            class="absolute left-0 top-0 bottom-0 pt-20 w-fit p-1 z-40 bg-gray-700 hover:bg-gray-800 transition-all outline-none flex items-center justify-center">
            <font-awesome-icon icon="fa-solid fa-angles-right" class="text-lg text-white" />
        </button>

        <div class="flex flex-row w-full h-full">
            <div v-if="sidebar"
                class="w-[20rem] z-40 pt-18 items-center gap-2 bg-[#0D1B2A] flex flex-col transition-all">
                <div class="flex flex-row w-full h-full gap-1 bg-[#0D1B2A]">
                    <div class=" w-full flex flex-col gap-2 items-center h-full pt-20 px-2">
                        <div class="w-full grid shadow">
                            <button @click="changeMenu('Files')"
                                :class="[menu === 'Files' ? 'bg-gray-800' : 'hover:bg-gray-800']"
                                class="font-medium w-full transition-all text-gray-50 ">Documents</button>
                        </div>
                        <div class="flex flex-col gap-2 items-center justify-center w-full p-3 h-full"
                            v-if="menu === 'Files'">
                            <button @click="change_active_pdf(item.name, item.link)" v-for="item in pdfs" :key="item"
                                :class="[active_pdf === item.name ? 'bg-blue-500 text-white ' : 'bg-white']"
                                class="p-2 shadow-inner items-center flex-row gap-2 outline-none ring-0 w-full hover:bg-blue-400 font-medium text-sm rounded-sm flex ">
                                <font-awesome-icon icon="fa-solid fa-file-pdf" class="text-[#F40F02]" /> {{ item.name }}
                            </button>
                            <div class="mt-4 flex flex-col gap-2 w-full">
                                <div v-if="props.details" class="w-full">
                                    <button
                                        v-if="props.details.petition_type === 'CFN' || props.details.republic_act_number === '10172'"
                                        @click="create_publication_letter(props.details)"
                                        class="p-2 bg-white shadow-inner items-center flex-row gap-2 outline-none ring-0 w-full h-8 hover:bg-blue-400 font-medium text-sm rounded-sm flex ">
                                        <font-awesome-icon icon="fa-solid fa-file-word" class="text-[#2B7Cd3]" />
                                        Publication Letter
                                    </button>
                                </div>
                                <button v-if="props.details" @click="create_certificate_filing(props.details)"
                                    class="p-2 bg-white shadow-inner items-center flex-row gap-2 outline-none ring-0 w-full h-8 hover:bg-blue-400 font-medium text-sm rounded-sm flex ">
                                    <font-awesome-icon icon="fa-solid fa-file-word" class="text-[#2B7Cd3]" /> Create
                                    Certificate of Filing
                                </button>
                                <button v-if="props.details" @click="openfolder(props.details)"
                                    class="p-2 bg-green-500 hover:bg-green-600 text-white shadow-inner items-center flex-row gap-2 text-center justify-center outline-none ring-0 w-full h-8 font-medium text-sm rounded-sm flex ">
                                    Open Folder
                                </button>
                            </div>
                        </div>
                        <div class="flex flex-col gap-2 items-center justify-center w-full h-full p-3">
                            <p class="italic text-[#0D1B2A]">Created by Ralph :)</p>
                        </div>
                    </div>
                    <button @click="sidebar = false"
                        class="h-full bg-[#0D1B2A] hover:bg-gray-800 z-[99999999999999999999] shadow-md px-2 transition-all outline-none flex items-center justify-center">
                        <font-awesome-icon icon="fa-solid fa-angles-right " class="text-lg text-white rotate-180" />
                    </button>
                </div>
            </div>

            <div class="absolute right-0 w-[2rem] h-full block bg-[#0D1B2A]"></div>
            <div class="h-full w-full bg-[#0D1B2A] items-center flex flex-1 justify-center relative">
                <div class="z-[9999999]" v-if="!active_pdf_link">
                    <p class="text-white italic">Select Option Above</p>
                </div>
                <PDFViewerWorker :scale="1.3" v-if="active_pdf_link" :pdfBytes64="active_pdf_link" />
                <div tabindex="-1"
                    class="absolute top-0 bottom-0 z-50 right-0 w-12 items-center bg-[#1B263B] hover:bg-[#0D1B2A] transition-all duration-400 group justify-center flex flex-col gap-2">
                    <button @click="nextPDF" tabindex="-1" class="w-full h-full" title="Next">
                        <font-awesome-icon icon="fa-solid fa-caret-right"
                            class="text-white opacity-30 text-5xl group-hover:opacity-100 outline-none ring-0 focus:outline-none focus:ring-0" />
                    </button>
                </div>
            </div>
        </div>

        <DateTree v-if="show_timeline" @close="show_timeline = false" :dates="[
            { date: details?.date_filed, title: 'Date Filed', description: 'Date Filed' },
            { date: details?.notice_posting, title: 'Notice of Posting' },
            { date: details?.certificate_posting_start, title: 'Certififate of Posting', description: 'Start of Certificate of Posting' },
            { date: details?.certificate_posting_end, title: 'Certificate of Posting', description: 'End of Certificate of Posting' },
            { date: details?.petition_date_issued, title: 'Date Issued' },
            { date: details?.petition_date_granted, title: 'Date Granted' },
        ]" />

    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import PDFViewerWorker from './PDFViewerWorker.vue';
import PrintManager from './PrintManager.vue'; // <-- Import the new component
import DateTree from './DateTree.vue';

const emit = defineEmits(['exit-btn']);

const props = defineProps({
    pdf_data: { type: [Array, Object, String] },
    details: { type: [String, Object, Array] }
});

const show_timeline = ref(false);
const pdfs = ref(props.pdf_data);
const active_pdf = ref(null);
const active_pdf_link = ref(null);
const currentIndex = ref(0);

const sidebar = ref(true);
const menu = ref('Files');

const changeMenu = (data) => menu.value = data;

onMounted(() => {
    if (pdfs.value && pdfs.value.length > 0) {
        change_active_pdf(pdfs.value[0].name, pdfs.value[0].link);
    }
});

const nextPDF = () => {
    if (currentIndex.value < pdfs.value.length - 1) {
        currentIndex.value++;
    } else {
        currentIndex.value = 0;
    }
    change_active_pdf(pdfs.value[currentIndex.value].name, pdfs.value[currentIndex.value].link);
};

const change_active_pdf = (name, link) => {
    active_pdf.value = name;
    active_pdf_link.value = link;
};

const document_file_count = computed(() => {
    if (active_pdf.value === 'Petition' || active_pdf.value === 'Posting') {
        return 2
    }
    return 1
});

const exit_btn = () => emit('exit-btn');

const openfolder = async (param) => {
    try {
        await window.ClericalApi.OpenClerical(param.file_path);
    } catch (error) {
        console.log(error);
        // Handle path missing error
    }
};

const create_certificate_filing = async (data) => {
    await window.ClericalApi.CreateCertificateFiling(data);
};

const create_publication_letter = async (data) => {
    await window.ClericalApi.CreatePublicationLetter(data);
};
</script>
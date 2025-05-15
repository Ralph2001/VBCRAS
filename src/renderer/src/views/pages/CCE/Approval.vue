<template>
    <div class="relative h-[calc(100vh-60px)] bg-[#FDFDFE] flex flex-col  md:lg:flex-row w-full overflow-y-scroll ">

        <PDFViewerCCE v-if="pdf_viewer" :pdf_data="data_pdfs" @exit-btn="exit_approval()" />
        <div role="dialog" aria-modal="true" v-if="isCreatingFinality"
            class="fixed top-0 bottom-0 left-0 right-0 h-full items-center justify-center flex p-4 z-50 backdrop-blur-sm backdrop-brightness-[0.7]"
            tabindex="-1">
            <div
                class="h-auto w-[25rem] gap-1 bg-[#FDFDFE] border rounded-md border-gray-300 shadow-sm flex flex-col p-4 items-center justify-center ">
                <!-- <Loading /> -->

                <div class="relative h-[10rem] w-full bg-gray-100 rounded-lg brightness-95 hover:border-gray-300 border   transition-all hover:brightness-100"
                    title="wave">
                    <Wave />
                </div>
                <p class="text-2xl text-gray-800 mt-5">Creating Finality</p>
                <p class="text-sm text-gray-600">
                    Please wait...
                </p>
            </div>
        </div>

        <div
            class="h-full bg-[#FDFDFE] border-s w-full border-gray-200 flex flex-col px-4 py-6 gap-4 md:w-[60%] shadow-md">
            <!-- Header -->
            <div class="w-full h-16 flex items-center justify-center bg-blue-500 text-white rounded">
                <p class="font-semibold text-lg">Petition Information</p>
            </div>

            <!-- Loading state -->
            <div v-if="loading" class="flex items-center justify-center h-full">
                <p class="text-sm text-gray-500">Getting petition info...</p>
            </div>

            <!-- Petition Info -->
            <div v-else class="w-full h-full flex flex-col gap-6 overflow-y-auto bg-white px-3 py-4 rounded">

                <!-- Basic Info List -->
                <div class="grid grid-cols-1 gap-3 text-sm text-gray-700">
                    <InfoRow label="Date Filed" :value="format(petition_info.date_filed, 'MMMM dd, yyyy')" />
                    <InfoRow label="Petition Type"
                        :value="petition_info.republic_act_number + ' ' + petition_info.petition_type" />
                    <InfoRow label="Event Type" :value="petition_info.event_type" />
                    <InfoRow label="Petition Number" :value="petition_info.petition_number" />
                    <InfoRow label="Petitioner Name" :value="petition_info.petitioner_name" />
                    <InfoRow label="Document Owner"
                        :value="petition_info.document_owner === 'N/A' ? petition_info.petitioner_name : petition_info.document_owner" />
                    <InfoRow v-if="petition_info.spouse_name && petition_info.relation_owner === 'Spouse'"
                        label="Spouse Name"
                        :value="petition_info.spouse_name === 'N/A' ? petition_info.petitioner_name : petition_info.spouse_name" />
                    <InfoRow label="Relation"
                        :value="petition_info.relation_owner === 'N/A' ? 'Owner' : petition_info.relation_owner" />
                    <InfoRow label="Prepared by" :value="petition_info.created_by_user.username" />
                    <InfoRow label="Petition Created" :value="format(petition_info.created_at, 'PPpp')" />
                </div>

                <!-- Clerical Errors / Change of First Name -->
                <section class="space-y-2">
                    <div class="bg-gray-700 text-white px-3 py-2 rounded font-medium text-center">
                        {{ petition_info.petition_type === 'CCE' ? 'Clerical Errors' : 'Change of First Name' }}
                    </div>
                    <table class="w-full text-sm text-left text-gray-600 border">
                        <thead class="text-xs text-gray-700 bg-gray-100">
                            <tr>
                                <th class="px-4 py-2">Item No.</th>
                                <th class="px-4 py-2">Description</th>
                                <th class="px-4 py-2">From</th>
                                <th class="px-4 py-2">To</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="data in clerical_errors" :key="data.error_num" class="border-t hover:bg-gray-50">
                                <td class="px-4 py-2">{{ data.error_num }}</td>
                                <td class="px-4 py-2">{{ data.description }}</td>
                                <td class="px-4 py-2">{{ data.error_description_from }}</td>
                                <td class="px-4 py-2">{{ data.error_description_to }}</td>
                            </tr>
                        </tbody>
                    </table>
                </section>

                <!-- Supporting Documents -->
                <section class="space-y-2">
                    <div class="bg-gray-700 text-white px-3 py-2 rounded font-medium text-center">
                        📎 Supporting Documents
                    </div>
                    <ul class="list-disc list-inside text-sm text-gray-800">
                        <li v-for="doc in petition_info.supporting_documents" :key="doc.id">
                            {{ doc.document_name }}
                        </li>
                    </ul>
                </section>
            </div>
        </div>


        <div class="flex flex-col p-10 gap-4 bg-[#FDFDFE] border border-gray-200 h-full w-full">

            <!-- Header -->
            <h2 class="text-2xl font-bold mt-5">Attachments</h2>

            <!-- Instruction Text -->
            <p class="text-sm text-gray-800">
                Add Requirement to proceed approval.
            </p>
            <p class="text-sm text-gray-800">
                Please ensure you have created an annotated 102 or Form 1A before proceeding with the petition approval
                process. This documentation is crucial for a thorough review and ensures all procedural standards are
                met.
            </p>

            <!-- Add Requirement Button & Dropdown -->
            <div class="relative w-fit">
                <button @click="annotated_unannotated = !annotated_unannotated" :class="[
                    'flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded border shadow-md',
                    annotated_unannotated ? 'bg-gray-700 text-white hover:bg-gray-800' : 'bg-[#FDFDFE] text-gray-700 hover:bg-gray-100',
                    selectfromscanned ? 'pointer-events-none opacity-50' : ''
                ]" type="button">
                    Add Requirement
                    <font-awesome-icon icon="fa-solid fa-arrow-down" class="text-xs" />
                </button>

                <div v-if="annotated_unannotated"
                    class="absolute top-full mt-1 bg-[#FDFDFE] border shadow-md p-3 flex flex-col gap-3 w-60 text-gray-600">
                    <p class="bg-gray-100 px-1 text-sm w-full">Annotated/Form 102</p>
                    <button @click="changetoSelectfromScanned"
                        class="flex items-center gap-2 w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-200 font-semibold rounded transition">
                        <font-awesome-icon icon="fa-solid fa-hand-pointer" class="text-sm" />
                        Select from Scanned
                    </button>
                    <button @click="open()"
                        class="flex items-center gap-2 w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-200 font-semibold rounded transition">
                        <font-awesome-icon icon="fa-solid fa-upload" class="text-sm" />
                        Upload PDF
                    </button>
                </div>

                <!-- Annotation confirmation -->
                <div v-if="annotation" class="flex items-center gap-2 mt-4 text-green-500 font-medium text-sm">
                    <p>Annotation Added</p>
                    <font-awesome-icon icon="fa-solid fa-check" />
                </div>
            </div>

            <!-- Scanned Documents Section -->
            <div v-if="selectfromscanned"
                class="flex flex-col bg-gray-100 border shadow-sm p-4 h-[calc(100vh-310px)] gap-4">
                <div class="flex justify-between items-center w-full">
                    <p class="text-lg font-medium text-gray-700 tracking-wide">Scanned Documents</p>
                    <input v-model="filter_search" type="text" placeholder="Search"
                        class="w-full max-w-xs border border-gray-300 rounded-md px-3 py-1 text-gray-700 placeholder:text-sm placeholder-gray-400" />
                </div>

                <div class="flex-grow overflow-auto rounded-md">
                    <div v-if="data.length < 1" class="flex items-center justify-center h-full text-gray-500">
                        No Result
                    </div>
                    <!-- Render scanned documents list here -->
                </div>

                <div class="flex justify-end gap-2 border-t pt-2">
                    <button @click="CancelSelectFromScanned"
                        class="px-4 py-1 rounded bg-red-400 text-white font-medium hover:bg-red-500 transition"
                        type="button">
                        Cancel
                    </button>
                    <button @click="submit()"
                        class="px-4 py-1 rounded bg-[#FDFDFE] text-gray-700 font-medium hover:bg-gray-200 transition"
                        type="button">
                        Select
                    </button>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end gap-4 mt-auto">
                <button @click="back"
                    class="w-40 py-2 text-sm font-medium text-gray-800 bg-[#FDFDFE] border rounded shadow-sm hover:bg-red-400 hover:text-white transition active:scale-95">
                    Cancel
                </button>
                <button @click="create_finality" :disabled="!annotation"
                    class="w-40 py-2 text-sm font-medium text-white rounded bg-green-600 hover:bg-green-500 disabled:bg-green-400 disabled:cursor-not-allowed transition"
                    type="button">
                    Approve
                </button>
            </div>

        </div>


        <div class="fixed  z-[9999] top-0 bottom-0  bg-white left-0 right-0 flex flex-col w-full  gap-2 "
            v-if="AnnotationEditor">

            <div class="h-full flex flex-col gap-1">
                <div class="flex flex-row w-full h-full  ">
                    <div class="flex-1 flex flex-col h-full   bg-black/10  w-full  relative  bottom-0">

                        <PDFViewerWorker :scale="0.7" :pdfBytes64="pdfbase64" />

                    </div>

                    <div class="flex flex-col gap-4 w-[40%] bg-white shadow-lg rounded-md">
                        <!-- Scrollable Inner Content -->
                        <div class="flex flex-col gap-4 p-4   border-gray-200  overflow-y-auto h-full">

                            <!-- Header -->
                            <h2 class="text-2xl font-semibold text-gray-800">Adjustments</h2>

                            <!-- Annotation Text Editor -->
                            <div class="flex flex-col gap-2">
                                <label class="text-sm font-medium text-gray-800">Annotation Text</label>
                                <QuillEditor theme="snow" :toolbar="['bold']" v-model:content="formData.annotation"
                                    contentType="html" />
                                <button @click="submit()"
                                    class="ml-auto w-fit px-4 py-1 text-sm font-medium text-gray-700 border border-gray-300 rounded hover:bg-blue-500 hover:text-white">
                                    Change
                                </button>
                            </div>

                            <!-- Form 102 Adjustments -->
                            <div>
                                <h3 class="mt-2 mb-2 text-sm font-semibold text-gray-800">Form 102 Position</h3>
                                <div class="flex flex-col gap-2">
                                    <div class="grid grid-cols-[6rem_1fr] gap-3 items-center">
                                        <input type="number" step="0.1" v-model="formData.form_scale" @input="submit"
                                            class="py-1 border border-gray-300 rounded w-full" />
                                        <label class="text-sm text-gray-700 flex items-center gap-1">
                                            <font-awesome-icon icon="fa-solid fa-up-right-and-down-left-from-center"
                                                class="w-4" />
                                            Scale
                                        </label>
                                    </div>

                                    <div class="grid grid-cols-[6rem_1fr] gap-3 items-center">
                                        <input type="number" step="0.1" v-model="formData.form_x" @input="submit"
                                            class="py-1 border border-gray-300 rounded w-full" />
                                        <label class="text-sm text-gray-700 flex items-center gap-1">
                                            <font-awesome-icon icon="fa-solid fa-left-right" class="w-4" />
                                            Horizontal
                                        </label>
                                    </div>

                                    <div class="grid grid-cols-[6rem_1fr] gap-3 items-center">
                                        <input type="number" step="0.1" v-model="formData.form_y" @input="submit"
                                            class="py-1 border border-gray-300 rounded w-full" />
                                        <label class="text-sm text-gray-700 flex items-center gap-1">
                                            <font-awesome-icon icon="fa-solid fa-up-down" class="w-4" />
                                            Vertical
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <!-- Divider -->
                            <hr class="border-t border-gray-300 my-2" />

                            <!-- Annotation Adjustments -->
                            <div>
                                <h3 class="mb-2 text-sm font-semibold text-gray-800">Annotation Settings</h3>
                                <div class="flex flex-col gap-2">
                                    <div class="grid grid-cols-[6rem_1fr] gap-3 items-center">
                                        <input type="number" step="0.1" v-model="formData.annotation_width"
                                            @input="submit" class="py-1 border border-gray-300 rounded w-full" />
                                        <label class="text-sm text-gray-700 flex items-center gap-1">
                                            <font-awesome-icon icon="fa-solid fa-left-right" class="w-4" />
                                            Width
                                        </label>
                                    </div>

                                    <div class="grid grid-cols-[6rem_1fr] gap-3 items-center">
                                        <input type="number" step="0.1" v-model="formData.annotation_x" @input="submit"
                                            class="py-1 border border-gray-300 rounded w-full" />
                                        <label class="text-sm text-gray-700 flex items-center gap-1">
                                            <font-awesome-icon icon="fa-solid fa-left-right" class="w-4" />
                                            Horizontal
                                        </label>
                                    </div>

                                    <div class="grid grid-cols-[6rem_1fr] gap-3 items-center">
                                        <input type="number" step="0.1" v-model="formData.annotation_y" @input="submit"
                                            class="py-1 border border-gray-300 rounded w-full" />
                                        <label class="text-sm text-gray-700 flex items-center gap-1">
                                            <font-awesome-icon icon="fa-solid fa-up-down" class="w-4" />
                                            Vertical
                                        </label>
                                    </div>

                                    <div class="grid grid-cols-[6rem_1fr] gap-3 items-center">
                                        <input type="number" step="0.1" v-model="formData.annotation_font_size"
                                            @input="submit" class="py-1 border border-gray-300 rounded w-full" />
                                        <label class="text-sm text-gray-700 flex items-center gap-1">
                                            <font-awesome-icon icon="fa-solid fa-text-height" class="w-4" />
                                            Font Size
                                        </label>
                                    </div>

                                    <!-- Rotation -->
                                    <div class="flex items-center gap-2 mt-2">
                                        <div class="flex gap-1">
                                            <button @click="change_annotation_width(-90)"
                                                :class="formData.annotation_rotation === -90 ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-700'"
                                                class="w-9 h-9 border rounded hover:shadow-sm">
                                                <font-awesome-icon icon="fa-solid fa-arrows-up-down" />
                                            </button>
                                            <button @click="change_annotation_width(0)"
                                                :class="formData.annotation_rotation === 0 ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-700'"
                                                class="w-9 h-9 border rounded hover:shadow-sm">
                                                <font-awesome-icon icon="fa-solid fa-arrows-left-right" />
                                            </button>
                                        </div>
                                        <span class="text-sm ml-6 text-gray-700 flex items-center gap-1">
                                            <font-awesome-icon icon="fa-solid fa-text-height" class="w-4" />
                                            Text Rotation
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Footer Buttons -->
                        <div class="flex justify-end gap-2 px-4 py-3 border-t border-gray-200">
                            <!-- Cancel Button -->
                            <button @click="AnnotationEditor = !AnnotationEditor"
                                class="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600 transition-colors">
                                Cancel
                            </button>

                            <!-- Proceed Button -->
                            <button @click="create_annotation()" type="button"
                                class="px-6 py-2 text-sm font-medium text-white bg-green-500 rounded hover:bg-green-600 transition-colors">
                                Proceed
                            </button>
                        </div>

                    </div>

                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import { onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { usePetitions } from '../../../stores/Petition/petitions';
import ExplorerView from '../../../components/client/ExplorerView.vue';
import { useFileDialog } from '@vueuse/core'
// import { RecycleScroller } from 'vue-virtual-scroller';
import { useScannedDocuments } from '../../../stores/Scanned';
import { computed } from 'vue';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { useComputerStore } from '../../../stores/Computer';
import Wave from '../../../components/Wave.vue';
import { format } from 'date-fns';
import PDFViewerWorker from '../../../components/PDFViewerWorker.vue';
import PDFViewerCCE from '../../../components/PDFViewerCCE.vue';
import InfoRow from '../../../components/Correction/InfoRow.vue';

const computer = useComputerStore()



const filter_type = ref('Birth')
const filter_year = ref(2024)
const filter_search = ref('')
const AnnotationEditor = ref(false)

const pdf_viewer = ref(false)
const data_pdfs = ref()

const petition = usePetitions()
const router = useRouter();
const route = useRoute();
const annotated_unannotated = ref(false)
const selectfromscanned = ref(false)
const selectedscanned = ref()
const pdfbase64 = ref()
const annotation_text = ref()
const annotation = ref(false)

const isCreatingFinality = ref(false)

const petition_info = ref()


const changetoSelectfromScanned = () => {
    selectfromscanned.value = true
    annotated_unannotated.value = false
}

// Scanned Documents Usage
const Documents = useScannedDocuments();

const data = computed(() => {
    return Documents.scanned
});


const petition_data = ref()

const CancelSelectFromScanned = () => {
    selectfromscanned.value = false
    selectedscanned.value = ''
    data.value = null
}


const clerical_errors = ref();
const loading = ref(true);
onMounted(async () => {
    computer.getUserName()
    petition_info.value = await petition.get_petition_by_id(route.params.id)


    const first_name_from = petition_info.value.first_name_from
    const first_name_to = petition_info.value.first_name_to
    if (petition_info.value.petition_type === "CCE") {
        clerical_errors.value = petition_info.value.clerical_errors
    } else if (petition_info.value.petition_type === "CFN") {
        const main_value = [
            {
                error_num: '1',
                description: 'Change of First Name',
                error_description_from: first_name_from,
                error_description_to: first_name_to,
            }
        ]
        clerical_errors.value = main_value
    }


    loading.value = false;
    console.log(clerical_errors.value)


})


const back = () => {
    router.push('/pages/cce')
}

function change_annotation_width(val) {
    formData.annotation_rotation = val
    val === -90 ? formData.annotation_width = 900 : formData.annotation_width = 500
    val === -90 ? formData.annotation_x = 590 : formData.annotation_x = 50
    val === -90 ? formData.annotation_y = 450 : formData.annotation_y = 50
    submit()
}

const initialFormData = {
    filepath: '',
    //Make This Dynamic

    annotation:
        `<p>Pursuant to the decision rendered by <strong>MCR ISMAEL D. MALICDEM, JR. </strong> </p>`,
    form_scale: 0.9,
    form_x: 1.7,
    form_y: 25,

    // Annotation Adjustments
    annotation_width: 800,
    annotation_x: 590,
    annotation_y: 450,
    annotation_font_size: 12,
    annotation_rotation: -90,
};

const formData = reactive({ ...initialFormData });
const open = async () => {
    const file = await window.LocalCivilApi.selectFile()

    formData.filepath = file.replace(`C:\\Users\\${computer.desktop_name}\\`, '')

    submit()
    annotated_unannotated.value = false

}

const submit = async () => {

    // Purpose
    /**
     *  0 Edit
     *  1 Save
     */

    // Create Annotation
    // Generate Endorsement and Finality Letter
    // Save All in Saved Filepath
    // Add to Database

    const data = {
        filepath: formData.filepath,
        annotation: formData.annotation,
        form_scale: formData.form_scale,
        form_x: formData.form_x,
        form_y: formData.form_y,

        // Annotation
        annotation_width: formData.annotation_width,
        annotation_x: formData.annotation_x,
        annotation_y: formData.annotation_y,
        annotation_font_size: formData.annotation_font_size,
        annotation_rotation: formData.annotation_rotation
    }
    const submit = await window.ClericalApi.CreateAnnotated(data);

    AnnotationEditor.value = true
    pdfbase64.value = submit.pdfbase64
    raw_pdf.value = submit.pdfbase64
}
const raw_pdf = ref()


function create_annotation() {
    annotation.value = true
    AnnotationEditor.value = false
}
const create_finality = async () => {
    isCreatingFinality.value = true
    const data = JSON.stringify(petition_info.value)

    const annotation_data = {
        file: raw_pdf.value,
        path: petition_info.value.file_path
    }
    const annotation = await window.ClericalApi.SaveAnnotated(JSON.stringify(annotation_data))
    const create = await window.ClericalApi.CreateFinality(data)

    if (create) {

        const data = {
            status: 'FINISHED'
        }


        isCreatingFinality.value = false
        const update_database = await petition.edit_petition(petition_info.value.id, data)
        console.log(update_database)
        open_generated(petition_info.value.file_path)

    }
}


const open_generated = async (path) => {
    const check = await window.ClericalApi.OpenClericalFiles(path);
    data_pdfs.value = check
    pdf_viewer.value = !pdf_viewer.value
}

const exit_approval = async () => {
    pdf_viewer.value = false
    pdfbase64.value = ''
    raw_pdf.value = ''
    // await petition.get_all_petitions()
    router.push('/pages/cce')

}

</script>

<style lang="scss" scoped></style>
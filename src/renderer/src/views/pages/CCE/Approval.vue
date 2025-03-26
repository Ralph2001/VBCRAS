<template>
    <div class="relative h-[calc(100vh-60px)] bg-[#FDFDFE] flex  md:lg:flex-row w-full overflow-y-scroll ">

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

        <div class="h-full  bg-[#FDFDFE] border-s border-gray-200 flex flex-col px-4 py-6 gap-2 w-[60%] shadow-md ">
            <div class="w-full h-16 flex items-center justify-center bg-blue-400 text-white">
                <p class="font-medium  text-lg">Petition Info</p>
            </div>
            <div v-if="loading" class="flex items-center justify-center h-full">
                <p class="text-sm text-gray-500">Getting petition info...</p>
            </div>
            <!---->
            <div v-else class="w-full h-full flex flex-col p-3 gap-5 py-4 overflow-y-scroll bg-neutral-50/80 ">
                <div class="flex flex-row h-auto ">
                    <p class="w-[8rem] font-normal text-sm justify-start flex text-gray-900 ">Date Filed</p>
                    <p class="w-fit text-sm justify-start flex">:</p>
                    <p class="grow font-medium px-2 text-sm justify-start flex">{{ format(petition_info.date_filed,
                        'MMMM dd, yyyy') }}
                    </p>
                </div>
                <div class="flex flex-row h-auto ">
                    <p class="w-[8rem] font-normal text-sm justify-start flex text-gray-900 ">Petition Type</p>
                    <p class="w-fit text-sm justify-start flex">:</p>
                    <p class="grow font-medium px-2 text-sm justify-start flex">{{ petition_info.republic_act_number + `
                        ` +
                        petition_info.petition_type }}
                    </p>
                </div>
                <div class="flex flex-row h-auto ">
                    <p class="w-[8rem] font-normal text-sm justify-start flex text-gray-900 ">Event Type</p>
                    <p class="w-fit text-sm justify-start flex">:</p>
                    <p class="grow font-medium px-2 text-sm justify-start flex">{{ petition_info.event_type }}</p>
                </div>
                <div class="flex flex-row h-auto ">
                    <p class="w-[8rem] font-normal text-sm justify-start flex text-gray-900 ">Petition Number</p>
                    <p class="w-fit text-sm justify-start flex">:</p>
                    <p class="grow font-medium px-2 text-sm justify-start flex">{{ petition_info.petition_number }}</p>
                </div>
                <div class="flex flex-row h-auto ">
                    <p class="w-[8rem] font-normal text-sm justify-start flex text-gray-900 ">Petitioner Name</p>
                    <p class="w-fit text-sm justify-start flex">:</p>
                    <p class="grow font-medium px-2 text-sm justify-start flex">{{ petition_info.petitioner_name }}</p>
                </div>
                <div class="flex flex-row h-auto ">
                    <p class="w-[8rem] font-normal text-sm justify-start flex text-gray-900 ">Document Owner</p>
                    <p class="w-fit text-sm justify-start flex">:</p>
                    <p class="grow font-medium px-2 text-sm justify-start flex">{{ petition_info.document_owner ===
                        "N/A" ?
                        petition_info.petitioner_name : petition_info.document_owner }}</p>
                </div>
                <div class="flex flex-row h-auto "
                    v-if="petition_info.spouse_name !== '' && petition_info.relation_owner === 'Spouse'">
                    <p class="w-[8rem] font-normal text-sm justify-start flex text-gray-900 ">Spouse Name</p>
                    <p class="w-fit text-sm justify-start flex">:</p>
                    <p class="grow font-medium px-2 text-sm justify-start flex">{{ petition_info.spouse_name ===
                        "N/A" ?
                        petition_info.petitioner_name : petition_info.spouse_name }}</p>
                </div>
                <div class="flex flex-row h-auto ">
                    <p class="w-[8rem] font-normal text-sm justify-start flex text-gray-900 ">Relation</p>
                    <p class="w-fit text-sm justify-start flex">:</p>
                    <p class="grow font-medium px-2 text-sm justify-start flex">{{ petition_info.relation_owner ===
                        "N/A" ?
                        'Owner' : petition_info.relation_owner }}</p>
                </div>
                <div class="flex flex-row h-auto ">
                    <p class="w-[8rem] font-normal text-sm justify-start flex text-gray-900 ">Prepared by</p>
                    <p class="w-fit text-sm justify-start flex">:</p>
                    <p class="grow font-medium px-2 text-sm justify-start flex">{{
                        petition_info.created_by_user.username }}</p>
                </div>
                <div class="flex flex-row h-auto ">
                    <p class="w-[8rem] font-normal text-sm justify-start flex text-gray-900 ">Petition Created</p>
                    <p class="w-fit text-sm justify-start flex">:</p>
                    <p class="grow font-medium px-2 text-sm justify-start flex">{{ format(petition_info.created_at,
                        'PPpp') }}
                    </p>
                </div>
                <div class="w-full bg-gray-700 rounded  text-white flex items-center  justify-center">
                    <p class="font-medium p-2">{{ petition_info.petition_type === "CCE" ? `Clerical Errors` : `Change of
                        First Name` }}</p>
                </div>


                <div>
                    <table class="w-full text-sm text-left rtl:text-right text-gray-500  h-full">
                        <thead class="text-xs text-gray-700 uppercase bg-gray-50  ">
                            <tr>
                                <th scope="col" class="px-6 py-3">
                                    Item No.
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Description
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    From
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    To
                                </th>
                            </tr>
                        </thead>
                        <tbody class="h-full">
                            <tr class="bg-[#FDFDFE] border-b  " v-for="data in clerical_errors">
                                <th scope="row" class="px-6 py-4  text-gray-900 whitespace-nowrap ">
                                    {{ data.error_num }}
                                </th>
                                <td class="px-6 py-4 font-medium text-gray-900 ">
                                    {{ data.description }}
                                </td>
                                <td class="px-6 py-4 font-medium text-gray-900 ">
                                    {{ data.error_description_from }}
                                </td>
                                <td class="px-6 py-4 font-medium text-gray-900 ">
                                    {{ data.error_description_to }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="w-full bg-gray-700 rounded text-white  flex items-center  justify-center">
                    <p class="font-medium p-2"><font-awesome-icon icon="fa-solid fa-paperclip" /> Supporting Documents
                    </p>
                </div>
                <div class="px-4">

                    <ul class="list-disc space-y-1">
                        <li class="font-medium text-neutral-800" v-for="data in petition_info.supporting_documents"
                            :key="data.id">
                            {{ data.document_name }}
                        </li>
                    </ul>

                    <!-- <tbody class="h-full">
                            <tr class="bg-[#FDFDFE] border-b  " v-for="data in petition_info.supporting_documents">

                                <th scope="row" class="px-6 py-4  text-gray-900 ">
                                    {{ data.document_name }}
                                </th>

                            </tr>
                        </tbody> -->

                </div>
            </div>

        </div>

        <div class="w-full h-full  bg-[#FDFDFE] border-s border-gray-200 flex flex-col p-10 gap-2 ">

            <p class="font-bold text-2xl mt-5">Attachments</p>
            <div class="flex items-center p-2">
                <p class="font-normal text-sm text-gray-800">
                    Add Requirement to proceed approval.
                </p>
            </div>
            <p class="font-normal text-sm text-gray-800 mt-2">
                Please ensure you have created an annotated 102 or Form 1A before proceeding with the petition approval
                process. This documentation is crucial as it provides the necessary details and verification required
                for a thorough review. Completing the annotated form ensures that all aspects of the petition are
                clearly outlined and meet our procedural standards, allowing you to move forward confidently in the
                approval workflow.
            </p>




            <div class="flex flex-col w-full p-1 gap-2 relative">
                <button
                    :class="{ 'bg-gray-700 text-white  hover:text-white hover:bg-gray-800': annotated_unannotated, 'bg-[#FDFDFE]': !annotated_unannotated, ' pointer-events-none bg-gray-700 text-white hidden hover:text-white hover:bg-gray-800  ': selectfromscanned }"
                    class="w-fit text-sm font-semibold px-2.5 py-2 text-gray-700 shadow-md rounded border  items-center flex hover:bg-gray-100"
                    type="button" @click="annotated_unannotated = !annotated_unannotated"> Add Requirement
                    <font-awesome-icon icon="fa-solid fa-arrow-down" class="ms-2 text-xs" /></button>

                <div class="h-auto flex flex-col absolute top-10 bg-[#FDFDFE] w-fit p-2 border items-start mt-5 gap-3 shadow-md transition-all text-gray-600"
                    v-if="annotated_unannotated">
                    <p class="text-sm bg-gray-100 px-1 w-full">Annotated/Form 102</p>
                    <div class="flex flex-col items-start    w-full">
                        <button type="button" @click="changetoSelectfromScanned"
                            class="w-full text-left font-semibold py-2 bg-gray-50 px-2.5 hover:bg-gray-200 transition-all flex items-center"><font-awesome-icon
                                icon="fa-solid fa-hand-pointer" class="text-sm me-2" /> Select
                            from
                            Scanned</button>
                        <button type="button"
                            class="w-full text-left font-semibold py-2 bg-gray-50 px-2.5 hover:bg-gray-200 transition-all flex items-center"
                            @click="open()"><font-awesome-icon icon="fa-solid fa-upload" class="text-sm me-2" /> Upload
                            PDF</button>
                    </div>
                    <!-- <p class="text-sm bg-gray-100 px-1  w-full">Unannotated/ Form 1A</p>
                    <div class="flex flex-col items-start w-full">
                        <button type="button"
                            class="w-full text-left font-semibold py-2 bg-gray-50 px-2.5 hover:bg-gray-200 transition-all flex items-center"><font-awesome-icon
                                icon="fa-solid fa-plus" class="text-sm me-2" /> Create
                            1A</button>
                    </div> -->
                </div>
                <div v-if="annotation" class="flex mt-4 flex-row gap-2 items-center text-green-500">
                    <p class="font-medium text-sm ">Annotation Added</p>
                    <font-awesome-icon icon="fa-solid fa-check" />
                </div>
            </div>



            <div class="border bg-gray-100 shadow-sm flex px-4 py-3 h-[calc(100vh-310px)] w-full flex-col gap-2"
                v-if="selectfromscanned">
                <div class="grid sm:grid-flow-row md:lg:grid-cols-2  items-center justify-between w-full ">
                    <p class=" font-medium text-gray-700 tracking-wide text-lg"> Scanned Documents</p>
                    <div class="mr-auto w-full flex flex-row gap-2">
                        <input v-model="filter_search" type="text" placeholder="Search"
                            class="border-gray-300 rounded-md text-gray-700 font-medium w-full placeholder:text-sm placeholder:text-gray-400">
                    </div>

                </div>
                <div class="h-full  rounded-md  truncate overflow-x-hidden ">
                    <!-- <RecycleScroller :items="data" class="h-full " :item-size="34" key-field="name" v-slot="{ item }"
                        v-if="data.length > 1">
                        <li :class="{ 'bg-blue-200': formData.filepath === item.name }"
                            class="w-full overflow-hidden truncate px-3 p-1 hover:bg-blue-100  flex items-center">
                            <input v-model="formData.filepath" type="radio" class=" rounded-md cursor-pointer"
                                name="scans" :id="item.id" :value="item.filepath"
                                :checked="formData.filepath === item.filepath">
                            <label :for="item.id" class=" cursor-pointer"> <font-awesome-icon
                                    icon="fa-solid fa-file-pdf" class="text-red-500 me-2 ms-3" />
                                {{ item.name.replace(".pdf", "") }} </label>
                        </li>
                    </RecycleScroller> -->
                    <div class="h-full w-full flex items-center justify-center" v-if="data.length < 1">
                        No Result
                    </div>
                </div>
                <div class="mt-auto border-t p-1 flex flex-row w-full">
                    <!-- <div class="w-full overflow-hidden"><p class=" font-medium text-gray-700 tracking-wide truncate"> Selected: <span class=" font-normal underline">{{ selectedscanned }}</span></p></div> -->
                    <div class="flex flex-row ml-auto gap-2">
                        <button type="button" @click="CancelSelectFromScanned"
                            class=" font-medium text-sm border px-2.5 py-1 rounded bg-red-400 hover:bg-red-500  text-white">
                            Cancel
                        </button>
                        <button type="button" @click="submit()"
                            class=" font-medium text-sm border px-2.5 py-1 rounded bg-[#FDFDFE] hover:bg-gray-200 text-gray-700">
                            Select
                        </button>
                    </div>
                </div>
            </div>


            <div class="mt-auto ml-auto bottom-0 right-10 gap-2 flex">
                <!-- <button
                    class="border w-[10rem] rounded-sm bg-gray-800 hover:bg-gray-900 text-sm py-2  text-white font-medium shadow-sm transition-all active:scale-95 ">Impugn</button> -->
                <button @click="back"
                    class="border w-[10rem] rounded-sm bg-[#FDFDFE] text-sm py-2 hover:bg-red-400 text-gray-800 font-medium shadow-sm transition-all active:scale-95 hover:text-white">Cancel</button>

                <button type="button" @click="create_finality" :disabled="!annotation"
                    class="bg-green-600 disabled:bg-green-400 disabled:hover:cursor-not-allowed hover:bg-green-500 hover:cursor-pointer py-2 px-10 font-medium rounded-sm text-white ">Approve</button>

            </div>
        </div>
        <div>


        </div>
        <!-- <ul v-for="(value, key) in petition.petition_data" :key="key">
            <li>{{ key + ' : ' + value }}</li>
        </ul> -->
        <div class="fixed  z-[9999] top-0 bottom-0  bg-white left-0 right-0 flex flex-col w-full  gap-2 "
            v-if="AnnotationEditor">

            <div class="h-full flex flex-col gap-1">
                <div class="flex flex-row w-full h-full  ">
                    <div class="flex-1 flex flex-col h-full   bg-black/10  w-full  relative  bottom-0">

                        <PDFViewerWorker :scale="0.7" :pdfBytes64="pdfbase64" />

                    </div>

                    <div class="flex flex-col gap-1 w-[40%]  bg-white shadow-lg">
                        <div
                            class="flex flex-col p-4  w-full border gap-2 rounded-md border-gray-200 shadow-md overflow-y-scroll h-full">
                            <p class="text-gray-800 font-medium text-2xl h-[3rem] ">Adjustments </p>
                            <div class="h-auto flex flex-col gap-2">
                                <p class="text-gray-800 text-sm font-medium">Annotation Text</p>
                                <QuillEditor theme="snow" :toolbar="['bold']" v-model:content="formData.annotation"
                                    contentType="html" />

                                    {{ formData.annotation }}
                                <button @click="submit()"
                                    class="border rounded border-gray-300 font-medium text-sm hover:bg-blue-500 hover:text-white w-fit p-2 ml-auto">Change</button>
                            </div>

                            <p class="text-gray-800 text-sm font-medium mt-2">Adjustments</p>
                            <div class="  items-start flex flex-col flex-wrap  p-2 gap-3">
                                <div class="flex flex-row items-center gap-3">
                                    <input type="number" step="0.1" v-model="formData.form_scale" @input="submit"
                                        class="w-[6rem] py-1 border-gray-200 rounded">
                                    <p class="text-gray-700 flex items-center"> <font-awesome-icon
                                            icon="fa-solid fa-up-right-and-down-left-from-center" class="text-xs w-6" />
                                        Form
                                        102
                                        Scale</p>
                                </div>
                                <div class="flex flex-row items-center gap-3">
                                    <input type="number" step="0.1" v-model="formData.form_x" @input="submit"
                                        class="w-[6rem] py-1 border-gray-200 rounded">
                                    <p class="text-gray-700 flex items-center"> <font-awesome-icon
                                            icon="fa-solid fa-left-right" class="text-xs w-6" /> Form 102
                                        Horizontal Position</p>
                                </div>
                                <div class="flex flex-row items-center gap-3">
                                    <input type="number" step="0.1" v-model="formData.form_y" @input="submit"
                                        class="w-[6rem] py-1 border-gray-200 rounded">
                                    <p class="text-gray-700 flex items-center"> <font-awesome-icon
                                            icon="fa-solid fa-up-down" class="text-xs w-6" /> Form 102 Vertical Position
                                    </p>
                                </div>

                            </div>
                            <div class="block w-full border border-gray-600"></div>
                            <div class="  items-start  p-2 gap-2 flex flex-col ">
                                <div class="flex flex-row items-center gap-3">
                                    <input type="number" step="0.1" v-model="formData.annotation_width" @input="submit"
                                        class="w-[6rem] py-1 border-gray-200 rounded">
                                    <p class="text-gray-700 flex items-center"> <font-awesome-icon
                                            icon="fa-solid fa-left-right" class="text-xs w-6" />
                                        Annotation Text
                                        Width</p>
                                </div>
                                <div class="flex flex-row items-center gap-3">
                                    <input type="number" step="0.1" v-model="formData.annotation_x" @input="submit"
                                        class="w-[6rem] py-1 border-gray-200 rounded">
                                    <p class="text-gray-700 flex items-center"> <font-awesome-icon
                                            icon="fa-solid fa-left-right" class="text-xs w-6" /> Annotation Text
                                        Horizontal Position</p>
                                </div>
                                <div class="flex flex-row items-center gap-3">
                                    <input type="number" step="0.1" v-model="formData.annotation_y" @input="submit"
                                        class="w-[6rem] py-1 border-gray-200 rounded">
                                    <p class="text-gray-700 flex items-center"> <font-awesome-icon
                                            icon="fa-solid fa-up-down" class="text-xs w-6" /> Annotation Text Vertical
                                        Position
                                    </p>
                                </div>

                                <div class="flex flex-row items-center gap-3">
                                    <input type="number" step="0.1" v-model="formData.annotation_font_size"
                                        @input="submit" class="w-[6rem] py-1 border-gray-200 rounded">
                                    <p class="text-gray-700 flex items-center"> <font-awesome-icon
                                            icon="fa-solid fa-text-height" class="text-xs w-6" /> Annotation Text Font
                                        Size
                                    </p>
                                </div>
                                <div class="flex flex-row items-center gap-2">
                                    <div class="flex flex-row text-gray-700 gap-2">
                                        <button @click="change_annotation_width(-90)"
                                            :class="[formData.annotation_rotation === -90 ? 'bg-gray-700 text-gray-50 hover:bg-gray-800' : 'bg-gray-50 text-gray-700 hover:bg-gray-100']"
                                            class="border p-1 rounded hover:shadow-sm w-9">
                                            <font-awesome-icon icon="fa-solid fa-arrows-up-down" />
                                        </button>
                                        <button @click="change_annotation_width(0)"
                                            :class="[formData.annotation_rotation === 0 ? 'bg-gray-700 text-gray-50 hover:bg-gray-800' : 'bg-gray-50 text-gray-700 hover:bg-gray-100']"
                                            class="border p-1 rounded hover:shadow-sm w-9">
                                            <font-awesome-icon icon="fa-solid fa-arrows-left-right" />
                                        </button>
                                    </div>
                                    <p class="text-gray-700 flex items-center"> <font-awesome-icon
                                            icon="fa-solid fa-text-height" class="text-xs w-6" /> Annotation Rotation
                                    </p>
                                </div>
                            </div>


                        </div>

                        <div class="mt-auto flex justify-items-end gap-2 p-4 w-full ">
                            <button
                                class=" text-sm tracking-wider ml-auto border rounded font-semibold bg-red-400 text-white   hover:bg-red-500 hover:text-white px-3 py-2 "
                                @click="AnnotationEditor = !AnnotationEditor">Cancel</button>
                            <button @click="create_annotation()"
                                class=" text-sm tracking-wider   px-20 bg-green-400 text-white outline-none  py-2  font-semibold rounded hover:bg-green-600"
                                type="button">Proceed</button>
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
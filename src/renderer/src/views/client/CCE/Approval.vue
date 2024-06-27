<template>
    <div class="relative h-[calc(100vh-100px)] flex sm:flex-wrap  md:lg:flex-row w-full p-4 overflow-y-scroll gap-10">
        <div class="sm:grow md:lg:basis-[20%]  flex flex-col w-full h-full  gap-3 ">
            <p class="text-4xl text-gray-800 tracking-wider font-medium ml-5">Approval</p>
            <div class="flex flex-col border p-4 gap-2 bg-white overflow-y-scroll h-full items-center mt-5 ml-5">
                <p class="text-md text-gray-800 tracking-wider font-medium mb-5 self-start "> Details:</p>
                <div class="grid px-5 sm:grid-cols-1 md:lg:grid-cols-2 w-full  overflow-y-scroll"
                    v-for="(value, key) in userData" :key="key">
                    <div class="text-sm font-normal">{{ key }}</div>
                    <div class="text-md font-medium text-wrap w-full overflow-hidden truncate ">{{ value }} </div>
                </div>
                <div
                    class="w-full flex items-center justify-end text-xs text-blue-500 hover:text-blue-600 hover:cursor-pointer">
                    [Full Details]</div>
            </div>
        </div>

        <!-- Another Half -->

        <div class="sm:w-full md:lg:w-[65%] h-full  bg-gray-100 border-s border-gray-200 flex flex-col p-4 gap-2 ">
            <p class="font-bold text-2xl">Attachments</p>

            <div class="flex items-center" v-for="attach in attachments" :key="attach">
                <div class="w-[12rem]">
                    <input disabled type="checkbox" value=""
                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                    <label class="ms-2 text-sm font-medium text-gray-400 dark:text-gray-500">{{ attach }}</label>
                </div>

                <button class="p-1 border rounded-md bg-white px-3">Create </button>
            </div>



            <div class="flex flex-col w-full p-1">
                <button
                    :class="{ 'bg-gray-700 text-white  hover:text-white hover:bg-gray-800': annotated_unannotated, 'bg-white': !annotated_unannotated, ' pointer-events-none bg-gray-700 text-white hidden hover:text-white hover:bg-gray-800  ': selectfromscanned }"
                    class="w-fit text-sm font-semibold px-2.5 py-2 text-gray-700 shadow-md rounded border  items-center flex hover:bg-gray-100"
                    type="button" @click="annotated_unannotated = !annotated_unannotated"> Add Requirement
                    <font-awesome-icon icon="fa-solid fa-arrow-down" class="ms-2 text-xs" /></button>

                <div class="h-auto flex flex-col bg-white w-fit p-2 border items-start mt-5 gap-3 shadow-md transition-all text-gray-600"
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
                    <p class="text-sm bg-gray-100 px-1  w-full">Unannotated/ Form 1A</p>
                    <div class="flex flex-col items-start w-full">
                        <button type="button"
                            class="w-full text-left font-semibold py-2 bg-gray-50 px-2.5 hover:bg-gray-200 transition-all flex items-center"><font-awesome-icon
                                icon="fa-solid fa-plus" class="text-sm me-2" /> Create
                            1A</button>
                    </div>
                </div>
            </div>


            <div class="border bg-white  shadow-sm flex px-4 py-3 h-[calc(100vh-310px)] w-full flex-col gap-2"
                v-if="selectfromscanned">
                <div class="grid sm:grid-flow-row md:lg:grid-cols-2  items-center justify-between w-full ">
                    <p class=" font-medium text-gray-700 tracking-wide"> Scanned Documents</p>
                    <div class="mr-auto w-full flex flex-row gap-2">
                        <input v-model="filter_search" type="text" placeholder="Search"
                            class="border-gray-300 rounded-md text-gray-700 font-medium w-full placeholder:text-sm placeholder:text-gray-400">
                        <select v-model="filter_type" value="all" class="border border-gray-200 h-10 rounded  text-sm ">
                            <option value="all" selected>All</option>
                            <option :value="value" v-for="(value, index ) in types" :key="index">{{ value }}</option>
                        </select>
                        <select v-model="filter_year" class="border border-gray-200 h-10 rounded  text-sm ">
                            <option value="all" selected>All</option>
                            <option :value="value" v-for="(value, index) in years" :key="index">{{ value }}</option>
                        </select>
                    </div>

                </div>
                <div class="h-full  rounded-md  truncate overflow-x-hidden ">
                    <RecycleScroller :items="data" class="h-full " :item-size="34" key-field="name" v-slot="{ item }"
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
                    </RecycleScroller>
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
                            class=" font-medium text-sm border px-2.5 py-1 rounded bg-white hover:bg-gray-200 text-gray-700">
                            Select
                        </button>
                    </div>
                </div>
            </div>


            <div class="mt-auto ml-auto bottom-0 right-10 gap-2 flex">
                <button
                    class="border w-[10rem] rounded-sm bg-gray-800 hover:bg-gray-900 text-sm py-2  text-white font-medium shadow-sm transition-all active:scale-95 ">Impugn</button>
                <button @click="back"
                    class="border w-[10rem] rounded-sm bg-white text-sm py-2 hover:bg-red-400 text-gray-800 font-medium shadow-sm transition-all active:scale-95 hover:text-white">Cancel</button>

                <button type="button"
                    class="bg-blue-300 py-2 px-10 font-medium rounded-sm text-white cursor-not-allowed">Approve</button>

            </div>
        </div>

        <!-- <ul v-for="(value, key) in petition.petitionData" :key="key">
            <li>{{ key + ' : ' + value }}</li>
        </ul> -->
        <div class="fixed bg-white z-[9999] top-0 bottom-0 left-0 right-0 flex flex-col p-4 -full w-full border gap-2 px-10"
            v-if="AnnotationEditor">

            <div class="h-full flex flex-col overflow-y-scroll">
                <button class="self-end border " @click="AnnotationEditor = !AnnotationEditor">[close]</button>
                <div class="grid sm:grid-cols-1 md:lg:grid-cols-2 w-full h-full gap-5 ">
                    <div class="flex h-[calc(100vh-100px)]  w-full border relative">
                        <div
                            class="absolute right-[3rem] top-[0.4rem]  h-[3rem] w-[5rem] flex items-center justify-center bg-[#323639] z-[999]">
                            <p class="text-white text-xs tracking-wider font-medium">VBCRAS</p>
                        </div>
                      
                        <iframe :src="pdfbase64" frameborder="0" class="h-full w-full"></iframe>
                    </div>
                    <div class="flex flex-col p-4 w-full border gap-2 rounded-md border-gray-200 shadow-sm">
                        <p class="text-gray-800 font-medium text-2xl h-[3rem] ">Settings </p>
                        <div class="h-auto flex flex-col gap-2">
                            <p class="text-gray-800 text-sm font-medium">Annotation Text</p>
                            <QuillEditor theme="snow" :toolbar="['bold']" v-model:content="formData.annotation"
                                contentType="html" />

                        </div>

                        <p class="text-gray-800 text-sm font-medium mt-2">Adjustments</p>
                        <div class="  items-start flex flex-col flex-wrap  p-2 gap-3">
                            <div class="flex flex-row items-center gap-3">
                                <input type="number" v-model="formData.form_scale"
                                    class="w-[4rem] py-1 border-gray-200 rounded">
                                <p class="text-gray-700 flex items-center"> <font-awesome-icon
                                        icon="fa-solid fa-up-right-and-down-left-from-center" class="text-xs w-6" />
                                    Form
                                    102
                                    Scale</p>
                            </div>
                            <div class="flex flex-row items-center gap-3">
                                <input type="number" v-model="formData.form_x"
                                    class="w-[4rem] py-1 border-gray-200 rounded">
                                <p class="text-gray-700 flex items-center"> <font-awesome-icon
                                        icon="fa-solid fa-left-right" class="text-xs w-6" /> Form 102
                                    Horizontal Position</p>
                            </div>
                            <div class="flex flex-row items-center gap-3">
                                <input type="number" v-model="formData.form_y"
                                    class="w-[4rem] py-1 border-gray-200 rounded">
                                <p class="text-gray-700 flex items-center"> <font-awesome-icon
                                        icon="fa-solid fa-up-down" class="text-xs w-6" /> Form 102 Vertical Position</p>
                            </div>

                        </div>

                        <div class="  items-start  p-2 gap-2 flex flex-col ">
                            <div class="flex flex-row items-center gap-3">
                                <input type="number" v-model="formData.annotation_scale"
                                    class="w-[4rem] py-1 border-gray-200 rounded">
                                <p class="text-gray-700 flex items-center"> <font-awesome-icon
                                        icon="fa-solid fa-up-right-and-down-left-from-center" class="text-xs w-6" />
                                    Annotation
                                    Scale</p>
                            </div>
                            <div class="flex flex-row items-center gap-3">
                                <input type="number" v-model="formData.annotation_x"
                                    class="w-[4rem] py-1 border-gray-200 rounded">
                                <p class="text-gray-700 flex items-center"> <font-awesome-icon
                                        icon="fa-solid fa-left-right" class="text-xs w-6" /> Annotation
                                    Horizontal Position</p>
                            </div>
                            <div class="flex flex-row items-center gap-3">
                                <input type="number" v-model="formData.annotation_y"
                                    class="w-[4rem] py-1 border-gray-200 rounded">
                                <p class="text-gray-700 flex items-center"> <font-awesome-icon
                                        icon="fa-solid fa-up-down" class="text-xs w-6" /> Annotation Vertical Position
                                </p>
                            </div>

                            <div class="flex flex-row items-center gap-3">
                                <input type="number" v-model="formData.annotation_font"
                                    class="w-[4rem] py-1 border-gray-200 rounded">
                                <p class="text-gray-700 flex items-center"> <font-awesome-icon
                                        icon="fa-solid fa-text-height" class="text-xs w-6" /> Annotation Text Height</p>
                            </div>
                            <div class="flex flex-row items-center gap-2">
                                <div class="flex flex-row text-gray-700 gap-2">
                                    <button @click="formData.annotation_angle = -90"
                                        class="border p-1 rounded hover:bg-gray-100 hover:shadow-sm w-9">
                                        <font-awesome-icon icon="fa-solid fa-arrows-up-down" />
                                    </button>
                                    <button @click="formData.annotation_angle = 0"
                                        class="border p-1 rounded hover:bg-gray-100 hover:shadow-sm w-9">
                                        <font-awesome-icon icon="fa-solid fa-arrows-left-right" />
                                    </button>
                                </div>
                                <p class="text-gray-700 flex items-center"> <font-awesome-icon
                                        icon="fa-solid fa-text-height" class="text-xs w-6" /> Annotation Text Angle</p>
                            </div>
                        </div>

                        <div class="mt-auto flex justify-items-end">
                            <button
                                class="ml-auto tracking-wider border px-2 py-1.5 bg-blue-500 text-white rounded font-medium"
                                type="button">Done</button>
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
import { usePetitions } from '../../../stores/Petition/Petitions';
import ExplorerView from '../../../components/client/ExplorerView.vue';
import { useFileDialog } from '@vueuse/core'
import { RecycleScroller } from 'vue-virtual-scroller';
import { useScannedDocuments } from '../../../stores/scanned';
import { computed } from 'vue';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';

const { files, open, reset, onChange } = useFileDialog({
    accept: 'application/pdf',
    directory: false,
})

const attachments = ref([
    'Finality',
    'Endoresement Letter',
    'Annotated/Unannotated'
])

const filter_type = ref('Birth')
const filter_year = ref(2024)
const filter_search = ref('')
const AnnotationEditor = ref(false)

const petition = usePetitions()
const router = useRouter();
const route = useRoute();
const annotated_unannotated = ref(false)
const selectfromscanned = ref(false)
const selectedscanned = ref()
const pdfbase64 = ref()
const annotation_text = ref()

const changetoSelectfromScanned = () => {
    selectfromscanned.value = true
    annotated_unannotated.value = false
}


const Documents = useScannedDocuments();
const ScannedData = ref()

const types = computed(() => {
    return [...new Set(Documents.scanned.map((data) => data.type))].sort((a, b) => a - b);
});
const years = computed(() => {

    return [...new Set(Documents.scanned.map((data) => data.year))].sort((a, b) => a - b);
});


const data = computed(() => {
    const TypeFilter = item =>
        filter_type.value === 'all' ? item.type : item.type === filter_type.value

    const YearFilter = item =>
        filter_year.value === 'all' ? item.year : item.year === filter_year.value

    if (!filter_search.value) {
        return Documents.scanned.filter(TypeFilter).filter(YearFilter).sort((a, b) => a - b);
    }

    const lowerSearch = filter_search.value.toLowerCase();
    return Documents.scanned.filter(TypeFilter)
        .filter(YearFilter)
        .filter(item => item.name.toLowerCase().includes(lowerSearch))
        .sort((a, b) => a - b);
});


const petitionData = ref()
const userData = ref({})

const fromScanned = () => {

}
const CancelSelectFromScanned = () => {
    selectfromscanned.value = false
    selectedscanned.value = ''
    data.value = null
}

onChange((file) => {
    if (file[0].type != 'application/pdf' || file.length > 1) {
        alert('Invalid')
        annotated_unannotated.value = false
        return
    }

    formData.filepath = file[0].path.replace('C:\\Users\\Erika Joyce\\', '')

    // console.log(file[0])
    submit()
    annotated_unannotated.value = false

})
onMounted(async () => {
    const data = await petition.getPetition(route.params.id)
    if (data) {
        petitionData.value = data
        userData.value = {
            "Petitione Number": petitionData.value.petition_number,
            "Petitioner Name": petitionData.value.petitioner_name,
            "Document Owner": petitionData.value.name_owner === 'N/A' ? petitionData.value.petitioner_name : petitionData.value.name_owner,
            "Relation to Owner": petitionData.value.relation_owner === 'N/A' ? 'Owner' : petitionData.value.relation_owner,
            "Date Filed": petitionData.value.DatePaid,
            "Date Granted": petitionData.value.date_granted,
            "Document Type": petitionData.value.type + ' ' + petitionData.value.document_type,
        }
    }
})


const back = () => {
    router.push('/client/cce')
}


const initialFormData = {
    filepath: '',
    annotation: '<p>Pursuant to the decision rendered by <strong>MCR ISMAEL D. MALICDEM, JR. </strong> dated 03 November 2022 and affirmed by <strong>CRG under OCRG No. 22-2373313,</strong> the child&rsquo;s first name from <strong>"LODOVICO"</strong> to <strong>"LUDOVIGO"</strong> and child&rsquo;s date of birth from <strong>"MAY 17, 1967&rdquo; </strong> to <strong>"APRIL 26, 1967&rdquo; </strong> are hereby corrected.</p>',
    form_scale: 0.9,
    form_x: 1.7,
    form_y: 25,

    // Annotation Adjustments
    annotation_scale: 0,
    annotation_x: 600,
    annotation_y: 450,
    annotation_font: 12,
    annotation_angle: -90,
};

const formData = reactive({ ...initialFormData });

watch(formData, (newValue, oldValue) => {
    submit()
})

const submit = async () => {
    const data = {
        filepath: formData.filepath,
        annotation: formData.annotation,
        form_scale: formData.form_scale,
        form_x: formData.form_x,
        form_y: formData.form_y,

        // Annotation
        annotation: formData.annotation,
        annotation_x: formData.annotation_x,
        annotation_y: formData.annotation_y,
        annotation_font: formData.annotation_font,
        annotation_angle: formData.annotation_angle
    }
    const submit = await window.ClericalApi.CreateAnnotated(data);

    AnnotationEditor.value = true
    pdfbase64.value = 'data:application/pdf;filename=generated.pdf;base64,' + submit.pdfbase64
}

</script>

<style lang="scss" scoped></style>
<template>
    <div class="relative h-[calc(100vh-100px)] flex sm:flex-wrap  md:lg:flex-row w-full p-4 overflow-y-scroll gap-10">
        <div class="sm:grow md:lg:basis-[5%]  flex flex-col w-full h-full gap-3">
            <p class="text-4xl text-gray-800 tracking-wider font-medium ml-5">Approval</p>
            <div class="flex flex-col border p-4 gap-2 bg-white   items-center mt-5 ml-5">
                <p class="text-md text-gray-800 tracking-wider font-medium mb-5 self-start "> Details:</p>
                <div class="grid sm:grid-cols-1 md:lg:grid-cols-2 w-full h-full" v-for="(value, key) in userData"
                    :key="key">
                    <div class="text-sm font-normal">{{ key }}</div>
                    <div class="text-md font-medium text-wrap w-full overflow-hidden truncate ">{{ value }} </div>
                </div>
                <div
                    class="w-full flex items-center justify-end text-xs text-blue-500 hover:text-blue-600 hover:cursor-pointer">
                    [Full Details]</div>
            </div>
        </div>

        <div class="md:lg:basis-[60%] sm:basis-[100%] flex flex-col p-4 gap-2">
            <p class="text-2xl">Attachments</p>
            <div class="flex items-center">
                <input disabled checked id="disabled-checked-checkbox" type="checkbox" value=""
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                <label for="disabled-checked-checkbox"
                    class="ms-2 text-sm font-medium text-gray-400 dark:text-gray-500">Finality</label>
            </div>
            <div class="flex items-center">
                <input disabled checked id="disabled-checked-checkbox" type="checkbox" value=""
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                <label for="disabled-checked-checkbox"
                    class="ms-2 text-sm font-medium text-gray-400 dark:text-gray-500">Endorsement Letter</label>
            </div>


            <div class="felx w-full p-1">
                <button
                    :class="{ 'bg-gray-700 text-white hover:text-white hover:bg-gray-800': annotated_unannotated, ' pointer-events-none bg-gray-700 text-white hover:text-white hover:bg-gray-800  ': selectfromscanned }"
                    class="w-fit text-sm font-semibold px-2.5 py-2 text-gray-700 shadow-md rounded border  items-center flex hover:bg-gray-200"
                    type="button" @click="annotated_unannotated = !annotated_unannotated"> Add Requirement
                    <font-awesome-icon icon="fa-solid fa-arrow-down" class="ms-2 text-xs" /></button>

                <div class="h-auto flex flex-col w-fit p-2 border items-start mt-5 gap-3 shadow-md transition-all text-gray-600"
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


            <div class="border shadow-md flex p-4 h-[30rem] w-auto flex-col gap-2" v-if="selectfromscanned">
                <div class="grid grid-cols-2 items-center justify-between w-full ">
                    Scanned Documents
                    <div class="mr-auto w-full flex flex-row gap-2">

                        <input type="text" class="border-gray-300 rounded-md text-gray-700 font-medium w-full">
                        <select v-model="filter_type" value="all" class="border border-gray-200 h-10 rounded  text-sm ">
                            <option value="all" selected disabled>Type</option>
                            <option :value="value" v-for="(value, index ) in types" :key="index">{{ value }}</option>
                        </select>
                        <select v-model="filter_year" class="border border-gray-200 h-10 rounded  text-sm ">
                            <option value="all" selected disabled>Year</option>
                            <option :value="value" v-for="(value, index) in years" :key="index">{{ value }}</option>
                        </select>
                    </div>

                </div>
                <div class="h-full  rounded-md  truncate overflow-x-hidden ">
                    <RecycleScroller :items="Documents.scanned" class="h-full " :item-size="34" key-field="name"
                        v-slot="{ item }">
                        <li :class="{ 'bg-blue-200': selectedscanned === item.name }"
                            class="w-full overflow-hidden truncate px-3 p-1 hover:bg-blue-100  flex items-center">
                            <input v-model="selectedscanned" type="radio" class=" rounded-md cursor-pointer"
                                name="scans" :id="item.id" :value="item.name" :checked="selectedscanned === item.name">
                            <label :for="item.id" class=" cursor-pointer"> <font-awesome-icon
                                    icon="fa-solid fa-file-pdf" class="text-red-500 me-2 ms-3" />
                                {{ item.name.replace(".pdf", "") }}</label>
                        </li>
                    </RecycleScroller>
                </div>
                <div class="mt-auto flex flex-row w-full">
                    <div>Selected: {{ selectedscanned }}</div>
                    <div class="flex flex-row ml-auto gap-2">
                        <button type="button" @click="CancelSelectFromScanned"
                            class=" font-medium text-sm border px-2.5 py-1 rounded bg-red-400 hover:bg-red-500  text-white">
                            Cancel
                        </button>
                        <button type="button"
                            class=" font-medium text-sm border px-2.5 py-1 rounded bg-white hover:bg-gray-200 text-gray-700">
                            Select
                        </button>
                    </div>
                </div>
            </div>


            <div class="mt-auto ml-auto bottom-0 right-10 gap-2 flex">
                <button @click="back"
                    class="border w-[10rem] rounded-sm bg-white text-sm py-2 hover:bg-red-400 text-gray-800 font-medium shadow-sm transition-all active:scale-95 hover:text-white">Cancel</button>

                <button type="button"
                    class="bg-blue-300 py-2 px-10 font-medium rounded-sm text-white cursor-not-allowed">Approve</button>
                <button type="button"
                    class="bg-blue-300 py-2 px-10 font-medium rounded-sm text-white cursor-not-allowed">Approve</button>
            </div>
        </div>

        <!-- <ul v-for="(value, key) in petition.petitionData" :key="key">
            <li>{{ key + ' : ' + value }}</li>
        </ul> -->


    </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import { onMounted, onUnmounted, ref } from 'vue';
import { usePetitions } from '../../../stores/Petition/Petitions';
import ExplorerView from '../../../components/client/ExplorerView.vue';
import { useFileDialog } from '@vueuse/core'
import { RecycleScroller } from 'vue-virtual-scroller';
import { useScannedDocuments } from '../../../stores/scanned';
import { computed } from 'vue';

const { files, open, reset, onChange } = useFileDialog({
    accept: 'application/pdf',
    directory: false,
})

const filter_type = ref('Birth')
const filter_year = ref(2024)

const petition = usePetitions()
const router = useRouter();
const route = useRoute();
const annotated_unannotated = ref(false)
const selectfromscanned = ref(false)
const selectedscanned = ref()


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
    return [...new Set(Documents.scanned.map((data) => data))].sort((a, b) => a - b)
})



const petitionData = ref()
const userData = ref({})

const fromScanned = () => {

}
const CancelSelectFromScanned = () => {
    selectfromscanned.value = false
    selectedscanned.value = ''
}

onChange((file) => {
    if (file[0].type != 'application/pdf' || file.length > 1) {
        alert('Invalid')
        annotated_unannotated.value = false
        return
    }

    alert('This feature is coming soon!')
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



</script>

<style lang="scss" scoped></style>
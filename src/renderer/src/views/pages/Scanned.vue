<template>
    <div class="flex flex-col relative justify-center w-full p-10" @dragenter="isDropzoneOpen = true">
        <div class="h-[calc(100vh-180px)] relative">
            <ScannedDetails v-if="isDetailsOpen" @close-details="isDetailsOpen = false" />
            <DropZone v-if="isDropzoneOpen" @dragleave="isDropzoneOpen = false" @drop="handleDrop" @dragover.prevent />
            <ExplorerView v-if="isExplorerVisible" :types="documents.scanned_types" @open-details="isDetailsOpen = true"/>
            <Transition mode="out-in" name="zoom_in">
                <div tabindex="-1" v-if="IsModalOpen"
                    class="fixed top-0 p-2 bottom-0 left-0 right-0 flex items-center justify-center z-50 backdrop-blur-sm backdrop-brightness-75">
                    <div
                        class="max-w-screen-md w-full flex flex-col  shadow h-[30rem] bg-white rounded overflow-hidden ">
                        <div class="h-12 flex items-center flex-row p-2 bg-gray-200">
                            <p class="font-medium text-sm ml-2">Create New Record</p>
                            <button type="button" @click="IsModalOpen = false"
                                class="bg-transparent ml-auto hover:bg-gray-200  border border-gray-300 bg-white text-gray-900 rounded-full text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                data-modal-hide="default-modal">
                                <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                                    viewBox="0 0 14 14">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                        stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"></path>
                                </svg><span class="sr-only">Close modal</span>
                            </button>

                        </div>
                        <div class="flex-1 p-4 h-full flex flex-col gap-2">

                            <p class="text-sm p-1 font-semibold antialiased mb-4">
                                <font-awesome-icon icon="fa-solid fa-file-pdf" class="text-2xl text-red-400 me-2" />


                                <span v-if="mainData.Files.length > 1">
                                    {{ mainData.Files.length }} file(s) selected
                                </span>
                                <span v-else>
                                    {{ mainData.Files[0].name }}
                                    selected
                                </span>
                            </p>



                            <div class="grid grid-cols-1 gap-2 mt-auto mb-auto">

                                <div class="w-full">
                                    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Document
                                        Type</label>
                                    <select v-model="formData.type_id"
                                        class=" border  text-gray-900 text-sm rounded-md font-bold focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                        <option selected disabled></option>
                                        <option class="font-medium text-sm" v-for="option in documents.scanned_types"
                                            :key="option" :value="option.id">{{
                                                option.name }}
                                        </option>
                                    </select>
                                </div>

                                <Dropdown label="Month" :optionData="months" v-model="formData.month"
                                    :error="v$.month.$error" />
                                <Dropdown label="Year" :optionData="years" v-model="formData.year"
                                    :error="v$.year.$error" />
                            </div>

                        </div>
                        <div class="flex flex-row  items-center p-2 gap-2">
                            <button type="button" @click="submit()" :disabled="isSubmitting" :class="{
                                'bg-green-400  hover:bg-green-500 active:scale-95': !isSubmitting,
                                'bg-green-300   cursor-not-allowed': isSubmitting,
                            }"
                                class="py-2 px-4  ml-auto w-40 text-sm font-medium text-white rounded-sm shadow-sm hover:text-white focus:z-10 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                                <svg aria-hidden="true" v-if="isSubmitting" role="status"
                                    class="inline w-4 h-4 me-1 text-white animate-spin" viewBox="0 0 100 101"
                                    fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                        fill="#E5E7EB" />
                                    <path
                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                        fill="currentColor" />
                                </svg>
                                Submit
                            </button>
                        </div>
                    </div>
                </div>

            </Transition>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import DropZone from '../../components/client/DropZone.vue'
import Dropdown from '../../components/client/inputs/Dropdown.vue'
import useVuelidate from '@vuelidate/core'
import { required } from "@vuelidate/validators";
import { useScannedDocuments } from '../../stores/Scanned';
import { AuthStore } from '../../stores/Authentication';
import ExplorerView from '../../components/client/ExplorerView.vue';
import ScannedDetails from '../../components/scanned/ScannedDetails.vue';


const isDropzoneOpen = ref(false)
const isSubmitting = ref(false)
const IsModalOpen = ref(false)
const isExplorerVisible = ref(false)
const isDetailsOpen = ref(false)
/**
 *  @Documents
 * 
 */
const documents = useScannedDocuments();

/**
 *  @Authentication
 */

const authUser = AuthStore()

// Reset state on mount and unmount
onMounted(() => {
    mainData.Files = []
    isDropzoneOpen.value = false
    // Get All Scanned Type, Birth;Death;Marriage and so on
    documents.getScannedType()

    setTimeout(() => {
        isExplorerVisible.value = true
    }, 500);

})


onUnmounted(() => {
    mainData.Files = []
    isDropzoneOpen.value = false
})

const type = ref([
    'Birth',
    'Death',
    'Marriage',
    'Legal Instrument',
    'Other Documents',
])


const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

const years = computed(() => {
    const year_S = new Date().getFullYear();
    return Array.from({ length: year_S - 1900 }, (value, index) => year_S - index);
});

const mainData = reactive({
    Files: []
})

const formData = reactive({
    type_id: '',
    month: '',
    year: '',
})


const rules = computed(() => {
    return {
        type_id: { required },
        month: { required },
        year: { required },
    };
});
const v$ = useVuelidate(rules, formData);


function sanitizeFilePath(path) {
    const safePath = path.replace(/(\.\.\/|\/\.\.\/)/g, '')
    return safePath;
}

async function handleDrop(event) {
    event.preventDefault()
    event.stopPropagation();

    if (mainData.Files.length > 0) {
        mainData.Files = []
    }

    for (const f of event.dataTransfer.files) {
        if (f.type !== "application/pdf") {
            // Add Warning Message
            continue
        }
        try {
            const path = await window.getPathApi.showFilePath(f);
            const sanitizedPath = sanitizeFilePath(path);


            mainData.Files.push({
                name: f.name,
                filepath: sanitizedPath,
            });
        } catch (error) {
            console.error("Error getting file path for", f.name, error);
        }
    }

    isDropzoneOpen.value = false
    IsModalOpen.value = true
}


const submit = async () => {
    v$.value.$touch();
    if (v$.value.$error) {
        console.log(v$);
        return;
    }
    const uploaded_by = authUser.user_id;

    isSubmitting.value = true

    for (let index = 0; index < mainData.Files.length; index++) {
        mainData.Files[index] = {
            ...mainData.Files[index],
            type_id: formData.type_id,
            month: formData.month,
            year: formData.year,
            uploaded_by: uploaded_by,

        };
    }


    const add = await documents.multipleAdd(mainData.Files);
    if (add.status === 201) {
        isSubmitting.value = false
        IsModalOpen.value = false
        mainData.Files = []
    }

}
</script>

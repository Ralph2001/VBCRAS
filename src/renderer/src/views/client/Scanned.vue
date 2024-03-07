<style>
.zoom_in-enter-active,
.zoom_in-leave-active {
    transition: opacity 0.2s ease;
}

.zoom_in-enter-from,
.zoom_in-leave-to {
    opacity: 0;
}
</style>

<template>
    <div class="flex flex-col relative justify-center" @dragenter="handleDragEnter()">

        <div class="h-[calc(100vh-130px)] ">
     
            <ScannedDatatable title="Scanned Documents" :types="types" :data="Documents.scanned"
                v-if="Documents.viewMode" />
            <ExplorerView :data="Documents.scanned" v-if="!Documents.viewMode" />
        </div>


        <DropZone v-if="dropzone && !auth.user_details.permissions.scanned_add" @dragleave="handleDragLeave()" @drop="handleDrop" @dragover.prevent />


        <Transition mode="out-in" name="zoom_in">
            <Modal label="Scanned Documents" v-if="modal">
                <template v-slot:header>
                    <button type="button" @click="close_modal"
                        class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-full text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        data-modal-hide="default-modal"><svg class="w-3 h-3" aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"></path>
                        </svg><span class="sr-only">Close modal</span>
                    </button>
                </template>

                <div class="flex flex-col gap-2 py-2">

                    <p class="text-sm p-1 font-semibold antialiased mb-4"> <font-awesome-icon icon="fa-solid fa-file-pdf"
                            class="text-2xl text-red-400 me-2" /> {{ data_name }}
                    </p>



                    <p class="text-sm font-bold">Type</p>
                    <div class="grid  md:grid-cols-5   gap-2 ">
                        <TypeBox label="Birth" value="Birth" v-model="scannedData.type" :error="v$.type.$error" />
                        <TypeBox label="Death" value="Death" v-model="scannedData.type" :error="v$.type.$error" />
                        <TypeBox label="Marriage" value="Marriage" v-model="scannedData.type" :error="v$.type.$error" />
                        <TypeBox label="Legal Instrument" value="Legal Instrument" v-model="scannedData.type"
                            :error="v$.type.$error" />
                        <TypeBox label="Other" value="Other" v-model="scannedData.type" :error="v$.type.$error" />
                    </div>
                    <div class="flex md:flex-row  flex-col gap-2 mt-3 ">

                        <Dropdown label="Month" :optionData="months" v-model="scannedData.month" :error="v$.month.$error" />
                        <Dropdown label="Year" :optionData="years" v-model="scannedData.year" :error="v$.year.$error" />

                    </div>
                </div>

                <template v-slot:footer>
                    <button type="button" @click="submitScanned()"
                        class="py-2 px-5 me-2 mb-2 text-sm font-medium text-white  bg-green-400 rounded-sm shadow-sm hover:bg-green-500 hover:text-white active:scale-95 focus:z-10  dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Submit</button>
                </template>
            </Modal>
        </Transition>




        <!-- Footer -->
        <div class="pr-10  h-auto flex  flex-row bottom-0 fixed w-full left-0 p-2 justify-between items-center mx-auto">
            <div class="flex flex-row items-center gap-2">
                <button class="rounded-full py-2 px-3 text-gray-500 active:bg-gray-200 hover:bg-gray-200 "
                    @click="changeViewMode()" title="Change Mode">
                    <font-awesome-icon icon="fa-solid fa-repeat" />
                </button>

                <p class="text-sm font-normal text-gray-400 italic">
                    <font-awesome-icon icon="fa-solid fa-desktop" class="text-italic" /> {{ desktop.desktop_name }}
                </p>
            </div>

            <p class="text-sm font-medium text-gray-900 select-all">
                <!-- <span class="italic font-normal text-gray-500">As of {{ Documents.asOf }},</span>  -->
                
                Total Records (<span
                    class="text-blue-600">
                    {{
                        Number(Documents.totalCount).toLocaleString()
                    }}</span>)
            </p>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, reactive, computed } from 'vue';
import { useScannedDocuments } from '../../stores/scanned'
import ExplorerView from '../../components/client/ExplorerView.vue'
import ScannedDatatable from '../../components/client/ScannedDatatable.vue';
import { useComputerStore } from '../../stores/computer';
import DropZone from '../../components/client/DropZone.vue'
import { AuthStore } from '../../stores/clientAuth'
import TypeBox from '../../components/client/TypeBox.vue';
import '@vuepic/vue-datepicker/dist/main.css'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import Modal from '../../components/client/modal/Modal.vue'
import Dropdown from '../../components/client/inputs/Dropdown.vue';
import Swal from 'sweetalert2'



onMounted(() => {
    Documents.getScanned()
    Documents.getTime()
    desktop.getUserName()
    auth.isAuthenticated()
})


const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    }
});

const months = ([
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
])

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1899 + 1 }, (_, index) => 1900 + index);


const changeViewMode = () => {
    Documents.changeViewMode()
}

const auth = AuthStore()
const Documents = useScannedDocuments();
const desktop = useComputerStore();

const modal = ref(false)
const dropzone = ref(false)


const types = ref([
    "Birth", "Death", "Marriage", "Legal", "Other"
])



const handleDragEnter = () => {
    dropzone.value = true
}
const handleDragLeave = () => {
    dropzone.value = false
}

const data = ref([])
const data_name = computed(() => {

    if (data.value.length > 1) {
        return data.value.length + " Files uploaded."
    }
    else {
        return data.value[0].name
    }
})


function close_modal() {
    modal.value = false
    data.value = []
    dropzone.value = false

}


function handleDrop(event) {
    event.preventDefault();
    const files = event.dataTransfer.files;

    const uploaded_by = auth.user;
    const device_used = desktop.desktop_name;


    for (const file of files) {
        if (file.type != "application/pdf") {
            Swal({
                icon: "error",
                title: "Upload PDF only!",
                text: "File",
            });
            return;
        }

        data.value.push({
            name: file.name,
            filepath: file.path.replace('C:\\Users\\' + desktop.desktop_name + '\\', ''),
            uploaded_by: uploaded_by,
            device_used: device_used,
        });

        modal.value = true

    }
}

const scannedData = reactive({
    type: '',
    month: '',
    year: '',

});

const rules = computed(() => {
    return {
        type: { required },
        month: { required },
        year: { required },
    };
});

const v$ = useVuelidate(rules, scannedData);


const submitScanned = async () => {
    v$.value.$touch();
    if (v$.value.$error) {
        console.log(v$)
        return;
    }


    const type = scannedData.type
    const month = scannedData.month
    const year = scannedData.year


    const updatedArray = [...data.value];

    for (let item of updatedArray) {
        item.type = type;
        item.month = month;
        item.year = year;
    }

    data.value = updatedArray;

    try {
        const add = await Documents.multipleAdd(data.value)
        if (add.status === true) {
            close_modal()
            Toast.fire({
                icon: "success",
                title: "File Uploaded"
            });
        }
        if (add.status === false) {
            Toast.fire({
                icon: "error",
                title: add.error.response.data.message
            });
        }



    } catch (error) {
        console.log(error)
    }


}


</script>


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
  <div class="flex flex-col relative justify-center w-full p-10" @dragenter="handleDragEnter()">
    <div class="h-[calc(100vh-180px)] relative">
      <!-- <Transition leave-active-class="animate__animated animate__zoomOut">
        <div v-if="documents.loading"
          class="text-center text-gray-600 font-italic flex flex-col justify-center items-center right-0 left-0 absolute h-full border z-50 bg-white">
          <div class="flex flex-row items-center">
            <svg aria-hidden="true" role="status" class="inline w-4 h-4 me-2 text-gray-900 animate-spin"
              viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="#E5E7EB" />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentColor" />
            </svg>
            Getting data...
          </div>
        </div>
      </Transition> -->
      <!--  <TableGrid :data="Documents.scanned" :dataColumns="colDefs" v-if="Documents.viewMode" /> -->
      <ExplorerView :data="documents.scanned" />
   


      <!-- <div v-for="scanned in Documents.scanned">
        {{ scanned.name }}
      </div> -->
    </div>

    <DropZone v-if="dropzone" @dragleave="handleDragLeave()" @drop="handleDrop" @dragover.prevent />


    <!-- Modal -->
    <Transition mode="out-in" name="zoom_in">
      <div tabindex="-1" v-if="modal"
        class="fixed top-0 p-2 bottom-0 left-0 right-0 flex items-center justify-center z-50 backdrop-blur-sm backdrop-brightness-75">
        <div class="max-w-screen-md w-full flex flex-col  shadow h-[30rem] bg-white rounded overflow-hidden ">
          <div class="h-12 flex items-center flex-row p-2 bg-gray-200">
            <p class="font-medium text-sm ml-2">Create New Record</p>


            <button type="button" @click="close_modal"
              class="bg-transparent ml-auto hover:bg-gray-200  border border-gray-300 bg-white text-gray-900 rounded-full text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="default-modal">
              <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 14 14">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"></path>
              </svg><span class="sr-only">Close modal</span>
            </button>

          </div>
          <div class="flex-1 p-4 h-full flex flex-col gap-2">
            <p class="text-sm p-1 font-semibold antialiased mb-4">
              <font-awesome-icon icon="fa-solid fa-file-pdf" class="text-2xl text-red-400 me-2" />
              {{ FilesName }}
            </p>


            <div class="grid grid-cols-1 gap-2 mt-auto mb-auto">
              <Dropdown label="Document Type" :optionData="type" v-model="scannedData.type" :error="v$.type.$error" />
              <Dropdown label="Month" :optionData="months" v-model="scannedData.month" :error="v$.month.$error" />
              <Dropdown label="Year" :optionData="years" v-model="scannedData.year" :error="v$.year.$error" />
            </div>

          </div>
          <div class="flex flex-row  items-center p-2 gap-2">
            <button type="button" @click="submitScanned()" :disabled="isSubmitting" :class="{
              'bg-green-400  hover:bg-green-500 active:scale-95': !isSubmitting,
              'bg-green-300   cursor-not-allowed': isSubmitting,
            }"
              class="py-2 px-4  ml-auto w-40 text-sm font-medium text-white rounded-sm shadow-sm hover:text-white focus:z-10 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
              <svg aria-hidden="true" v-if="isSubmitting" role="status"
                class="inline w-4 h-4 me-1 text-white animate-spin" viewBox="0 0 100 101" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="#E5E7EB" />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentColor" />
              </svg>
              {{ submit }}
            </button>
          </div>
        </div>
      </div>

    </Transition>

    <!-- Footer -->
    <div class="px-10  h-auto flex flex-row bottom-0 fixed w-full left-0 p-2 justify-between items-center mx-auto">
      <div class="flex flex-row items-center gap-2">
        <!-- <p class="text-sm font-normal text-gray-500 italic">
          <font-awesome-icon icon="fa-solid fa-desktop" class="text-italic" />
          {{ desktop.desktop_name }}
        </p> -->
      </div>

      <!-- <p class="text-sm font-medium text-gray-900 select-all">
      
        Total Records (<span class="text-blue-600">
          {{ Number(documents.totalCount).toLocaleString() }}</span>)
      </p> -->
    </div>


  </div>
</template>

<script setup>
import { onMounted, ref, reactive, computed, defineAsyncComponent } from "vue";
import { useScannedDocuments } from "../../stores/Scanned";
import { useComputerStore } from "../../stores/Computer";
import DropZone from "../../components/client/DropZone.vue";
import { AuthStore } from "../../stores/Authentication";
import "@vuepic/vue-datepicker/dist/main.css";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import Dropdown from "../../components/client/inputs/Dropdown.vue";
import Input from "../../components/essentials/inputs/Input.vue";
import { useSetup } from "../../stores/Setting/setup";


const setup = useSetup()
const ExplorerView = defineAsyncComponent(() =>
  import("../../components/client/ExplorerView1.vue")
)



const auth = AuthStore();
const documents = useScannedDocuments();
const desktop = useComputerStore();

const isSubmitting = ref(false);
const submit = ref("Save");


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

const modal = ref(false);
const dropzone = ref(false);

const handleDragEnter = () => {
  dropzone.value = true;
};
const handleDragLeave = () => {
  dropzone.value = false;
};

// Main data array
const data = ref([]);

// Computed property to display the number of files uploaded
const FilesName = computed(() => {
  if (data.value.length > 1) {
    return data.value.length + " Files uploaded.";
  } else {
    return data.value[0].name;
  }
});

function close_modal() {
  modal.value = false;
  data.value = [];
  dropzone.value = false;
  scannedData.type = "";
  scannedData.year = "";
  scannedData.month = "";
}

function handleDrop(event) {
  if (data.value.length > 0) {
    return;
  }

  event.preventDefault();

  const files = event.dataTransfer.files;
  const filePaths = window.getPathApi.showFilePath(files);

  // const uploaded_by = auth.user_id;
  // const device_used = desktop.desktop_name;

  // Function to process files in smaller chunks
  const processFiles = (index) => {
    if (index >= filePaths.length) {
      return; // All files processed
    }

    const filePath = filePaths[index];
    const file = files[index];

    // Skip non-PDF files
    if (file.type !== "application/pdf") {
      processFiles(index + 1);
      return;
    }

    // Push file info into data.value
    data.value.push({
      name: file.name,
      filepath: filePath.replace("C:\\Users\\" + 'desktop.desktop_name' + "\\", ""),
      // uploaded_by: uploaded_by,
      // device_used: device_used,
    });

    modal.value = true;

    // Process the next file after a short delay to prevent UI block
    setTimeout(() => processFiles(index + 1), 5);
  };

  // Start processing files from index 0
  processFiles(0);
}



const scannedData = reactive({
  type: "",
  month: "",
  year: "",
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
    console.log(v$);
    return;
  }

  isSubmitting.value = true;
  submit.value = "Saving";
  const type_id = scannedData.type;
  const month = scannedData.month;
  const year = scannedData.year;

  const updatedArray = [...data.value];

  for (let item of updatedArray) {
    item.type_id = type_id;
    item.month = month;
    item.year = year;
  }

  data.value = updatedArray;

  try {
    const add = await Documents.multipleAdd(data.value);
    if (add.status === true) {
      isSubmitting.value = false;
      submit.value = "Save";
      close_modal();
    }
    if (add.status === false) {
      isSubmitting.value = false;
      submit.value = "Save";
    }
  } catch (error) {
    isSubmitting.value = false;
    submit.value = "Save";
  }
};

</script>
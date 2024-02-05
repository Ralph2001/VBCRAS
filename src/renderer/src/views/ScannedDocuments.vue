<template>
  <div class="flex flex-col h-[calc(100vh-92px)] py-3 relative" @dragenter="showDropzone">
    <Dropzone @dragleave="handleDragLeave" @drop="handleDrop" @dragover.prevent :isDropzoneVisible="isDropzoneVisible"
      v-if="isShowModal == false" />

    <div class="h-max mt-6">
      <TableData class="scale-95" :data="Documents.scanned" :types="Documents.types" :isLoading="Documents.isLoading"
        :title="Documents.title" />
    </div>
  </div>

  <fwb-modal v-if="isShowModal" @close="closeModal" persistent class="rounded-sm z-50">
    <template #header>
      <div class="flex flex-row items-center justify-between w-full">
        <p class="text-lg font-medium">Scanned Document</p>
        <div>
          <button class="rounded-full border border-gray-100 px-3 py-2 hover:bg-gray-100" @click="closeModal"
            type="button">
            <i class="pi pi-times"></i>
          </button>
        </div>
      </div>
    </template>
    <template #body>
      <div class=" space-y-3">
        <div class="flex flex-row justify-start items-center p-2 gap-1">
          <span class="pi pi-file-pdf text-red-600 font-normal" style="font-size: 2rem"></span>
          <div>
            <p class="text-md font-semibold text-slate-900 text-justify">
              {{ filename }}
            </p>
            <p class="text-sm text-slate-900 text-justify italic">{{ filesize }} MB</p>
          </div>
        </div>
        <fwb-alert icon type="info" v-if="isAlertNameVisible">
          Note: You can't rename multiple files
        </fwb-alert>
        <div v-if="isNameVisible">
          <DropInputField type="text" id="name" label="File Name" v-model="formData.name_file"
            :error="v$.name_file.$error" />
        </div>
        <label class="block text-sm font-medium text-gray-900 dark:text-white">
          Type
        </label>
        <div class="grid grid-cols-5 gap-2">
          <div :class="{ 'border-blue-400 border-2': formData.type == 'Birth' }"
            class="flex items-center p-2 border rounded dark:border-gray-700 cursor-pointer bg-green-200" style="
              background-image: url(https://freepngimg.com/thumb/baby/156805-baby-vector-with-mother-happy.png);
              background-size: contain;
              background-repeat: no-repeat;
              background-position-x: 110%;
            ">
            <fwb-radio v-model="formData.type" label="Birth" value="Birth" class="cursor-pointer" />
          </div>
          <div :class="{ 'border-blue-400 border-2': formData.type == 'Marriage' }"
            class="flex items-center p-2 border rounded dark:border-gray-700 cursor-pointer bg-red-200" style="
              background-image: url(https://clipart-library.com/images/ziXoqG88T.png);
              background-size: contain;
              background-repeat: no-repeat;
              background-position: right;
              background-blend-mode: overlay;
            ">
            <fwb-radio v-model="formData.type" label="Marriage" value="Marriage" class="cursor-pointer" />
          </div>
          <div :class="{ 'border-blue-400 border-2': formData.type == 'Death' }"
            class="flex items-center p-2 border rounded dark:border-gray-700 cursor-pointer bg-blue-200" style="
              background-image: url(https://png.pngtree.com/png-vector/20220903/ourmid/pngtree-cemetery-gate-silhouette-theme-2-scary-graveyard-theme-vector-png-image_27007926.jpg);
              background-size: cover;
              background-blend-mode: overlay;
            ">
            <fwb-radio v-model="formData.type" label="Death" value="Death" class="cursor-pointer" />
          </div>
          <div :class="{ 'border-blue-400 border-2': formData.type == 'Legal' }"
            class="flex items-center p-2 border rounded dark:border-gray-700 cursor-pointer bg-dark bg-gray-200" style="
              background-image: url(https://cdn-icons-png.flaticon.com/256/6747/6747196.png);
              background-size: 30px;
              background-repeat: no-repeat;
              background-position: center right;
            ">
            <fwb-radio v-model="formData.type" label="Legal" value="Legal" class="cursor-pointer" />
          </div>
          <div :class="{ 'border-blue-400 border-2': formData.type == 'Other' }"
            class="flex items-center p-2 border rounded dark:border-gray-700 cursor-pointer bg-pink-200">
            <fwb-radio v-model="formData.type" label="Other" value="Other" class="cursor-pointer" />
          </div>
        </div>
        <div>
          <fwb-alert class="mt-8" icon type="info" v-if="isTransferAlert">
            Note: You can't transfer multiple files.
          </fwb-alert>
          <div class="flex flex-col gap-2" v-if="isTransferVisible">
            <label class="block text-sm font-medium text-gray-900 dark:text-white">
              Transfer File?
            </label>
            <ToggleButton v-model="isTransfer" class="ml-2 w-14" />
          </div>
        </div>
        <div v-if="isTransfer" class="flex flex-row gap-1 items-center justify-center">
          <div class="flex flex-col w-[90%]">
            <DropInputField type="text" id="destination" label="Destination" v-model="formData.target"
              :error="v$.target.$error" className=" w-full " />
          </div>

          <fwb-button @click="changePath" class="w-auto mt-auto h-11 rounded-sm">
            Path
          </fwb-button>
        </div>
      </div>
    </template>
    <template #footer>
      <fwb-alert class="mt-8" icon type="danger" v-if="isSaveAlert">
        This feature is currently under development and will be available soon.
      </fwb-alert>
      <div class="flex justify-between" v-if="isSaveBtnVisible">
        <fwb-button @click="closeModal" color="alternative"> Cancel </fwb-button>
        <fwb-button @click="submitForm" color="blue"> Save </fwb-button>
      </div>
    </template>
  </fwb-modal>

  <div class="flex flex-row bottom-0 fixed w-full bg-gray-50 left-0 p-2 justify-between items-center mx-auto">
    <div class="flex flex-row items-center gap-2">
      <Button icon="pi pi-cog" text severity="secondary" rounded aria-label="Filter" />
      <p class="text-sm font-normal text-gray-600 italic">
        <span class="pi pi-desktop"></span> {{ PCName.user }}
      </p>
    </div>
    <p class="text-sm font-medium text-gray-900 select-all">
      <span class="italic font-normal text-gray-500">As of {{ Documents.asOf }},</span> Total Records (<span
        class="text-blue-600">{{
          Number(Documents.totalCount).toLocaleString()
        }}</span>)
    </p>
  </div>
</template>

<script setup>
import { ref, inject, onMounted } from "vue";
import { reactive, computed } from "vue";

import { scannedDocuments } from "../stores/scanned";
import { AuthStore } from "../stores/auth";
import { ComputerName } from "../stores/user";
import TableData from "../components/TableData.vue";
import Dropzone from "../components/Dropzone.vue";

import Button from "primevue/button";
import { FwbButton, FwbModal } from "flowbite-vue";
import DropInputField from "../components/DropInputField.vue";
import { FwbRadio, FwbAlert } from "flowbite-vue";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";

import ToggleButton from "primevue/togglebutton";
import axios from "axios";

// SweetAlert
const swal = inject("$swal");
const Toast = swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = swal.stopTimer;
    toast.onmouseleave = swal.resumeTimer;
  },
});

// Documents Data
const Documents = scannedDocuments();
const PCName = ComputerName();
const Auth = AuthStore()
onMounted(() => {
  Documents.getScanned();
  PCName.getUserName();
  Auth.Profile();
});

const isShowModal = ref(false);
const isDropzoneVisible = ref(false);
const isTransfer = ref(false);
const isNameVisible = ref(true);
const isAlertNameVisible = ref(false);
const isTransferVisible = ref(true);
const isTransferAlert = ref(false);

const isSaveBtnVisible = ref(true);
const isSaveAlert = ref(false);
// Text
const filename = ref("");
const filesize = ref("");

// Close Modal
const closeModal = () => {
  isShowModal.value = false;
  filename.value = "";
  filesize.value = "";
  formData.name_file = "";
  formData.target = "";
  isDropzoneVisible.value = false;
  isNameVisible.value = true;
  isAlertNameVisible.value = false;
  isTransferVisible.value = true;
  isTransferAlert.value = false;

  isSaveBtnVisible.value = true;
  isSaveAlert.value = false;
};

const showDropzone = () => {
  isDropzoneVisible.value = true;
};

const handleDragLeave = () => {
  isDropzoneVisible.value = false;
};

const handleDrop = (event) => {
  event.preventDefault();

  const files = event.dataTransfer.files;

  isDropzoneVisible.value = false;

  if (files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (file.type === "application/pdf") {
        isShowModal.value = true;

        // Handle multiple files
        if (files.length > 1) {
          filename.value = "x" + files.length + " Uploaded ";
          filesize.value = (files.length * (file.size / (1024 * 1024))).toFixed(2);
          isNameVisible.value = false;
          isAlertNameVisible.value = true;
          isTransferVisible.value = false;
          isTransferAlert.value = true;
          isSaveBtnVisible.value = false;
          isSaveAlert.value = true;
        } else {
          filename.value = file.name;
          filesize.value = (file.size / (1024 * 1024)).toFixed(2);
          const filenameWithoutExtension = file.name.replace(/\.pdf$/i, "");
          filename.value = filenameWithoutExtension;
          formData.name_file = filenameWithoutExtension;


          formData.source = file.path.replace('C:\\Users\\' + PCName.user + '\\', '')

          formData.target = "C:\\";
          isAlertNameVisible.value = false;
          formData.uploaded_by = Auth.user;
          formData.device_used = PCName.user;

          isTransferVisible.value = true;
          isTransferAlert.value = false;

          isSaveBtnVisible.value = true;
          isSaveAlert.value = false;

        }
      } else {
        swal({
          icon: "error",
          title: "Upload PDF only!",
          text: "File",
        });
      }
    }
  }
};

const changePath = async () => {
  try {
    const selectedPath = await window.LocalCivilApi.selectFolder();
    if (selectedPath) {
      formData.target = selectedPath;
    } else {
      console.log("Folder selection was canceled.");
    }
  } catch (error) {
    console.error("Error during folder selection:", error);
  }
};

// Move
const move = async (source, filepath) => {
  try {
    await window.LocalCivilApi.moveFile(source, filepath);
  } catch (error) {
    console.error("Error:", error);
  }
};


// FormData
const formData = reactive({
  name_file: "",
  target: "",
  source: "",
  type: "Other",
  uploaded_by: '',
  device_used: ''

});

const rules = computed(() => {
  return {
    name_file: { required },
    target: { required },
    source: { required },
    type: { required },
    uploaded_by: { required },
    device_used: { required }


  };
});

const v$ = useVuelidate(rules, formData);

const submitForm = async () => {
  v$.value.$touch();
  if (v$.value.$error) {
    return;
  }

  const name = formData.name_file;
  const type = formData.type;
  const source = formData.source;
  const uploaded_by = formData.uploaded_by
  const device_used = formData.device_used

  let filepath;
  if (isTransfer.value) {
    if (formData.target + "\\" + formData.name_file + ".pdf" === formData.source) {
      Toast.fire({
        icon: "error",
        title: "Invalid Target",
        text:
          "Target cannot be the same as the source. Please select a different target location.",
      });
      return;
    } else {
      filepath = formData.target + "\\" + name + ".pdf";
    }
  } else {
    filepath = formData.source;
  }

  if (isTransfer.value) {
    // try {
    //   const submit = await axios
    //     .post(
    //       "http://0.0.0.0:1216/scanned/add",
    //       { name, filepath, type },
    //       {
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //       }
    //     )
    //     .then((response) => {
    //       console.log(response);
    //       if (response.status === 201) {
    //         closeModal();
    //         move();
    //         if (move(source, filepath)) {
    //           Toast.fire({
    //             icon: "success",
    //             title: "Success",
    //             text: "Successfully Added and Transfer the file.",
    //           });
    //         } else {
    //           Toast.fire({
    //             icon: "warning",
    //             title: "warning",
    //             text:
    //               "Successfully Added and but can't Transfer the file. Make sure it's not open",
    //           });
    //         }
    //       } else if (response.data.status == "required") {
    //         Toast.fire({
    //           icon: "error",
    //           title: "Required Fields",
    //         });
    //       }
    //     })
    //     .catch((error) => {
    //       closeModal();
    //       Toast.fire({
    //         icon: "error",
    //         title: "Something went Wrong.",
    //       });
    //     });
    // } catch (error) {
    //   Toast.fire({
    //     icon: "error",
    //     title: "Something went Wrong.",
    //   });
    // }
  } else {

    try {
      await Documents.addData(name, filepath, type, uploaded_by, device_used)
      closeModal();
      Toast.fire({
        icon: "success",
        title: "Successfully Added",
      });
      Documents.refresh();
    } catch (error) {
      console.log(error)
    }

    // try {
    //   const submit = await axios
    //     .post(
    //       "http://127.0.0.1:1216/scanned/add",
    //       { name, filepath, type },
    //       {
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //       }
    //     )
    //     .then((response) => {
    //       console.log(response);
    //       if (response.status === 201) {
    //         closeModal();
    //         Toast.fire({
    //           icon: "success",
    //           title: "Successfully Added",
    //         });
    //         Documents.refresh();
    //       } else if (response.data.status == "required") {
    //         Toast.fire({
    //           icon: "error",
    //           title: "Required Fields",
    //         });
    //       }
    //     })
    //     .catch((error) => {
    //       closeModal();
    //       Toast.fire({
    //         icon: "error",
    //         title: "Something went Wrong.",
    //       });
    //     });
    // } catch (error) {
    //   Toast.fire({
    //     icon: "error",
    //     title: "Something went Wrong.",
    //   });
    // }
  }
};
</script>

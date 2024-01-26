<template>
  <Toast />
  <div class="flex flex-col h-[calc(100vh-92px)] py-3 relative" @dragenter="showDropzone">
    <DropZone
      @dragleave="handleDragLeave"
      @drop="handleDrop"
      @dragover.prevent
      :isDropzoneVisible="isDropzoneVisible"
      v-if="isShowModal == false"
    />

    <div class="h-max mt-6">
      <DataAppTable />
    </div>

    <fwb-modal v-if="isShowModal" @close="closeModal" persistent class="rounded-sm z-50">
      <template #header>
        <div class="flex flex-row items-center justify-between w-full">
          <p class="text-lg font-bold">Scanned Document</p>
          <div>
            <button class="rounded-full border border-gray-100 px-3 py-2 hover:bg-gray-100" @click="closeModal" type="button">
              <i class="pi pi-times"></i>
            </button>
          </div>
        </div>
      </template>
      <template #body>
        <div class="p-4 md:p-5 space-y-4">
          <div class="flex flex-row justify-start items-center p-2 gap-1">
            <div>
              <img
                src="https://png.pngtree.com/png-clipart/20220612/original/pngtree-pdf-file-icon-png-png-image_7965915.png"
                class="h-12 max-w-xs"
                alt=""
              />
            </div>
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
            <DropInputField
              type="text"
              id="name"
              label="File Name"
              v-model="formData.name_file"
              :error="v$.name_file.$error"
            />
          </div>
          <label class="block text-sm font-medium text-gray-900 dark:text-white">
            Type
          </label>
          <div class="grid grid-cols-5 gap-2">
            <div
              :class="{ 'border-blue-400 border-2': formData.type == 'Birth' }"
              class="flex items-center p-2 border rounded dark:border-gray-700 cursor-pointer bg-green-200"
              style="
                background-image: url(https://freepngimg.com/thumb/baby/156805-baby-vector-with-mother-happy.png);
                background-size: contain;
                background-repeat: no-repeat;
                background-position-x: 110%;
              "
            >
              <fwb-radio
                v-model="formData.type"
                label="Birth"
                value="Birth"
                class="cursor-pointer"
              />
            </div>
            <div
              :class="{ 'border-blue-400 border-2': formData.type == 'Marriage' }"
              class="flex items-center p-2 border rounded dark:border-gray-700 cursor-pointer bg-red-200"
              style="
                background-image: url(https://clipart-library.com/images/ziXoqG88T.png);
                background-size: contain;
                background-repeat: no-repeat;
                background-position: right;
                background-blend-mode: overlay;
              "
            >
              <fwb-radio
                v-model="formData.type"
                label="Marriage"
                value="Marriage"
                class="cursor-pointer"
              />
            </div>
            <div
              :class="{ 'border-blue-400 border-2': formData.type == 'Death' }"
              class="flex items-center p-2 border rounded dark:border-gray-700 cursor-pointer bg-blue-200"
              style="
                background-image: url(https://png.pngtree.com/png-vector/20220903/ourmid/pngtree-cemetery-gate-silhouette-theme-2-scary-graveyard-theme-vector-png-image_27007926.jpg);
                background-size: cover;
                background-blend-mode: overlay;
              "
            >
              <fwb-radio
                v-model="formData.type"
                label="Death"
                value="Death"
                class="cursor-pointer"
              />
            </div>
            <div
              :class="{ 'border-blue-400 border-2': formData.type == 'Legal' }"
              class="flex items-center p-2 border rounded dark:border-gray-700 cursor-pointer bg-dark bg-gray-200"
              style="
                background-image: url(https://cdn-icons-png.flaticon.com/256/6747/6747196.png);
                background-size: 30px;
                background-repeat: no-repeat;
                background-position: center right;
              "
            >
              <fwb-radio
                v-model="formData.type"
                label="Legal"
                value="Legal"
                class="cursor-pointer"
              />
            </div>
            <div
              :class="{ 'border-blue-400 border-2': formData.type == 'Other' }"
              class="flex items-center p-2 border rounded dark:border-gray-700 cursor-pointer bg-pink-200"
            >
              <fwb-radio
                v-model="formData.type"
                label="Other"
                value="Other"
                class="cursor-pointer"
              />
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
              <DropInputField
                type="text"
                id="destination"
                label="Destination"
                v-model="formData.target"
                :error="v$.target.$error"
                className=" w-full "
              />
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
  </div>
</template>

<script setup>
import { ref, inject } from "vue";

import Toast from "primevue/toast";

import DropZone from "../components/ScanApp/DropZone.vue";
import DataAppTable from "../components/DataAppTable.vue";
import axios from "axios";

import { FwbButton, FwbModal } from "flowbite-vue";
import DropInputField from "../components/ScanApp/DropInputField.vue";
import { FwbRadio, FwbAlert } from "flowbite-vue";
import { reactive, computed } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";

import ToggleButton from "primevue/togglebutton";

import { useToast } from "primevue/usetoast";

const toast = useToast();

// SweetAlert
const swal = inject("$swal");

// Modal & DropZone
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

// FormData
const formData = reactive({
  name_file: "",
  target: "",
  source: "",
  type: "Other",
});

const rules = computed(() => {
  return {
    name_file: { required },
    target: { required },
    source: { required },
    type: { required },
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

  let filepath;
  if (isTransfer.value) {
    if (formData.target + "\\" + formData.name_file + ".pdf" === formData.source) {
      toast.add({
        severity: "error",
        summary: "Invalid Target",
        detail:
          "Target cannot be the same as the source. Please select a different target location.",
        life: 4000,
      });
      return;
    } else {
      filepath = formData.target + "\\" + name + ".pdf";
    }
  } else {
    filepath = formData.source;
  }

  if (isTransfer.value) {
    try {
      const submit = await axios
        .post(
          "http://127.0.0.1:1216/add",
          { name, filepath, type },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          console.log(response);
          if (response.status === 201) {
            closeModal();
            move();
            if (move(source, filepath)) {
              toast.add({
                severity: "success",
                summary: "Added",
                detail: "Successfully Added and Transfer the file",
                life: 3000,
              });
            } else {
              toast.add({
                severity: "warning",
                summary: "Added To Database Only",
                detail:
                  "Successfully added but can't transfer the file. Make sure the file is not open.",
                life: 3000,
              });
            }
          } else if (response.data.status == "required") {
            toast.add({
              severity: "error",
              summary: "Required Fields",
              detail: response.data.message,
              life: 4000,
            });
          }
        })
        .catch((error) => {
          closeModal();
          toast.add({
            severity: "error",
            summary: "Something went wrong.",
            detail: error,
            life: 4000,
          });
        });
    } catch (error) {
      toast.add({
        severity: "error",
        summary: "Something went wrong.",
        detail: "Sorry",
        life: 4000,
      });
    }
  } else {
    try {
      const submit = await axios
        .post(
          "http://127.0.0.1:1216/add",
          { name, filepath, type },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          console.log(response);
          if (response.status === 201) {
            closeModal();
            toast.add({
              severity: "success",
              summary: "Added",
              detail: "Successfully Added",
              life: 3000,
            });
          } else if (response.data.status == "required") {
            toast.add({
              severity: "error",
              summary: "Required Fields",
              detail: response.data.message,
              life: 4000,
            });
          }
        })
        .catch((error) => {
          closeModal();
          toast.add({
            severity: "error",
            summary: "Something went wrong.",
            detail: error,
            life: 4000,
          });
        });
    } catch (error) {
      toast.add({
        severity: "error",
        summary: "Something went wrong.",
        detail: "Sorry",
        life: 4000,
      });
    }
  }
};

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

// Single File
// const file = event.dataTransfer.files[0];

// const handleDrop = (event) => {
//   event.preventDefault();

//   const file = event.dataTransfer.files[0];

//   isDropzoneVisible.value = false;

//   if (file && file.type === "application/pdf") {
//     if (file > 1) {
//       isShowModal.value = true;
//       filename.value = "Multiple Files Uploaded";
//       filesize.value = (file.size / (1024 * 1024)).toFixed(2);
//     } else {
//       isShowModal.value = true;
//       filename.value = file.name;
//       filesize.value = (file.size / (1024 * 1024)).toFixed(2);
//       const filenameWithoutExtension = file.name.replace(/\.pdf$/i, "");
//       filename.value = filenameWithoutExtension;
//       formData.name_file = filenameWithoutExtension;
//       formData.source = file.path;
//       formData.target = "C:\\Users\\";
//     }
//   } else {
//     swal({
//       icon: "error",
//       title: "Upload PDF only!",
//       text: "File",
//     });
//   }
// };

const handleDrop = (event) => {
  event.preventDefault();

  const files = event.dataTransfer.files; // Access all dropped files

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
          formData.source = file.path;
          formData.target = "C:\\Users\\";
          isAlertNameVisible.value = false;

          isTransferVisible.value = true;
          isTransferAlert.value = false;

          isSaveBtnVisible.value = true;
          isSaveAlert.value = false;
        }
        // Process each file individually (e.g., upload using axios)
        // ...
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
      console.log(formData.target);
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
</script>

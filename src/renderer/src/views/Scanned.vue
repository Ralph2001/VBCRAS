<template>
  <div class="flex flex-col h-[calc(100vh-92px)] py-3 relative" @dragenter="showDropzone">
    <DropZone
      @dragleave="handleDragLeave"
      @drop="handleDrop"
      @dragover.prevent
      :isDropzoneVisible="isDropzoneVisible"
    />
    <div class="flex flex-row justify-start p-2">
      <p class="text-2xl text-slate-800 text-wrap font-medium">Scanned Documents</p>
      <!-- <fwb-button @click="isShowModal = true" class="rounded-sm"> Add </fwb-button> -->
    </div>
    <div class="mt-5">
    <DataAppTable/>
    </div>

    <fwb-modal v-if="isShowModal" @close="closeModal" persistent class="rounded-sm">
      <template #header>
        <div class="flex items-center text-lg font-bold">Scanned Document</div>
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
              <p class="text-sm text-slate-900 text-justify">{{ filesize }} MB</p>
            </div>
          </div>
          <div>
            <DropInputField type="text" id="name" label="File Name" v-model="name" />
          </div>
          <div>
            <div class="grid grid-cols-5 gap-1">
              <div
                class="flex items-center p-2 border border-gray-200 rounded hover:bg-gray-200 cursor-pointer dark:border-gray-700"
              >
                <fwb-radio
                  v-model="picked"
                  label="Birth"
                  value="birth"
                  class="cursor-pointer select-none"
                />
              </div>
              <div
                class="flex items-center p-2 border border-gray-200 rounded hover:bg-gray-200 cursor-pointer dark:border-gray-700"
              >
                <fwb-radio
                  v-model="picked"
                  label="Death"
                  value="death"
                  class="cursor-pointer select-none"
                />
              </div>
              <div
                class="flex items-center p-2 border border-gray-200 rounded hover:bg-gray-200 cursor-pointer dark:border-gray-700"
              >
                <fwb-radio
                  v-model="picked"
                  label="Marriage"
                  value="marriage"
                  class="cursor-pointer select-none"
                />
              </div>
              <div
                class="flex items-center p-2 border border-gray-200 rounded hover:bg-gray-200 cursor-pointer dark:border-gray-700"
              >
                <fwb-radio
                  v-model="picked"
                  label="Legal Instrument"
                  value="legal"
                  class="cursor-pointer select-none"
                />
              </div>
              <div
                class="flex items-center p-2 border border-gray-200 rounded hover:bg-gray-200 cursor-pointer dark:border-gray-700"
              >
                <fwb-radio
                  v-model="picked"
                  label="Other"
                  value="other"
                  class="cursor-pointer select-none"
                />
              </div>
            </div>
          </div>

          <div class="flex flex-row gap-1 items-center">
            <div class="flex flex-col w-[90%]">
              <DropInputField
                type="text"
                id="destination"
                label="Target Destination"
                v-model="destination"
                className=" w-full"
              />
            </div>

            <fwb-button @click="changePath" class="w-auto h-11 mt-auto rounded-sm">
              Path
            </fwb-button>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-between">
          <fwb-button @click="closeModal" color="alternative"> Cancel </fwb-button>
          <fwb-button @click="FileOperation" color="blue"> Save </fwb-button>
        </div>
      </template>
    </fwb-modal>
  </div>
</template>

<script setup>
import { ref, inject } from "vue";
import DropZone from "../components/ScanApp/DropZone.vue";
import DataAppTable from "../components/DataAppTable.vue";

import { FwbButton, FwbModal } from "flowbite-vue";
import DropInputField from "../components/ScanApp/dropinputfield.vue";
import { FwbRadio } from "flowbite-vue";
import { FwbInput } from "flowbite-vue";
// SweetAlert
const swal = inject("$swal");

// Modal & DropZone
const isShowModal = ref(false);
const isDropzoneVisible = ref(false);

// Text
const filename = ref("");
const filesize = ref("");
const picked = ref("other");

// File
const name = ref("");
const destination = ref("C:\\Users\\Erika Joyce\\SynologyDrive\\Joan\\SCANNED DOCUMENTS");
const source = ref("");

// Close Modal
const closeModal = () => {
  isShowModal.value = false;
  filename.value = "";
  filesize.value = "";
  picked.value = "other";
  name.value = "";
  destination.value = "C:\\Users\\Erika Joyce\\SynologyDrive\\Joan\\SCANNED DOCUMENTS";
};

const showDropzone = () => {
  isDropzoneVisible.value = true;
};

const handleDragLeave = () => {
  isDropzoneVisible.value = false;
};

const handleDrop = (event) => {
  event.preventDefault();
  const file = event.dataTransfer.files[0];
  isDropzoneVisible.value = false;

  if (file && file.type === "application/pdf") {
    isShowModal.value = true;

    filename.value = file.name;
    filesize.value = (file.size / (1024 * 1024)).toFixed(2);

    const filenameWithoutExtension = file.name.replace(/\.pdf$/i, "");
    filename.value = filenameWithoutExtension;
    name.value = filenameWithoutExtension;
    source.value = file.path;
  } else {
    swal({
      icon: "error",
      title: "File Type",
      text: "Upload PDF only!",
    });
  }
};

const changePath = async () => {
  try {
    const selectedPath = await window.LocalCivilApi.selectFolder();
    if (selectedPath) {
      destination.value = selectedPath;
    } else {
      console.log("Folder selection was canceled.");
    }
  } catch (error) {
    console.error("Error during folder selection:", error);
  }
};

const FileOperation = () => {
  swal({
    title: "<p class='select-none'>Do you want to move the file?</P",
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: "Yes",
    denyButtonText: `Copy`,
  }).then((result) => {
    if (result.isConfirmed) {
      move();
      if (move()) {
        swal({
          icon: "success",
          title: "Moved!",
          text: "The file was moved to the desired location.",
        });
        closeModal();
      } else {
        swal("Error!", "", "error");
      }
    } else if (result.isDenied) {
      copy();
      if (copy()) {
        swal({
          icon: "success",
          title: "Moved!",
          text: "The file was moved to the desired location.",
        });
        closeModal();
      } else {
        swal("Error!", "", "error");
      }
    }
  });
};
// Move
const move = async () => {
  try {
    await window.LocalCivilApi.moveFile(
      source.value,
      destination.value + "\\" + name.value + ".pdf"
    );
  } catch (error) {
    console.error("Error:", error);
  }
};
// Copy
const copy = async () => {
  try {
    await window.LocalCivilApi.copyFile(
      source.value,
      destination.value + "\\" + name.value + ".pdf"
    );
  } catch (error) {
    console.error("Error:", error);
  }
};
</script>

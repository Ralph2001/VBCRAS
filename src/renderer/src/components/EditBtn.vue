<template>
  <SplitButton label="Open File" size="small" :pt="{
    button: {
      root: {
        class:
          'text-gray-900 hover:text-blue-600 bg-white text-sm border border-gray-300 focus:outline-none hover:bg-gray-100  focus:ring-gray-200 font-medium rounded-s text-sm p-2 pr-6 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700',
      },
    },
    menuButton: {
      root: {
        class: 'bg-gray-200 p-2  border border-gray-200 hover:bg-slate-400 ',
      },
    },
  }" @click="openFile(filepath)" :model="items" />
</template>

<script setup>
import SplitButton from "primevue/splitbutton";
import { defineProps, ref, inject, onMounted } from "vue";
import axios from "axios";
import { ComputerName } from "../stores/user";
const swal = inject("$swal");
const scannedId = ref("");

import { scannedDocuments } from "../stores/scanned";
const Documents = scannedDocuments();


const PCName = ComputerName();
onMounted(() => {
  PCName.getUserName();
});


const props = defineProps({
  filepath: {
    required: true,
  },
  id: {
    requird: true,
    type: Number,
  },
});

const items = [
  {
    label: "Open File Path",
    icon: "pi pi-folder",
    command: () => {
      openPath(props.filepath);
    },
  },
  // {
  //   label: "Update Record",
  //   icon: "pi pi-external-link",

  //   command: () => { },
  // },
  {
    label: "Move to Trash",
    icon: "pi pi-times",

    command: () => {
      deleteScanned(props.id);
    },
  },
];

const openFile = async (filepath) => {
  try {
    const check = await window.LocalCivilApi.checkFile(filepath);
    if (!check) {

    }
  } catch (error) {

  }
};
const openPath = async (filepath) => {
  try {
    const check = await window.LocalCivilApi.openFilePath(filepath);
  } catch (error) {

  }
};

const deleteScanned = (id) => {
  swal
    .fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    })
    .then((result) => {
      if (result.isConfirmed) {
        swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });

        remove(id);
      }
    });
};

const remove = async (id) => {
  try {
    let tokenStr = localStorage.getItem('token')
    let device_used_to_delete = PCName.user
    axios
      .delete(`/scanned/delete/${id}&${device_used_to_delete}`, {
        headers: { "Authorization": `Bearer ${tokenStr}` }
      })
      .then((response) => {
        console.log("Document deleted successfully!");
        console.log(response.data);
        Documents.refresh()
      })
      .catch((error) => {
        console.error("Error deleting document:", error);
      });
  } catch (error) { }
};
</script>
